import { render, screen } from "@testing-library/react";
import { Ships } from "./index";
import { Direction, GameState, Player, ShipStatus } from "@/types/game";

const getMockGameLogicContextType = () => {
  return {
    state: GameState.WAITING_FOR_FIRE,
    timeInState: 0,
    attackingPlayer: Player.USER,
    attackedPlayer: Player.CPU,
    boards: {
      [Player.USER]: {
        ships: [
          {
            status: ShipStatus.UNTOUCHED,
            hits: 0,
            length: 3,
            firstSquare: "A1",
            lastSquare: "A2",
            x: 1,
            y: 1,
            direction: Direction.HORIZONTAL,
            partsIdx: [],
          },
          {
            status: ShipStatus.HIT,
            hits: 1,
            length: 3,
            firstSquare: "A1",
            lastSquare: "A2",
            x: 1,
            y: 1,
            direction: Direction.HORIZONTAL,
            partsIdx: [],
          },
          {
            status: ShipStatus.SUNK,
            hits: 3,
            length: 3,
            firstSquare: "A1",
            lastSquare: "A2",
            x: 1,
            y: 1,
            direction: Direction.HORIZONTAL,
            partsIdx: [],
          },
        ],
        player: Player.USER,
        squares: [],
      },
      [Player.CPU]: {
        ships: [
          {
            status: ShipStatus.UNTOUCHED,
            hits: 0,
            length: 3,
            firstSquare: "A1",
            lastSquare: "A2",
            x: 1,
            y: 1,
            direction: Direction.HORIZONTAL,
            partsIdx: [],
          },
          {
            status: ShipStatus.HIT,
            hits: 1,
            length: 3,
            firstSquare: "A1",
            lastSquare: "A2",
            x: 1,
            y: 1,
            direction: Direction.HORIZONTAL,
            partsIdx: [],
          },
          {
            status: ShipStatus.SUNK,
            hits: 3,
            length: 3,
            firstSquare: "A1",
            lastSquare: "A2",
            x: 1,
            y: 1,
            direction: Direction.HORIZONTAL,
            partsIdx: [],
          },
        ],
        player: Player.CPU,
        squares: [],
      },
    },
    gameResult: null,
    onPlayerAction: jest.fn(),
    startGame: jest.fn(),
  };
};

jest.mock("@/hooks/useGameLogic", () => ({
  useGameLogic: () => getMockGameLogicContextType(),
}));

describe("Ships component", () => {
  it("renders all ships with correct hit/length display", () => {
    render(<Ships isMyBoard={true} />);
    expect(screen.getAllByText(/\d\/\d/)).toHaveLength(3);
  });
});
