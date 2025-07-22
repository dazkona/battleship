"use client";
import React from "react";
import { BorderSquare as BorderSquareBase } from "./BorderSquare";
import { Square as SquareBase } from "./Square";
import { BOARD_WIDTH, BOARD_HEIGHT, COLUMNS } from "@/lib/constants";
import { useMemo } from "react";
import { useBoardLogic } from "@/hooks/useBoardLogic";
import "./Board.css";

interface BoardProps {
  isMyBoard: boolean;
}

// Memoized components for performance
const BorderSquare = React.memo(BorderSquareBase);
const Square = React.memo(SquareBase);

export const Board = ({ isMyBoard }: BoardProps) => {
  const { showYourTurn, getSquareCell, boards } = useBoardLogic(isMyBoard);

  const squares = useMemo(() => {
    const result = [];
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      const rowLabel = y > 0 ? y.toString() : "";
      result.push(<BorderSquare key={`0-${y}`} x={0} y={y} value={rowLabel} />);
      for (let x = 1; x <= BOARD_WIDTH; x++) {
        if (y === 0) {
          result.push(<BorderSquare key={`${x}-${y}`} x={x} y={y} value={COLUMNS[x - 1]} />);
        } else {
          result.push(
            <Square
              key={`${x}-${y}`}
              x={x}
              y={y}
              coordinate={`${COLUMNS[x - 1]}${y}`}
              cell={getSquareCell(x, y)}
              isMyBoard={isMyBoard}
            />
          );
        }
      }
      result.push(<BorderSquare key={`${BOARD_WIDTH + 1}-${y}`} x={0} y={y} value={rowLabel} />);
    }
    return result;
  }, [boards, isMyBoard, getSquareCell]);

  return (
    <div
      className={`board relative 
        flex flex-row flex-wrap 
        w-full md:w-[${BOARD_WIDTH + 2}vw] md:max-w-[${BOARD_WIDTH + 2}vw] md:min-w-[${BOARD_WIDTH + 2}vw]
        md:mr-auto md:ml-auto`}>
      <div className="squares-container w-full h-full flex flex-row flex-wrap">{squares}</div>
      {showYourTurn && <div className="your-turn-signal animate__animated animate__bounceInDown">YOUR TURN!</div>}
    </div>
  );
};
