"use client";
import { Player, GameState, PlayerActions } from "@/types/game";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { BOARD_HEIGHT, BOARD_WIDTH } from "@/lib/constants";

export const Actions = () => {
  const { state: gameState, onPlayerAction } = useGameLogic();
  const [targetTxt, setTarget] = useState("");

  //--------------------------------------------------------
  const checkValidCoordinates = (coord: string) => {
    // Dynamically build regex for columns and row numbers based on BOARD_WIDTH and BOARD_HEIGHT
    const colPattern = `[A-${String.fromCharCode(65 + BOARD_WIDTH - 1)}a-${String.fromCharCode(97 + BOARD_WIDTH - 1)}]`;
    let rowPattern = "[1-9]";
    if (BOARD_HEIGHT > 9) {
      const twoDigitRanges = [];
      for (let i = 10; i <= BOARD_HEIGHT; i++) {
        twoDigitRanges.push(i);
      }
      rowPattern = `(?:${twoDigitRanges.join("|")}|[1-9])`;
    }
    const regex = new RegExp(`^${colPattern}(${rowPattern})$`);
    return regex.test(coord.trim());
  };

  //--------------------------------------------------------
  const handleClickShoot = () => {
    if (checkValidCoordinates(targetTxt))
      onPlayerAction({ player: Player.USER, action: PlayerActions.SET_TARGET, payload: targetTxt.toUpperCase() });

    setTarget("");
  };

  //--------------------------------------------------------
  return (
    <div
      className="actions 
		flex flex-row gap-3 p-1 w-full min-h-11
		border border-gray-700 mt-5 rounded-md">
      {gameState === GameState.WAITING_FOR_FIRE && (
        <>
          <div className="flex items-center ml-2">Target: </div>
          <Input
            value={targetTxt}
            onChange={(e) => setTarget(e.target.value)}
            placeholder={"Type target coordinates like E7"}
          />
          <Button onClick={handleClickShoot}>Shoot!</Button>
        </>
      )}
    </div>
  );
};
