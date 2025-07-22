"use client";
import { BorderSquare } from "./BorderSquare";
import { Square } from "./Square";
import { Board as BoardType, GameState, Player, SquareStatus } from "@/types/game";
import { BOARD_WIDTH, BOARD_HEIGHT, COLUMNS, TIMEOUT_YOURTURN_ALERT } from "@/lib/constants";
import { useGameLogic } from "@/hooks/useGameLogic";
import { usePubSub } from "@/hooks/usePubSub";
import { EV_NEW_GAME_STATE } from "@/types/pubSubEvents";
import { useEffect, useState } from "react";

interface BoardProps {
  isMyBoard: boolean;
}

export const Board = ({ isMyBoard }: BoardProps) => {
  const { boards, state: gameState, attackingPlayer } = useGameLogic();
  const [showYourTurn, setShowYourTurn] = useState<boolean>(true);
  const { subscribe } = usePubSub();

  // Initial advice
  //--------------------------------------------------------
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowYourTurn(false);
    }, TIMEOUT_YOURTURN_ALERT);

    return () => clearTimeout(timeoutId); // cleanup
  }, []);

  // Subscribe to EV_NEW_GAME_STATE event
  //--------------------------------------------------------
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const unsubscribe = subscribe(EV_NEW_GAME_STATE, ({ newState }: { newState: GameState }) => {
      if (newState === GameState.WAITING_FOR_FIRE && attackingPlayer === Player.USER) {
        setShowYourTurn(true);
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setShowYourTurn(false);
        }, TIMEOUT_YOURTURN_ALERT);
      }
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      unsubscribe(); // Cleanup on unmount
    };
  }, []);

  //--------------------------------------------------------
  const getSquareFromArray = (x: number, y: number, board: BoardType | undefined): SquareStatus | null => {
    if (board) {
      const squareIdx = BOARD_WIDTH * y + x;
      if (squareIdx >= 0 && squareIdx < board.squares.length) return board.squares[squareIdx];
    }
    return null;
  };

  //--------------------------------------------------------
  const renderSquares = () => {
    const squares = [];

    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      const verticalColBorderVal = y > 0 ? y.toString() : "";

      squares.push(<BorderSquare key={`0-${y}`} x={0} y={y} value={verticalColBorderVal} />);
      for (let x = 1; x <= BOARD_WIDTH; x++) {
        if (y === 0) {
          squares.push(<BorderSquare key={`${x}-${y}`} x={x} y={y} value={COLUMNS[x - 1]} />);
        } else
          squares.push(
            <Square
              key={`${x}-${y}`}
              x={x}
              y={y}
              coordinate={`${COLUMNS[x - 1]}${y}`}
              cell={getSquareFromArray(x - 1, y - 1, boards[isMyBoard ? Player.USER : Player.CPU])}
              isMyBoard={isMyBoard}
            />
          );
      }
      squares.push(<BorderSquare key={`${BOARD_WIDTH + 1}-${y}`} x={0} y={y} value={verticalColBorderVal} />);
    }

    return squares;
  };

  //--------------------------------------------------------
  return (
    <div
      className={`board relative 
			flex flex-row flex-wrap 
			w-full md:w-[${BOARD_WIDTH + 2}vw] md:max-w-[${BOARD_WIDTH + 2}vw] md:min-w-[${BOARD_WIDTH + 2}vw]
			md:mr-auto md:ml-auto`}>
      <div className="squares-container w-full h-full flex flex-row flex-wrap">{renderSquares()}</div>
      {showYourTurn && (
        <div
          className={`your-turn-signal
				absolute h-full flex justify-center text-center items-center w-full 
				text-4xl text-blue-800
				animate__animated animate__bounceInDown`}
          style={{
            fontFamily: "var(--font-special-elite)",
            textShadow:
              "-2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF, 2px 2px 0 #FFF, 0px 2px 0 #FFF, 2px 0px 0 #FFF, 0px -2px 0 #FFF, -2px 0px 0 #FFF",
          }}>
          YOUR TURN!
        </div>
      )}
    </div>
  );
};
