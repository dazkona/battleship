"use client";
import { GameLogicContext } from "@/context/GameLogicContext";
import { useContext } from "react";

//-------------------------------------------------------------------
export const useGameLogic = () => {
  const context = useContext(GameLogicContext);
  if (context === undefined) throw new Error("GameLogicContext must be defined");

  return context;
};
