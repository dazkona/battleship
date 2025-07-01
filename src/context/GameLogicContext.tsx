"use client";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import {
  Board,
  GameResult,
  GameState,
  Player,
  PlayerAction,
  PlayerActions,
  ShipStatus,
  Shot,
  SquareStatus,
} from "../types/game";
import { SHIPS_PER_PLAYER, BOARD_WIDTH, BOARD_HEIGHT, COLUMNS } from "@/lib/constants";
import { useGameLoop } from "@/hooks/useGameLoop";
import { usePubSub } from "@/hooks/usePubSub";
import { EV_ASK_PLAYERS_SETUP_BOARDS, EV_NEW_GAME_STATE, EV_PLAYER_ACTION } from "@/types/pubSubEvents";
import { useCPUPLayer } from "@/hooks/useCPUPlayer";
import { GameLogicContextType } from "@/types/gameLogic";

//-------------------------------------------------------------------
export const GameLogicContext = createContext<GameLogicContextType | undefined>(undefined);

//-------------------------------------------------------------------
interface GameLogicProviderProps {
  children: ReactNode;
}

//-------------------------------------------------------------------
export function GameLogicProvider({ children }: GameLogicProviderProps) {
  const [state, setState] = useState<GameState>(GameState.SPLASH);
  const [timeInState, setTimeInState] = useState<number>(0);
  const [boards, setBoards] = useState<Record<string, Board>>({});
  const [attackingPlayer, setAttackingPlayer] = useState<Player>(Player.NOBODY);
  const [attackedPlayer, setAttackedPlayer] = useState<Player>(Player.NOBODY);
  const [shotList, setShotList] = useState<Shot[]>([]);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  //-------------------------------------------------------
  // This hook instance acts as the CPU player, making decisions and sending back Player events
  const cpuPlayer = useCPUPLayer();

  //-------------------------------------------------------
  const { publish, subscribe } = usePubSub();

  useEffect(() => {
    const unsubscribe = subscribe(EV_PLAYER_ACTION, (data: PlayerAction) => {
      onPlayerAction(data);
    });

    return () => {
      unsubscribe(); // Cleanup on unmount
    };
  }, [subscribe]);

  //-------------------------------------------------------
  const { start: startGameLoop, deltaTimeMs, elapsedTimeMs, stop: stopGameLoop } = useGameLoop();

  useEffect(() => {
    setTimeInState(timeInState + deltaTimeMs);
  }, [deltaTimeMs]);

  //-------------------------------------------------------
  const changeState = (newState: GameState, payload: any) => {
    onActivateState(newState, payload);
    setTimeInState(0);
    setState(newState);
    publish(EV_NEW_GAME_STATE, { newState });
  };

  //-------------------------------------------------------
  const nextTurn = () => {
    // In a standard game, turns alternate each round. On this version only User plays.
    // More complex logic could support additional users.
    setAttackingPlayer(Player.USER);
    setAttackedPlayer(Player.CPU);
    changeState(GameState.WAITING_FOR_FIRE, null);
  };

  //-------------------------------------------------------
  const applyShotResults = (shot: Shot) => {
    if (shot.error) {
      // TODO: Extended error management
    } else {
      const attackedBoard = boards[attackedPlayer];
      attackedBoard.squares[shot.targetSquareIdx] = shot.result;

      if (shot.result === SquareStatus.HIT || shot.result === SquareStatus.SUNK) {
        const shipIdx = boards[attackedPlayer].ships.findIndex((s) => s.partsIdx.includes(shot.targetSquareIdx));
        if (shipIdx !== -1) {
          attackedBoard.ships[shipIdx].hits++;
          if (attackedBoard.ships[shipIdx].hits === attackedBoard.ships[shipIdx].length) {
            attackedBoard.ships[shipIdx].status = ShipStatus.SUNK;
            // Also mark all the ship's board squares as SUNK
            attackedBoard.ships[shipIdx].partsIdx.forEach((pidx) => (attackedBoard.squares[pidx] = SquareStatus.SUNK));
          } else attackedBoard.ships[shipIdx].status = ShipStatus.HIT;
        }
      }

      setBoards((prev) => ({
        ...prev,
        [attackedPlayer]: attackedBoard,
      }));
    }
  };

  //-------------------------------------------------------
  const calculateFinalResult = () => {
    const usedShots = shotList.reduce((acc, s) => (s.player === attackingPlayer ? ++acc : acc), 0);

    setGameResult({
      winner: attackingPlayer,
      usedTime: elapsedTimeMs,
      usedShots,
    });
  };

  //-------------------------------------------------------
  const checkMatch = () => {
    let sinkedShips = 0;
    boards[attackedPlayer].ships.forEach((ship) => {
      if (ship.status === ShipStatus.SUNK) sinkedShips++;
    });

    // If the current attacking player has sunk all the opponent's ships,
    // it's the end of the game
    if (sinkedShips === SHIPS_PER_PLAYER.length) {
      stopGameLoop();
      calculateFinalResult();
      setTimeout(() => {
        changeState(GameState.END, null);
      }, 2000); // There is some delay to mimic real behaviour.
    } else {
      setTimeout(() => {
        nextTurn();
      }, 2000); // There is some delay to mimic real behaviour.
    }
  };

  //-------------------------------------------------------
  const onActivateState = (newState: GameState, payload: any) => {
    if (newState === GameState.PLACE_SHIPS) {
      publish(EV_ASK_PLAYERS_SETUP_BOARDS, {});
    } else if (newState === GameState.SHOOTING) {
      const result = calculateShotResult(payload);
      applyShotResults(result);
      setTimeout(() => {
        changeState(GameState.SHOT_RESULT, { result });
      }, 1000); // There is some delay to mimic real behaviour.
    } else if (newState === GameState.SHOT_RESULT) {
      checkMatch();
    }
  };

  //-------------------------------------------------------
  const resetGame = () => {
    setState(GameState.SPLASH);
    setTimeInState(0);
    setBoards({});
    setAttackingPlayer(Player.NOBODY);
    setAttackedPlayer(Player.NOBODY);
    setShotList([]);
  };

  //-------------------------------------------------------
  const startGame = () => {
    resetGame();
    startGameLoop();
    changeState(GameState.PLACE_SHIPS, null);
  };

  //-------------------------------------------------------
  useEffect(() => {
    // If we're waiting for players to set up their boards and two boards are ready, it's time to start.
    if (state === GameState.PLACE_SHIPS && Object.keys(boards).length === 2) nextTurn();
  }, [boards]);

  //-------------------------------------------------------
  const onPlayerAction = ({ player, action, payload }: PlayerAction) => {
    if (action === PlayerActions.SET_BOARD) {
      setBoards((prev) => ({
        ...prev,
        [player]: payload,
      }));
    } else if (action === PlayerActions.SET_TARGET) {
      if (player === attackingPlayer) {
        changeState(GameState.SHOOTING, payload);
      }
    }
  };

  // Expects format like 'A1', 'B10', etc.
  //-------------------------------------------------------
  const getSquareIdxFromCoordinates = (coord: string) => {
    const match = coord
      .trim()
      .toUpperCase()
      .match(/^([A-J])(10|[1-9])$/);
    if (!match) return null;

    const col = match[1];
    const row = Number(match[2]);

    const x = COLUMNS.findIndex((c) => c === col);

    return (row - 1) * BOARD_WIDTH + x;
  };

  //-------------------------------------------------------
  const checkIfSunk = (result: Shot): boolean => {
    const ship = boards[attackedPlayer].ships.find((s) => s.partsIdx.includes(result.targetSquareIdx));
    if (ship && ship.hits === ship.length - 1) return true;
    return false;
  };

  //-------------------------------------------------------
  const calculateShotResult = (targetSquare: string): Shot => {
    let result: Shot = {
      player: attackingPlayer,
      targetSquare,
      time: elapsedTimeMs,
      result: SquareStatus.WATER,
      targetSquareIdx: getSquareIdxFromCoordinates(targetSquare) || -1,
    };

    if (result.targetSquareIdx) {
      if (boards[attackedPlayer].squares[result.targetSquareIdx] === SquareStatus.SHIP) {
        if (checkIfSunk(result)) result.result = SquareStatus.SUNK;
        else result.result = SquareStatus.HIT;
      } else if (boards[attackedPlayer].squares[result.targetSquareIdx] === SquareStatus.WATER) {
        result.result = SquareStatus.MISS;
      } else {
        result.error = "Get a cell: " + boards[attackedPlayer].squares[result.targetSquareIdx];
      }
    } else {
      result.error = "Can't convert from coor to cell idx " + targetSquare;
    }

    setShotList((prevShots) => [...prevShots, result]);

    return result;
  };

  //-------------------------------------------------------
  const value = useMemo(
    () => ({ state, timeInState, attackingPlayer, attackedPlayer, boards, startGame, onPlayerAction, gameResult }),
    [state, timeInState, attackingPlayer, attackedPlayer, boards, gameResult]
  );

  return <GameLogicContext.Provider value={value}>{children}</GameLogicContext.Provider>;
}
