import { Board, Direction, Player, Ship, ShipStatus, SquareStatus } from "@/types/game";
import { BOARD_HEIGHT, BOARD_WIDTH, COLUMNS, SHIPS_PER_PLAYER } from "@/lib/constants";
import { getRandomInt } from "@/lib/helpers";
import { X } from "lucide-react";

//--------------------------------------------------------
const getSquareFromArray = (x: number, y: number, squares: SquareStatus[]) => {
  return squares[BOARD_WIDTH * y + x];
};

//-------------------------------------------------------
const checkPositionEmpty = (
  squares: SquareStatus[],
  x: number,
  y: number,
  direction: Direction,
  shipLength: number
) => {
  let emptySpaces = 0;
  if (direction === Direction.HORIZONTAL) {
    for (let _x = x; _x < x + shipLength; _x++) {
      const square = getSquareFromArray(_x, y, squares);
      if (square === SquareStatus.WATER) emptySpaces++;
    }
  } else {
    for (let _y = y; _y < y + shipLength; _y++) {
      const square = getSquareFromArray(x, _y, squares);
      if (square === SquareStatus.WATER) emptySpaces++;
    }
  }
  return emptySpaces === shipLength;
};

/*-------------------------------------------------------
	The algorithm instead of searching all the board and then check if the ship fits, 
	searchs only over the squares with enough distance to the borders
-------------------------------------------------------*/
const findEmptyPositionForShip = (squares: SquareStatus[], shipLength: number) => {
  let x = getRandomInt(BOARD_WIDTH - shipLength);
  let y = getRandomInt(BOARD_HEIGHT - shipLength);
  let direction = getRandomInt(1000) % 2 ? Direction.HORIZONTAL : Direction.VERTICAL;

  if (checkPositionEmpty(squares, x, y, direction, shipLength)) {
    return { x, y, direction };
  } else {
    // TODO: Avoid recursion and set a limit to the number of attempts before throwing an exception
    return findEmptyPositionForShip(squares, shipLength);
  }
};

//-------------------------------------------------------
const getShipPartsIdx = ({
  x,
  y,
  direction,
  shipLength,
}: {
  x: number;
  y: number;
  direction: Direction;
  shipLength: number;
}) => {
  let parts = [];

  if (direction === Direction.HORIZONTAL) {
    for (let _x = x; _x < x + shipLength; _x++) {
      parts.push(BOARD_WIDTH * y + _x);
    }
  } else {
    for (let _y = y; _y < y + shipLength; _y++) {
      parts.push(BOARD_WIDTH * _y + x);
    }
  }

  return parts;
};

//-------------------------------------------------------
const getShipInfo = (shipLength: number, position: { x: number; y: number; direction: Direction }) => {
  let ship: Ship = {
    status: ShipStatus.UNTOUCHED,
    length: shipLength,
    hits: 0,
    firstSquare: `${COLUMNS[position.x]}${position.y + 1}`,
    lastSquare:
      position.direction === Direction.HORIZONTAL
        ? `${COLUMNS[position.x + shipLength]}${position.y + 1}`
        : `${COLUMNS[position.x]}${position.y + 1 + shipLength}`,
    x: position.x,
    y: position.y,
    direction: position.direction,
    partsIdx: getShipPartsIdx({ x: position.x, y: position.y, direction: position.direction, shipLength }),
  };

  return ship;
};

//-------------------------------------------------------
export const generateCpuBoard = () => {
  let board: Board = {
    player: Player.CPU,
    ships: [],
    squares: [...new Array(BOARD_WIDTH * BOARD_HEIGHT)].map(() => SquareStatus.WATER),
  };

  SHIPS_PER_PLAYER.forEach((shipLength) => {
    const newShip = getShipInfo(shipLength, findEmptyPositionForShip(board.squares, shipLength));
    // Fill the board squares with SHIP value
    if (newShip.direction === Direction.HORIZONTAL) {
      for (let _x = newShip.x; _x < newShip.x + shipLength; _x++) {
        board.squares[BOARD_WIDTH * newShip.y + _x] = SquareStatus.SHIP;
      }
    } else {
      for (let _y = newShip.y; _y < newShip.y + shipLength; _y++) {
        board.squares[BOARD_WIDTH * _y + newShip.x] = SquareStatus.SHIP;
      }
    }
    board.ships.push(newShip);
  });

  return board;
};
