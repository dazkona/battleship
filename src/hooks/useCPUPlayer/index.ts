import { EV_ASK_PLAYERS_SETUP_BOARDS, EV_PLAYER_ACTION } from "@/types/pubSubEvents";
import { usePubSub } from "../usePubSub";
import { generateCpuBoard } from "./generateCpuBoard";
import { Player, PlayerActions } from "@/types/game";
import { useEffect, useRef } from "react";

//-------------------------------------------------------------------
export const useCPUPlayer = () => {
  const { subscribe, publish } = usePubSub();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = subscribe(EV_ASK_PLAYERS_SETUP_BOARDS, () => {
      try {
        const board = generateCpuBoard();
        timeoutRef.current = setTimeout(() => {
          try {
            publish(EV_PLAYER_ACTION, { player: Player.CPU, action: PlayerActions.SET_BOARD, payload: board });
          } catch (err) {
            // Optionally publish an error event or log
            console.error("Failed to publish CPU board setup:", err);
          }
        }, 4000);
      } catch (err) {
        // Optionally publish an error event or log
        console.error("Failed to generate CPU board:", err);
      }
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      unsubscribe();
    };
  }, [subscribe]);
};
