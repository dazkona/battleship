import { useEffect, useState, useCallback } from "react";
import { useGameLogic } from "@/hooks/useGameLogic";
import { usePubSub } from "@/hooks/usePubSub";
import { EV_NEW_GAME_STATE } from "@/types/pubSubEvents";
import { GameState, Player, Board as BoardType, SquareStatus } from "@/types/game";
import { TIMEOUT_YOURTURN_ALERT, BOARD_WIDTH } from "@/lib/constants";

export function useBoardLogic(isMyBoard: boolean) {
  const { boards, state: gameState, attackingPlayer } = useGameLogic();
  const [showYourTurn, setShowYourTurn] = useState<boolean>(true);
  const { subscribe } = usePubSub();

  useEffect(() => {
    const timeoutId = setTimeout(() => setShowYourTurn(false), TIMEOUT_YOURTURN_ALERT);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const unsubscribe = subscribe(EV_NEW_GAME_STATE, ({ newState }: { newState: GameState }) => {
      if (newState === GameState.WAITING_FOR_FIRE && attackingPlayer === Player.USER) {
        setShowYourTurn(true);
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setShowYourTurn(false), TIMEOUT_YOURTURN_ALERT);
      }
    });
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [subscribe, attackingPlayer]);

  const getSquareFromArray = (x: number, y: number, board: BoardType | undefined): SquareStatus | null => {
    if (board) {
      const squareIdx = BOARD_WIDTH * y + x;
      if (squareIdx >= 0 && squareIdx < board.squares.length) return board.squares[squareIdx];
    }
    return null;
  };

  const getSquareCell = useCallback(
    (x: number, y: number): SquareStatus | null => {
      const board = boards[isMyBoard ? Player.USER : Player.CPU];
      return getSquareFromArray(x - 1, y - 1, board);
    },
    [boards, isMyBoard]
  );

  return { showYourTurn, getSquareCell, boards };
}
