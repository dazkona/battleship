import { render, screen } from "@testing-library/react";
import { Splash } from "./index";
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

describe("Splash component", () => {
  it("renders welcome message and start button", () => {
    render(<Splash />);
    expect(
      screen.getByText(/Welcome to your first mission as Chief Commander of the battleship HMS Magnolia/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/start/i)).toBeInTheDocument();
  });
});
