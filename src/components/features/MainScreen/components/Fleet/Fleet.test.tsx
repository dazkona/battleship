import { render, screen } from "@testing-library/react";
import { Fleet } from "./index";
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

describe("Fleet component", () => {
  it("renders the OPONENT'S FLEET title", () => {
    render(<Fleet isMyBoard={false} />);
    expect(screen.getByText(/OPONENT'S FLEET/i)).toBeInTheDocument();
  });
});
