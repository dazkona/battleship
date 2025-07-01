"use client";
import { Button } from "@/components/ui/button";
import { useGameLogic } from "@/hooks/useGameLogic";
import { formatTimeFromMsToPretty } from "@/lib/helpers";
import { generateUserBoard } from "@/lib/mockup";
import { Player, PlayerActions } from "@/types/game";

export const FinalScreen = () => {
  const { gameResult, startGame, onPlayerAction } = useGameLogic();

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
    <div className="final-screen flex flex-col items-center justify-center bg-white md:w-[33vw] py-2 md:py-15">
      <div className="text-3xl font-black mb-5">
        <h1>Nice game!</h1>
      </div>
      <div className="text-2xl font-gray-800 mb-5">
        <h2>
          <span className="mr-2 text-gray-500">Winner:</span>
          {gameResult?.winner}
        </h2>
        <h2>
          <span className="mr-2 text-gray-500">Time:</span>
          {gameResult?.usedTime !== undefined ? formatTimeFromMsToPretty(gameResult.usedTime) : ""}
        </h2>
        <h2>
          <span className="mr-2 text-gray-500">Shots:</span>
          {gameResult?.usedShots}
        </h2>
      </div>
      <div>
        <Button onClick={handleClick}>Restart a new game!</Button>
      </div>
    </div>
  );
};
