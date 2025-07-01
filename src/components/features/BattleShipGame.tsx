"use client";
import { GameState } from "@/types/game";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Splash } from "./Splash";
import { PlacingShips } from "./PlacingShips";
import { MainScreen } from "./MainScreen";
import { FinalScreen } from "./FinalScreen";

export const BattleShipGame = () => {
  const { state } = useGameLogic();

  //-----------------------------------------------------------------
  const renderActiveScreen = () => {
    switch (state) {
      case GameState.SPLASH:
        return <Splash />;
      case GameState.PLACE_SHIPS:
        return <PlacingShips />;
      case GameState.END:
        return <FinalScreen />;
      default:
        return <MainScreen />;
    }
  };

  return (
    <div
      className="battleshipgame 
			flex flex-col items-center justify-center w-full mx-auto md:min-h-screen md:mt-0 
			bg-cover bg-center md:w-[33vw] bg-[#f4f2ee] min-w-auto md:min-w-[620px]">
      <div
        className={`game-name text-6xl text-white w-full text-center mt-10 md:mt-0`}
        style={{
          fontFamily: "var(--font-special-elite)",
          textShadow:
            "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0px 2px 0 #000, 2px 0px 0 #000, 0px -2px 0 #000, -2px 0px 0 #000",
        }}>
        BATTLESHIPS
      </div>
      {renderActiveScreen()}
    </div>
  );
};
