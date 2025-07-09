import { Board, Player, SquareStatus } from "@/types/game";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants";

//-------------------------------------------------------
export const generateUserBoard = () => {
  let board: Board = {
    player: Player.USER,
    ships: [],
    squares: [...new Array(BOARD_WIDTH * BOARD_HEIGHT)].map(() => SquareStatus.WATER),
  };

  return board;
};
