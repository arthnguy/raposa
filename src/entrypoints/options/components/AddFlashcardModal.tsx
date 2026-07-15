import { useState, useRef } from "react";
import Modal from "./Modal";

interface AddFlashcardModalProps {
  onAddCard: (front: string, back: string) => void;
  onClose: () => void;
}

export default function AddFlashcardModal({
  onAddCard,
  onClose,
}: AddFlashcardModalProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [addedCount, setAddedCount] = useState(0);
  const frontInputRef = useRef<HTMLInputElement>(null);

  const isValid = front.trim().length > 0 && back.trim().length > 0;

  const commitCard = async () => {
    onAddCard(front.trim(), back.trim());
    setAddedCount((prev) => prev + 1);
    setFront("");
    setBack("");
  };

  const handleAddAnother = () => {
    if (!isValid) {
      return;
    }

    commitCard();
    frontInputRef.current?.focus();
  };

  const handleDone = () => {
    if (isValid) {
      commitCard();
    }

    onClose();
  };

  return (
    <Modal onClose={handleDone}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-text-primary">Add card</p>
        {addedCount > 0 && (
          <span className="text-xs text-text-muted">{addedCount} added</span>
        )}
      </div>

      <label className="block text-xs text-text-muted mb-1.5">Front</label>
      <input
        ref={frontInputRef}
        value={front}
        onChange={(e) => setFront(e.target.value)}
        placeholder="e.g. Quiero un café, por favor."
        autoFocus
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent mb-3"
      />

      <label className="block text-xs text-text-muted mb-1.5">Back</label>
      <input
        value={back}
        onChange={(e) => setBack(e.target.value)}
        placeholder="e.g. I would like a coffee, please."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddAnother();
          }
        }}
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent mb-5"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={handleDone}
          className="text-sm cursor-pointer text-text-secondary border border-border rounded-lg px-3 py-2 hover:text-text-primary"
        >
          Done
        </button>
        <button
          onClick={handleAddAnother}
          disabled={!isValid}
          className="text-sm cursor-pointer font-medium text-background bg-accent rounded-lg px-3 py-2 disabled:opacity-40 disabled:cursor-default"
        >
          Add another
        </button>
      </div>
    </Modal>
  );
}
