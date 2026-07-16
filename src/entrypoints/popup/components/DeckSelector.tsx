import { useState, useEffect } from "react";
import { getAllDecks, getActiveDeckId, setActiveDeckId } from "@/lib/storage";
import type { Deck } from "@/types/deck";

export default function DeckSelector() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeDeckId, setActiveDeckIdState] = useState<string>("");

  useEffect(() => {
    const loadFromStorage = async () => {
      const [allDecks, storedActiveId] = await Promise.all([
        getAllDecks(),
        getActiveDeckId(),
      ]);
      setDecks(allDecks);
      setActiveDeckIdState(storedActiveId ?? "");
    };

    loadFromStorage();

    const handleStorageChange = (
      changes: Record<string, { oldValue?: unknown; newValue?: unknown }>,
      areaName: string
    ) => {
      if (areaName === "local" && "decks" in changes) {
        loadFromStorage();
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

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
      <select
        value={activeDeckId}
        onChange={handleChange}
        className="font-sans text-accent"
      >
        <option value="">None</option>
        {decks.map((deck) => (
          <option key={deck.id} value={deck.id}>
            {deck.name}
          </option>
        ))}
      </select>
    </div>
  );
}