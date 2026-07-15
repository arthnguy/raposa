import Modal from "@/entrypoints/options/components/Modal";

interface DeleteDeckModalProps {
  deckName: string;
  cardCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteDeckModal({
  deckName,
  cardCount,
  onConfirm,
  onCancel,
}: DeleteDeckModalProps) {
  return (
    <Modal onClose={onCancel}>
      <p className="text-sm font-medium text-text-primary mb-2">
        Delete "{deckName}"?
      </p>
      <p className="text-sm text-text-secondary mb-5 leading-relaxed">
        This removes {cardCount} cards permanently. This can't be undone.
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="cursor-pointer text-sm text-text-secondary border border-border rounded-lg px-3 py-2 hover:text-text-primary"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="cursor-pointer text-sm font-medium text-white bg-danger rounded-lg px-3 py-2"
        >
          Delete deck
        </button>
      </div>
    </Modal>
  );
}
