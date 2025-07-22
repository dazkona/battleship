"use client";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Actions } from "../Actions";
import { Board } from "../Board";
import { Ships } from "../Ships";

interface ShipsProps {
  isMyBoard: boolean;
}

export const Fleet = ({ isMyBoard }: ShipsProps) => {
  return (
    <div
      className="fleet 
			flex flex-col w-full md:w-[33vw] md:max-w-md
			min-w-auto md:min-w-[550px]">
      <div
        className="fleet-title 
	  		bg-black text-white rounded w-full text-center py-2 mb-2 font-bold
			text-2xl md:text-base">
        {isMyBoard ? "MY FLEET" : "OPONENT'S FLEET"}
      </div>
      <ErrorBoundary fallback={<div>Failed to load the board. Please refresh.</div>}>
        <Board isMyBoard={isMyBoard} />
      </ErrorBoundary>
      <Ships isMyBoard={isMyBoard} />
      <Actions />
    </div>
  );
};
