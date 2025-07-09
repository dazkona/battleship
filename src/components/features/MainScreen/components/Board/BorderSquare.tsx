import { BOARD_WIDTH } from "@/lib/constants";

interface BorderSquareProps {
  x: number;
  y: number;
  value: string;
}

export const BorderSquare = ({ x, y, value }: BorderSquareProps) => {
  return (
    <div
      className="border-square 
	  	flex justify-center items-center 
		md:min-w-[1vw]! md:min-h-[1vw]!
		border border-transparent 
		text-base md:text-sm font-bold select-none"
      style={{ width: `calc(100%/${BOARD_WIDTH + 2})`, aspectRatio: "1/1", minWidth: 0, minHeight: 0 }}>
      {value}
    </div>
  );
};
