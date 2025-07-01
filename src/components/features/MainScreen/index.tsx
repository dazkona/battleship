"use client";
import { Fleet } from "./components/Fleet";
import { Actions } from "./components/Actions";

export const MainScreen = () => {
  return (
    <div
      className="main-screen 
			flex flex-col items-center justify-center md:w-[33vw] py-2 md:py-6
			min-w-auto md:min-w-[550px]">
      <Fleet isMyBoard={false} />
    </div>
  );
};
