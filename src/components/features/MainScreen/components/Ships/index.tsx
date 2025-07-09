"use client";
import { Player, Ship as ShipType, ShipStatus } from "@/types/game";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Ship } from "lucide-react";

interface ShipsProps {
  isMyBoard: boolean;
}

export const Ships = ({ isMyBoard }: ShipsProps) => {
  const { boards } = useGameLogic();

  //--------------------------------------------------------
  const getShipColourFromStatus = (ship: ShipType) => {
    if (ship.status === ShipStatus.UNTOUCHED) return "#999";
    else if (ship.status === ShipStatus.HIT) return "#ffa200";
    else if (ship.status === ShipStatus.SUNK) return "#f00";
  };

  //--------------------------------------------------------
  const renderShips = () => {
    const myBoard = boards[isMyBoard ? Player.USER : Player.CPU];
    const ships = myBoard.ships.map((ship, idx) => (
      <div className="ship flex flex-row" key={`ship_${idx}`}>
        <Ship color={getShipColourFromStatus(ship)} />
        <span className="ml-1">
          {ship.hits}/{ship.length}
        </span>
      </div>
    ));
    return ships;
  };

  //--------------------------------------------------------
  return (
    <div
      className="ships flex flex-row gap-3 flex-wrap w-full  
	  	text-base
		border border-gray-700 mt-5 rounded-md p-2 justify-center items-center">
      {renderShips()}
    </div>
  );
};
