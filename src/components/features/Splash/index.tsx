"use client";
import { useGameLogic } from "@/hooks/useGameLogic";
import { generateUserBoard } from "@/lib/mockup";
import { Player, PlayerActions } from "@/types/game";
import { Button } from "@/components/ui/button";

export const Splash = () => {
  const { startGame, onPlayerAction } = useGameLogic();

  // On a normal game, User should position their ships and when done, UI will tell GameLogic
  // but on this case the User is the only one playing, so no need and we'll mock up this step
  const handleClick = () => {
    startGame();

    const board = generateUserBoard();
    onPlayerAction({
      player: Player.USER,
      action: PlayerActions.SET_BOARD,
      payload: board,
    });
  };

  return (
    <div className="splash flex flex-col w-full md:min-h-[11vw] md:w-[33vw] md:max-w-md items-center justify-center text-center mt-0 md:mt-0">
      <div className="mt-5 px-3 md:px-0">
        <h1>
          <p className="text-2xl font-black mb-5">
            Welcome to your first mission as Chief Commander of the battleship HMS Magnolia!
          </p>
          <p className="text-2xl font-black mb-5">
            Outsmart your opponents and devise the perfect strategy to sink their fleet.
          </p>
        </h1>
      </div>
      <div className="mt-5 mb-7">
        <Button onClick={handleClick} size={"lg"} className="text-xl">
          START
        </Button>
      </div>
    </div>
  );
};
