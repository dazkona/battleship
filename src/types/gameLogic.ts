import { Board, GameResult, GameState, Player, PlayerAction } from "./game";

//-------------------------------------------------------------------
export interface GameLogicContextType {
  state: GameState;
  timeInState: number;
  attackingPlayer: Player;
  attackedPlayer: Player;
  boards: Record<string, Board>;
  gameResult: GameResult | null;

  startGame: () => void;
  onPlayerAction: (action: PlayerAction) => void;
}
