import { getAllDecks, getSystem, updateSystem } from "@/lib/storage";
import { useState, useEffect } from "react";
import Timer from "@/entrypoints/popup/components/Timer";
import DeckSelector from "@/entrypoints/popup/components/DeckSelector";
import Toggle from "@/entrypoints/popup/components/Toggle";
import { Settings } from "lucide-react";
import type { Deck } from "@/types/deck";

function App() {
	const [availableDecks, setAvailableDecks] = useState<Deck[]>([]);
	const [activeDeckId, setActiveDeckId] = useState<string>("");
	const [isEnabled, setIsEnabled] = useState(true);

	useEffect(() => {
		(async () => {
			const [decks, system] = await Promise.all([getAllDecks(), getSystem()]);
			setAvailableDecks(decks);
			setActiveDeckId(system.activeDeckId);
			setIsEnabled(system.isEnabled);
		})();
	}, []);

	const activeDeck = availableDecks.find((deck) => deck.id === activeDeckId);
	const canChallenge = !!activeDeck && activeDeck.cardCount > 0;

	const handleToggle = async () => {
		const next = !isEnabled;
		setIsEnabled(next);
		await updateSystem({ isEnabled: next });
	};

	return (
		<div className="w-60 p-2 bg-background text-text-primary">
			<div className="flex flex-col items-center gap-2">
				<div className="bg-surface rounded-lg px-4 py-3">
					<Timer canChallenge={canChallenge} isEnabled={isEnabled} />
				</div>
				<DeckSelector
					decks={availableDecks}
					activeDeckId={activeDeckId}
					onActiveDeckChange={setActiveDeckId}
				/>
			</div>

			<hr className="border-t border-border my-3" />

			<div className="flex justify-between items-center">
				<Toggle
					isOn={isEnabled}
					onToggle={handleToggle}
					label="Toggle timer"
				/>
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