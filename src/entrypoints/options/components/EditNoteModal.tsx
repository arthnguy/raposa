import { useState, useEffect } from "react";
import Modal from "@/entrypoints/options/components/Modal";
import { Flashcard } from "@/types/deck";

interface EditNoteModalProps {
  card: Flashcard | undefined,
  onClose: () => void,
  onSaveNoteEdit: (cardId: string, note: string) => void,
}

export default function EditNoteModal({
  card,
  onClose,
  onSaveNoteEdit,
}: EditNoteModalProps) {
  const [currNote, setCurrNote] = useState(card?.note);

  const handleClose = () => {
    if (card === undefined || currNote === undefined) {
      return;
    }

    onSaveNoteEdit(card.id, currNote);
    onClose();
  }

  return (
    <Modal onClose={handleClose}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-text-secondary">Edit notes</p>
      </div>
      <textarea placeholder="Add notes here..." className="border border-border w-full mb-4 h-20 p-2 placeholder:text-text-muted" value={currNote} onChange={(e) => setCurrNote(e.target.value)}></textarea>
      <div className="flex justify-end">
        <button
          onClick={handleClose}
          className="text-sm cursor-pointer border border-border rounded-lg px-3 py-2 bg-accent text-background"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
