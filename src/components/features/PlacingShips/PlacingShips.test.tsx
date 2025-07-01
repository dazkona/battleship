import { render, screen } from "@testing-library/react";
import { PlacingShips } from "./index";
import { GameState, Player } from "@/types/game";

const getMockGameLogicContextType = () => {
  return {
    state: GameState.WAITING_FOR_FIRE,
    timeInState: 0,
    attackingPlayer: Player.USER,
    attackedPlayer: Player.CPU,
    boards: {
      [Player.USER]: {
        ships: [],
        player: Player.USER,
        squares: [],
      },
      [Player.CPU]: { ships: [], player: Player.CPU, squares: [] },
    },
    gameResult: null,
    onPlayerAction: jest.fn(),
    startGame: jest.fn(),
  };
};

jest.mock("@/hooks/useGameLogic", () => ({
  useGameLogic: () => getMockGameLogicContextType(),
}));

describe("PlacingShips component", () => {
  it("renders wait for user message", () => {
    render(<PlacingShips />);
    expect(screen.getByText(/Players are placing their ships... wait/i)).toBeInTheDocument();
  });
});
