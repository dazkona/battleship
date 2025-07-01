export enum GameState {
  SPLASH = "splash",
  PLACE_SHIPS = "place_ships",
  WAITING_FOR_FIRE = "waiting_for_fire",
  SHOOTING = "shooting",
  SHOT_RESULT = "shot_result",
  END = "end",
}

export enum Player {
  NOBODY = "nobody",
  CPU = "cpu",
  USER = "user",
}

export enum PlayerActions {
  SET_BOARD = "set_board",
  SET_TARGET = "set_target",
}

export interface PlayerAction {
  player: Player;
  action: PlayerActions;
  payload: any;
}

export enum ShipStatus {
  UNTOUCHED = "untouched",
  HIT = "hit",
  SUNK = "sunk",
}

export enum SquareStatus {
  WATER = "WATER",
  SHIP = "SHIP",
  MISS = "MISS",
  HIT = "HIT",
  SUNK = "SUNK",
}

export enum Direction {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
}

export interface Ship {
  status: ShipStatus;
  length: number;
  hits: number;
  firstSquare: string; // cached value
  lastSquare: string; // cached value
  x: number;
  y: number;
  direction: Direction;
  partsIdx: number[]; // cached values
}

export interface Board {
  player: Player;
  ships: Ship[];
  squares: SquareStatus[];
}

export interface Shot {
  player: Player;
  targetSquare: string;
  targetSquareIdx: number; // cached value
  time: number; // elapsedTime
  result: SquareStatus;
  error?: string;
}

export interface GameResult {
  winner: Player;
  usedTime: number;
  usedShots: number;
}
