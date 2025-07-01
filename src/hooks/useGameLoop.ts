"use client";
import { GameLoopContext } from "@/context/GameLoopContext";
import { useContext } from "react";

//-------------------------------------------------------------------
export const useGameLoop = () => {
  const context = useContext(GameLoopContext);
  if (context === undefined) throw new Error("GameLoopContext must be defined");

  return context;
};
