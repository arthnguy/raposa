import { useState, useEffect } from "react"
import type { Deck } from "@/types/deck"
import { addDeck, deleteDeck, getAllDecks } from "@/lib/storage"
import { createDeck } from "@/utils/factories"
import DeckManager from "@/entrypoints/options/components/DeckManager"
import DeckSearch from "@/entrypoints/options/components/DeckSearch"
import DeckCreation from "@/entrypoints/options/components/DeckCreation"
import CardList from "@/entrypoints/options/components/CardList"

export default function DeckSettings() {
    const [decks, setDecks] = useState<Deck[]>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [isFavoritesOnly, setIsFavoritesOnly] = useState(false);
    const [currDeck, setCurrDeck] = useState<Deck | null>(null);

    const [isCreatingDeck, setIsCreatingDeck] = useState(false);

    useEffect(() => {
        (async () => {
            setDecks(await getAllDecks());
        })();
    }, []);

    const handleDeckDeleted = async (deckId: string): Promise<void> => {
        if (decks.length === 0) {
            return;
        }

        const prevCurrDeck = currDeck;

        setCurrDeck(null);
        const newDecks = decks?.filter(item => item.id !== deckId);
        setDecks(newDecks);
    
        try {
            await deleteDeck(deckId);
        } catch (err) { // Rollback
            setCurrDeck(prevCurrDeck);
        }
    };

    const handleDeckCreated = async (name: string): Promise<void> => {
        const prevDecks = decks;
        const deck: Deck = createDeck(name);

        setDecks([...decks, deck]);

        try {
            await addDeck(deck);
            setCurrDeck(deck);
            setIsCreatingDeck(false);
        } catch (err) { // Rollback
            setDecks(prevDecks);
        }
    }

    if (decks === null) {
        return <section>Loading...</section>;
    }

    return (
        <section>
            <h2 className="text-sm font-medium text-text-secondary mb-4">
                Deck settings
            </h2>

            <div className="flex gap-4 mb-4">
                <div className="w-1/3 min-w-0">
                    <DeckManager 
                        decks={decks}
                        currDeck={currDeck}
                        setCurrDeck={setCurrDeck} 
                        isCreatingDeck={isCreatingDeck} 
                        setIsCreatingDeck={setIsCreatingDeck}
                        onDeckDeleted={handleDeckDeleted}
                    />
                </div>
                {!isCreatingDeck && (
                    <div className="w-2/3 min-w-0">
                        <DeckSearch 
                            searchQuery={searchQuery} 
                            setSearchQuery={setSearchQuery} 
                            isFavoritesOnly={isFavoritesOnly} 
                            setIsFavoritesOnly={setIsFavoritesOnly} 
                        />
                    </div>
                )}
            </div>

            {
                !isCreatingDeck ? currDeck && (
                    <CardList 
                        deckId={currDeck.id}
                        searchQuery={searchQuery}
                        isFavoritesOnly={isFavoritesOnly}
                    />
                ) : 
                <DeckCreation onDeckCreated={handleDeckCreated} />
            }
        </section>
    )
}