import Card from "@/entrypoints/options/components/Card";
import CardCreation from "@/entrypoints/options/components/CardCreation";
import type { Card as CardType } from "@/types/deck";
import { useEffect, useState } from "react";
import { addCard, deleteCard, getCardsInDeck, updateCard } from "@/lib/storage";
import { createCard } from "@/utils/factories";
import { Plus } from "lucide-react";

export default function CardList({ deckId, searchQuery, isFavoritesOnly }: {
    deckId: string,
    searchQuery: string,
    isFavoritesOnly: boolean,
}) {
    const [cards, setCards] = useState<CardType[]>([]);
    const [isCreatingCard, setIsCreatingCard] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const newCards = await getCardsInDeck(deckId);
            
            if (!cancelled) {
                setCards(newCards);
            }
        })();

        return () => { cancelled = true; };
    }, [deckId]);

    const handleDeleteCard = async (card: CardType): Promise<void> => {
        const prev = cards;
        setCards(cards.filter(item => item.id !== card.id));

        try {
            await deleteCard(card.id);
        } catch (err) {
            setCards(prev); // Rollback
        }
    }

    const handleUpdateCard = async (updated: CardType): Promise<void> => {
        const prev = cards;
        setCards(cards.map(item => item.id === updated.id ? updated : item));

        try {
            await updateCard(updated.id, updated);
        } catch (err) {
            setCards(prev); // Rollback
        }
    }

    const filteredCards = cards.filter(card =>
        (isFavoritesOnly ? card.favorite : true) &&
        (card.front.includes(searchQuery) || card.back.includes(searchQuery))
    );


    const handleCreateCard = async (front: string, back: string): Promise<void> => {
        const card = createCard(deckId, front, back);
        const prev = cards;

        setCards([...cards, card]);

        try {
            await addCard(card);
        } catch (err) {
            setCards(prev); // Rollback
        }
    };

    return (
        <>
            <div className="text-xs grid grid-cols-[1fr_1fr_96px] gap-4 items-center py-3 border-b text-text-muted border-border">
                <p>Front</p>
                <p>Back</p>

                <div className="relative justify-self-end">
                    <button
                        onClick={() => setIsCreatingCard(!isCreatingCard)}
                        aria-label="Add a new card"
                        className="cursor-pointer flex items-center gap-1 text-accent hover:opacity-80"
                    >
                        <Plus size={14} />
                        <span>Add</span>
                    </button>

                    {isCreatingCard && (
                        <CardCreation
                            onConfirm={handleCreateCard}
                            onCancel={() => setIsCreatingCard(false)}
                        />
                    )}
                </div>
            </div>

            <div>
                {filteredCards.map((card) => 
                    <Card key={card.id} card={card} handleDeleteCard={handleDeleteCard} handleUpdateCard={handleUpdateCard} />
                )}
            </div>
        </>
    );
}