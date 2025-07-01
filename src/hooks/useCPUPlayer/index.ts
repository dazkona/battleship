import { EV_ASK_PLAYERS_SETUP_BOARDS, EV_PLAYER_ACTION } from "@/types/pubSubEvents";
import { usePubSub } from "../usePubSub";
import { generateCpuBoard } from "./generateCpuBoard";
import { Player, PlayerActions } from "@/types/game";
import { useEffect } from "react";

//-------------------------------------------------------------------
export const useCPUPLayer = () => {
  const { subscribe, publish } = usePubSub();

  useEffect(() => {
    const unsubscribe = subscribe(EV_ASK_PLAYERS_SETUP_BOARDS, () => {
      const board = generateCpuBoard();
      setTimeout(() => {
        publish(EV_PLAYER_ACTION, { player: Player.CPU, action: PlayerActions.SET_BOARD, payload: board });
      }, 4000); // There is some delay to mimic real behaviour.
    });

    return () => {
      unsubscribe(); // Cleanup on unmount
    };
  }, [subscribe]);
};
