import { render, screen, fireEvent } from "@testing-library/react";
import { Actions } from "./index";
import { GameState, PlayerActions, Player } from "@/types/game";

const getMockGameLogicContextType = (onPlayerAction: jest.Mock, startGame: jest.Mock) => {
  return {
    state: GameState.WAITING_FOR_FIRE,
    timeInState: 0,
    attackingPlayer: Player.USER,
    attackedPlayer: Player.CPU,
    boards: {},
    gameResult: null,
    onPlayerAction,
    startGame,
  };
};

jest.mock("@/hooks/useGameLogic", () => {
  let onPlayerAction = jest.fn();
  let startGame = jest.fn();
  return {
    useGameLogic: () => getMockGameLogicContextType(onPlayerAction, startGame),
    __setOnPlayerAction: (fn: jest.Mock) => {
      onPlayerAction = fn;
    },
    __setStartGame: (fn: jest.Mock) => {
      startGame = fn;
    },
  };
});

const { __setOnPlayerAction, __setStartGame } = require("@/hooks/useGameLogic");

describe("Actions component", () => {
  beforeEach(() => {
    __setOnPlayerAction(jest.fn());
    __setStartGame(jest.fn());
  });

  it("renders input and button when waiting for fire", () => {
    render(<Actions />);
    expect(screen.getByPlaceholderText(/type target coordinates/i)).toBeInTheDocument();
    expect(screen.getByText(/shoot!/i)).toBeInTheDocument();
  });

  it("calls onPlayerAction with valid coordinates", () => {
    const onPlayerAction = jest.fn();
    __setOnPlayerAction(onPlayerAction);
    render(<Actions />);
    fireEvent.change(screen.getByPlaceholderText(/type target coordinates/i), { target: { value: "E7" } });
    fireEvent.click(screen.getByText(/shoot!/i));
    expect(onPlayerAction).toHaveBeenCalledWith({
      player: Player.USER,
      action: PlayerActions.SET_TARGET,
      payload: "E7",
    });
  });

  it("does not call onPlayerAction with invalid coordinates", () => {
    const onPlayerAction = jest.fn();
    __setOnPlayerAction(onPlayerAction);
    render(<Actions />);
    fireEvent.change(screen.getByPlaceholderText(/type target coordinates/i), { target: { value: "ZZ" } });
    fireEvent.click(screen.getByText(/shoot!/i));
    expect(onPlayerAction).not.toHaveBeenCalled();
  });
});
