import { Star } from "lucide-react";

function Favorite({ isFavoritesOnly, setIsFavoritesOnly }: { isFavoritesOnly: boolean, setIsFavoritesOnly: (value: boolean) => void }) {
    return (
        <button
            onClick={() => setIsFavoritesOnly(!isFavoritesOnly)}
            aria-label="Show favorites only"
            title="Show favorites only"
            className={`cursor-pointer border rounded-lg px-2.5 hover:text-accent ${
                isFavoritesOnly
                    ? "border-accent text-accent"
                    : "border-border text-text-muted"
            }`}
        >
            <Star
                size={16}
                fill={isFavoritesOnly ? "currentColor" : "none"}
            />
        </button>
    )
}

export default function DeckSearch({
    searchQuery,
    setSearchQuery,
    isFavoritesOnly,
    setIsFavoritesOnly,
}: {
    searchQuery: string,
    setSearchQuery: (value: string) => void,
    isFavoritesOnly: boolean,
    setIsFavoritesOnly: (value: boolean) => void,
}) {
    return (
        <div className="flex-1">
            <label className="block text-xs text-text-muted mb-1.5">
                Search this deck
            </label>

            <div className="flex gap-2">
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search front or back"
                    className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                />
                <Favorite isFavoritesOnly={isFavoritesOnly} setIsFavoritesOnly={setIsFavoritesOnly} />
            </div>
        </div>
    );
}