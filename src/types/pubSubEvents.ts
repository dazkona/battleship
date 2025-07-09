import { GameState, PlayerAction } from "./game";

export const EV_PLAYER_ACTION = "PLAYER_ACTION";
export const EV_ASK_PLAYERS_SETUP_BOARDS = "ASK_PLAYERS_SETUP_BOARDS";
export const EV_NEW_GAME_STATE = "NEW_GAME_STATE";

export interface PubSubEvents {
  EV_PLAYER_ACTION: { payload: PlayerAction };
  EV_ASK_PLAYERS_SETUP_BOARDS: {};
  EV_NEW_GAME_STATE: { newState: GameState };
  // Add additional events here
}
