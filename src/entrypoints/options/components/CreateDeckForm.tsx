import { useState } from "react";

interface CreateDeckFormProps {
  onCreate: (name: string) => void;
  onCancel: () => void;
}

export default function CreateDeckForm({
  onCreate,
  onCancel,
}: CreateDeckFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate(name.trim());
  };

  return (
    <div>
      <label className="block text-xs text-text-muted mb-1.5">Deck name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Genki chapter 4"
        autoFocus
        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent mb-4"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="text-sm text-text-secondary border border-border rounded-lg px-3 py-2 hover:text-text-primary"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="text-sm font-medium text-background bg-accent rounded-lg px-3 py-2 disabled:opacity-40"
        >
          Create deck
        </button>
      </div>
    </div>
  );
}
