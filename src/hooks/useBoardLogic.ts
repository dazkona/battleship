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
    let unsubscribe = () => {};
    try {
      unsubscribe = subscribe(EV_NEW_GAME_STATE, ({ newState }: { newState: GameState }) => {
        if (newState === GameState.WAITING_FOR_FIRE && attackingPlayer === Player.USER) {
          setShowYourTurn((prev) => {
            if (!prev) return true;
            return prev;
          });
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => setShowYourTurn(false), TIMEOUT_YOURTURN_ALERT);
        }
      });
    } catch (err) {
      console.error("Failed to subscribe to EV_NEW_GAME_STATE:", err);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      try {
        unsubscribe();
      } catch (err) {
        console.error("Failed to unsubscribe from EV_NEW_GAME_STATE:", err);
      }
    };
  }, [subscribe, attackingPlayer]);

  const getSquareFromArray = useCallback((x: number, y: number, board: BoardType | undefined): SquareStatus | null => {
    if (board) {
      const squareIdx = BOARD_WIDTH * y + x;
      if (squareIdx >= 0 && squareIdx < board.squares.length) return board.squares[squareIdx];
    }
    return null;
  }, []);

  const getSquareCell = useCallback(
    (x: number, y: number): SquareStatus | null => {
      const board = boards[isMyBoard ? Player.USER : Player.CPU];
      return getSquareFromArray(x - 1, y - 1, board);
    },
    [boards, isMyBoard, getSquareFromArray]
  );

  return { showYourTurn, getSquareCell, boards };
}
