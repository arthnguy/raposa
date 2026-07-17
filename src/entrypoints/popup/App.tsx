import { getAllDecks } from "@/lib/storage";
import { useState, useEffect } from "react";
import Timer from "./components/Timer";
import DeckSelector from "./components/DeckSelector";
import { Settings } from "lucide-react";
import { Deck } from "@/types/deck";

function App() {
  const [availableDecks, setAvailableDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const updateDisabled = async () => {
      const decks = await getAllDecks();
      setAvailableDecks(decks);
    }

    updateDisabled();
    browser.storage.onChanged.addListener(updateDisabled);
    return () => browser.storage.onChanged.removeListener(updateDisabled);
  }, []);

  return (
    <div className="w-60 p-2 bg-background text-text-primary">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-surface rounded-lg px-4 py-3">
          <Timer disabled={availableDecks.length === 0} />
        </div>
        <DeckSelector decks={availableDecks} />
      </div>
      <hr className="border-t border-border my-3" />
      <div className="flex justify-between items-center">
        <span className="font-sans text-text-secondary text-sm">ON / OFF</span>
        <Settings
          size={20}
          className="text-text-secondary hover:text-accent cursor-pointer transition-colors"
          onClick={() => browser.runtime.openOptionsPage()}
        />
      </div>
    </div>
  );
}

export default App;
