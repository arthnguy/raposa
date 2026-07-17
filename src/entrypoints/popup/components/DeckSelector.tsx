import { useState } from "react";
import { setActiveDeckId } from "@/lib/storage";
import type { Deck } from "@/types/deck";

interface DeckSelectorProps {
  decks: Deck[],
}

export default function DeckSelector({ decks }: DeckSelectorProps) {
  const [activeDeckId, setActiveDeckIdState] = useState<string>("");

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setActiveDeckIdState(id);
    await setActiveDeckId(id);
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-sm font-sans text-text-secondary">
        Current deck:
      </span>
      {
        decks.length !== 0 ?
        <select
          value={activeDeckId}
          onChange={handleChange}
          className="font-sans text-accent"
        >
          {decks.map((deck) => (
            <option key={deck.id} value={deck.id}>
              {deck.name}
            </option>
          ))}
        </select>
        :
        <p className="font-sans text-accent">None</p>
      }
    </div>
  );
}