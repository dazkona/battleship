"use client";
import { Board as BoardType, Player, Ship as ShipType, GameState, PlayerActions } from "@/types/game";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const Actions = () => {
  const { state: gameState, onPlayerAction } = useGameLogic();
  const [targetTxt, setTarget] = useState("");

  //--------------------------------------------------------
  const checkValidCoordinates = (coord: string) => {
    // Match a single letter (A-J or a-j) followed by 1 or 2 digits (1-10)
    return /^[A-Ja-j](10|[1-9])$/.test(coord.trim());
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
