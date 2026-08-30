import type { Deck } from "@/types/deck"
import { Trash2 } from "lucide-react"

function DeckSelection({
    decks,
    currDeckId,
    isCreatingDeck,
    setCurrDeck,
    setIsCreatingDeck,
} : { 
    decks: Deck[],
    currDeckId: string,
    isCreatingDeck: boolean,
    setCurrDeck: (value: Deck) => void,
    setIsCreatingDeck: (value: boolean) => void,
}) {
    const CREATE_NEW_DECK = "deck_new";

    const handleChange = (deckId: string): void => {
        if (deckId === CREATE_NEW_DECK) {
            setIsCreatingDeck(true);
            return;
        }

        setIsCreatingDeck(false);
        const result = decks.find(deck => deck.id === deckId);
        if (result) {
            setCurrDeck(result);
        }
    };

    return (
        <select
            value={isCreatingDeck ? CREATE_NEW_DECK : currDeckId}
            onChange={(e) => handleChange(e.target.value)}
            className="flex-1 min-w-0 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent truncate"
        >
            <option value="" disabled>
                Select a deck
            </option>
            {
                decks &&
                decks.map((deck) => (
                    <option key={deck.id} value={deck.id}>
                        {deck.name}
                    </option>
                ))
            }
            <option value={CREATE_NEW_DECK}>+ Create new deck</option>
        </select>
    );
}

function DeckDeletion({
    isCreatingDeck,
    canDelete,
    handleDeleteDeck,
}: {
    isCreatingDeck: boolean,
    canDelete: boolean,
    handleDeleteDeck: () => void,
}) {
    return (
        <button
            onClick={handleDeleteDeck}
            disabled={isCreatingDeck || !canDelete}
            aria-label="Delete this deck"
            title="Delete this deck"
            className="cursor-pointer border border-border rounded-lg px-2.5 text-text-muted hover:text-danger disabled:opacity-40 disabled:cursor-default disabled:hover:text-text-muted"
        >
            <Trash2 size={16} />
        </button>
    )
}

export default function DeckManager({
    decks,
    currDeck,
    setCurrDeck,
    isCreatingDeck,
    setIsCreatingDeck,
    onDeckDeleted,
}: {
    decks: Deck[],
    currDeck: Deck | null,
    setCurrDeck: (value: Deck | null) => void,
    isCreatingDeck: boolean,
    setIsCreatingDeck: (value: boolean) => void,
    onDeckDeleted: (deckId: string) => Promise<void>,
}) {
    const handleDeleteDeck = async (): Promise<void> => {
        if (!currDeck) {
            return;
        }
        if (!confirm(`Delete "${currDeck.name}" and all its cards? This can't be undone.`)) {
            return;
        }

        await onDeckDeleted(currDeck.id);
    };

    return (
        <div className="flex gap-4 mb-4">
            <div className="flex-1 min-w-0">
                <label className="block text-xs text-text-muted mb-1.5">
                    Current deck
                </label>

                <div className="flex gap-2 min-w-0">
                    <DeckSelection
                        decks={decks}
                        currDeckId={currDeck?.id ?? ""}
                        isCreatingDeck={isCreatingDeck}
                        setCurrDeck={setCurrDeck}
                        setIsCreatingDeck={setIsCreatingDeck}
                    />
                    <DeckDeletion
                        isCreatingDeck={isCreatingDeck}
                        canDelete={currDeck !== null}
                        handleDeleteDeck={handleDeleteDeck}
                    />
                </div>
            </div>
        </div>
    )
}