"use client";
import { Loader2Icon } from "lucide-react";

export const PlacingShips = () => {
  return (
    <div className="placing-ships flex flex-col w-full min-h-[40vh] md:min-h-[11vw] md:w-[33vw] md:max-w-md items-center justify-center text-center mt-0 md:mt-0">
      <div className="text-2xl font-gray-800 mb-7 mt-5">
        <h2>Players are placing their ships... wait</h2>
      </div>
      <div className="mb-10">
        <Loader2Icon className="animate-spin w-[10vw] h-[10vw] md:w-[3vw] md:h-[3vw]" />
      </div>
    </div>
  );
};
