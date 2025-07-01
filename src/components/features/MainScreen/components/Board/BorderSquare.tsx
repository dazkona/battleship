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
		md:min-w-[36px]! md:min-h-[36px]!
		border border-transparent 
		text-base md:text-sm font-bold select-none"
      style={{ width: "calc(100%/12)", aspectRatio: "1/1", minWidth: 0, minHeight: 0 }}>
      {value}
    </div>
  );
};
