import Flashcard from "./Flashcard";
import type { Flashcard as FlashcardType } from "@/types/deck";

interface FlashcardListProps {
  cards: FlashcardType[];
  onToggleFavorite: (cardId: string) => void;
  onDelete: (cardId: string) => void;
  onOpenNote: (cardId: string) => void;
  onSaveEdit: (cardId: string, front: string, back: string) => void;
}

export default function FlashcardList({
  cards,
  onToggleFavorite,
  onDelete,
  onOpenNote,
  onSaveEdit,
}: FlashcardListProps) {
  if (cards.length === 0) {
    return (
      <p className="text-sm text-text-muted py-8 text-center">
        No cards match your search.
      </p>
    );
  }

  return (
    <>
      <div className="text-xs grid grid-cols-[1fr_1fr_96px] gap-4 items-start py-3 border-b text-text-muted border-border">
        <p>Front</p>
        <p>Back</p>
      </div>
      <div>
        {cards.map((card) => (
          <Flashcard
          key={card.id}
          card={card}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
            onOpenNote={onOpenNote}
            onSaveEdit={onSaveEdit}
            />
          ))}
      </div>
    </>
  );
}
