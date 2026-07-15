import { useState } from "react";
import { Pencil, Check, Star, Trash2 } from "lucide-react";
import type { Flashcard as FlashcardType } from "@/types/deck";
import NoteTooltip from "@/entrypoints/options/components/NoteTooltip";

interface FlashcardProps {
  card: FlashcardType;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenNote: (id: string) => void;
  onSaveEdit: (id: string, front: string, back: string) => void;
}

export default function Flashcard({
  card,
  onToggleFavorite,
  onDelete,
  onOpenNote,
  onSaveEdit,
}: FlashcardProps) {
  const { front, back, favorite, note } = card;

  const [isEditing, setIsEditing] = useState(false);
  const [draftFront, setDraftFront] = useState(front);
  const [draftBack, setDraftBack] = useState(back);
  const [displayNote, setDisplayNote] = useState(false);

  const handleStartEdit = () => {
    setDraftFront(front);
    setDraftBack(back);
    setIsEditing(true);
  };

  const handleConfirmEdit = () => {
    onSaveEdit(card.id, draftFront.trim(), draftBack.trim());
    setIsEditing(false);
    console.log("confirm")
  };

  // Chrome 123+ only
  const growStyle = { fieldSizing: "content" } as React.CSSProperties;

  return (
    <div style={{ contentVisibility: "auto" }} className="grid grid-cols-[1fr_1fr_96px] gap-4 items-start py-3 border-b border-border">
      {isEditing ? (
        <textarea
          value={draftFront}
          onChange={(e) => setDraftFront(e.target.value)}
          style={growStyle}
          className="resize-none w-full bg-background border border-border rounded-lg px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-accent"
        />
      ) : (
        <span className="text-sm text-text-primary">{front}</span>
      )}

      {isEditing ? (
        <textarea
          value={draftBack}
          onChange={(e) => setDraftBack(e.target.value)}
          style={growStyle}
          className="resize-none w-full bg-background border border-border rounded-lg px-2 py-1 text-sm text-text-secondary focus:outline-none focus:border-accent"
        />
      ) : (
        <span className="text-sm text-text-secondary">{back}</span>
      )}

      <div className="flex flex-col items-end gap-1">
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(card.id)}
            disabled={isEditing}
            aria-label="Delete this card"
            className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mr-3"
          >
            <Trash2 size={16} className="text-danger" />
          </button>

          <button
            onClick={isEditing ? handleConfirmEdit : handleStartEdit}
            aria-label={isEditing ? "Confirm changes" : "Edit this card"}
            className="cursor-pointer"
          >
            {isEditing ? (
              <Check size={16} className="text-success" />
            ) : (
              <Pencil size={16} className="text-text-muted" />
            )}
          </button>

          <button
            onClick={() => onToggleFavorite(card.id)}
            aria-label={favorite ? "Unfavorite this card" : "Favorite this card"}
            className="cursor-pointer"
          >
            <Star
              size={16}
              className={favorite ? "text-accent" : "text-text-muted"}
              fill={favorite ? "currentColor" : "none"}
            />
          </button>
        </div>

        <button
          onClick={() => onOpenNote(card.id)}
          onMouseEnter={() => setDisplayNote(true)}
          onMouseLeave={() => setDisplayNote(false)}
          className="text-xs cursor-pointer text-text-muted underline decoration-dotted hover:text-accent relative"
        >
          Note

          {
            displayNote && <NoteTooltip>{note}</NoteTooltip>
          }
        </button>
      </div>
    </div>
  );
}