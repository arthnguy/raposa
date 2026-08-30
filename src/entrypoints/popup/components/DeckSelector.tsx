import { useEffect, type ChangeEvent } from "react";
import { updateSystem } from "@/lib/storage";
import type { Deck } from "@/types/deck";

export default function DeckSelector({
	decks,
	activeDeckId,
	onActiveDeckChange,
}: {
	decks: Deck[];
	activeDeckId: string;
	onActiveDeckChange: (id: string) => void;
}) {
	const [containsValidDecks, setContainsValiDecks] = useState(false);

	useEffect(() => {
		if (decks.length === 0) {
			return;
		}

		const stillValid = decks.some((deck) => deck.id === activeDeckId);
		if (!stillValid) {
			const fallbackId = decks[0]?.id;

			onActiveDeckChange(fallbackId ? fallbackId : "");
			updateSystem({ activeDeckId: fallbackId });
		}

		setContainsValiDecks(decks.some(item => item.cardCount !== 0));
	}, [decks, activeDeckId]);

	const handleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
		const id = e.target.value;
		onActiveDeckChange(id);
		await updateSystem({ activeDeckId: id });
	};

	return (
		<div className="flex flex-col items-center gap-0.5">
			<span className="text-sm font-sans text-text-secondary">
				Current deck:
			</span>
			{decks.length !== 0 && containsValidDecks ? (
				<select
					value={activeDeckId}
					onChange={handleChange}
					className="font-sans text-accent w-30 truncate"
				>
				{decks.map((deck) => (
					deck.cardCount != 0 &&
					<option key={deck.id} value={deck.id}>
						{deck.name}
					</option>
				))}
				</select>
			) : (
				<p className="font-sans text-accent">None</p>
			)}
		</div>
	);
}