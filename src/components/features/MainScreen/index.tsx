"use client";
import { Fleet } from "./components/Fleet";
import { BOARD_WIDTH } from "@/lib/constants";

export const MainScreen = () => {
  return (
    <div
      className={`main-screen 
			flex flex-col items-center justify-center md:w-[33vw] py-2 md:py-6
			min-w-auto md:min-w-[${(BOARD_WIDTH + 2) * 1.25}vw]`}>
      <Fleet isMyBoard={false} />
    </div>
  );
};
