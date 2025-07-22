import { useGameLogic } from "@/hooks/useGameLogic";
import { BOARD_WIDTH } from "@/lib/constants";
import { GameState, Player, PlayerActions, SquareStatus } from "@/types/game";
import { Ship, Waves, X, Crosshair, Ban } from "lucide-react";

interface SquareProps {
  x: number;
  y: number;
  cell: SquareStatus | null;
  coordinate: string;
  isMyBoard: boolean;
}

export const Square = ({ x, y, cell, isMyBoard, coordinate }: SquareProps) => {
  const { state: gameState, onPlayerAction } = useGameLogic();

  const handleClick = () => {
    if (
      gameState === GameState.WAITING_FOR_FIRE &&
      !isMyBoard &&
      (cell === SquareStatus.WATER || cell === SquareStatus.SHIP)
    ) {
      onPlayerAction({ player: Player.USER, action: PlayerActions.SET_TARGET, payload: coordinate });
    }
  };

  let content = <Waves color="#6b99c2" />;
  let bgColour = "bg-blue-100";
  if (cell === SquareStatus.MISS) {
    content = <X color="#e69e9e" />;
    bgColour = "bg-red-50";
  } else if (cell === SquareStatus.HIT) {
    content = <Crosshair color="#d2770f" />;
    bgColour = "bg-yellow-400";
  } else if (cell === SquareStatus.SUNK) {
    content = <Ban color="#d20f0f" />;
    bgColour = "bg-red-300";
  } else if (isMyBoard && cell === SquareStatus.SHIP) {
    content = <Ship />;
    bgColour = "bg-blue-100";
  }

  let borderHover = "";
  if (gameState === GameState.WAITING_FOR_FIRE && !isMyBoard) {
    if (cell === SquareStatus.WATER || cell === SquareStatus.SHIP) {
      borderHover = "hover:border-green-500 hover:border-dashed hover:border-4 cursor-crosshair";
    } else {
      borderHover = "hover:border-red-500 hover:border-dashed hover:border-4 cursor-crosshair";
    }
  }

  return (
    <div
      className={`square square-${coordinate} square-${cell}
		flex flex-col justify-center content-center items-center 
		md:min-w-[1vw]! md:min-h-[1vw]!
		border-1 border-blue-400 ${bgColour} ${borderHover}`}
      style={{ width: `calc(100%/${BOARD_WIDTH + 2})`, aspectRatio: "1/1", minWidth: 0, minHeight: 0 }}
      onClick={handleClick}>
      {content}
    </div>
  );
};
