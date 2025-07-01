import { BattleShipGame } from "@/components/features/BattleShipGame";
import { GameLogicProvider } from "@/context/GameLogicContext";
import { GameLoopProvider } from "@/context/GameLoopContext";
import { PubSubProvider } from "@/context/PubSubContext";

export default function Home() {
  return (
    <PubSubProvider>
      <GameLoopProvider>
        <GameLogicProvider>
          <BattleShipGame />
        </GameLogicProvider>
      </GameLoopProvider>
    </PubSubProvider>
  );
}
