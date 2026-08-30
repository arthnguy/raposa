import { useState } from "react";

export default function DeckCreation({ onDeckCreated }: { onDeckCreated: (name: string) => void }) {
    const [name, setName] = useState("");
    const MAX_LENGTH = 30;

    return (
        <div>
            <label className="block text-xs text-text-muted mb-1.5">Deck name</label>
            <div className="relative">
                <input
                    value={name}
                    maxLength={MAX_LENGTH}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Genki chapter 4"
                    autoFocus
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent mb-4"
                    />
                <span className="pointer-events-none absolute bottom-4 right-2 text-[10px] text-text-muted">
                    {name.length}/{MAX_LENGTH}
                </span>
            </div>
            <div className="flex gap-2 justify-end">
                <button
                    onClick={() => onDeckCreated(name.trim())}
                    disabled={!name.trim()}
                    className="cursor-pointer text-sm font-medium text-background bg-accent rounded-lg px-3 py-2 disabled:opacity-40 disabled:cursor-default"
                >
                    Create deck
                </button>
            </div>
        </div>
    );
}