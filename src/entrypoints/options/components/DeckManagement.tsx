import { Trash2, Star, Upload, Plus } from "lucide-react";
import FlashcardList from "@/entrypoints/options/components/FlashcardList";
import DeleteDeckModal from "@/entrypoints/options/components/DeleteDeckModal";
import AddFlashcardModal from "@/entrypoints/options/components/AddFlashcardModal";
import EditNoteModal from "@/entrypoints/options/components/EditNoteModal";
import CreateDeckForm from "@/entrypoints/options/components/CreateDeckForm";
import { useDeckManagement, CREATE_NEW_DECK } from "@/hooks/useDeckManagement";

export default function DeckManagement() {
  const {
    decks,
    currentDeck,
    currentDeckId,
    editingCard,
    searchQuery,
    setSearchQuery,
    favoritesOnly,
    setFavoritesOnly,
    isCreatingDeck,
    setIsCreatingDeck,
    modal,
    setModal,
    filteredCards,
    handleToggleFavorite,
    handleOpenNote,
    handleConfirmDelete,
    handleCreateDeck,
    handleDeckSelectChange,
    handleFlashcardAdd,
    handleFlashcardDelete,
    handleFlashcardEdit,
    handleFlashcardNoteEdit,
    fileInputRef,
    handleImportClick,
    handleFileChange,
    importError,
  } = useDeckManagement();

  return (
    <section>
      <h2 className="text-sm font-medium text-text-secondary mb-4">
        Deck management
      </h2>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-xs text-text-muted mb-1.5">
            Current deck
          </label>
          <div className="flex gap-2">
            <select
              value={isCreatingDeck ? CREATE_NEW_DECK : currentDeckId}
              onChange={(e) => handleDeckSelectChange(e.target.value)}
              className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="" disabled>
                Select a deck
              </option>
              {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.name}
                </option>
              ))}
              <option value={CREATE_NEW_DECK}>+ Create new deck</option>
            </select>
            <button
              onClick={() => setModal({ type: "delete-deck" })}
              disabled={!currentDeck || isCreatingDeck}
              aria-label="Delete this deck"
              title="Delete this deck"
              className="cursor-pointer border border-border rounded-lg px-2.5 text-text-muted hover:text-danger disabled:opacity-40"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {!isCreatingDeck && currentDeck && (
          <div className="flex-1">
            <label className="block text-xs text-text-muted mb-1.5">
              Search this deck
            </label>
            <div className="flex gap-2">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search front, back, or notes"
                className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
              <button
                onClick={() => setFavoritesOnly((prev) => !prev)}
                aria-label="Show favorites only"
                title="Show favorites only"
                className={`cursor-pointer border rounded-lg px-2.5 hover:text-accent ${
                  favoritesOnly
                    ? "border-accent text-accent"
                    : "border-border text-text-muted"
                }`}
              >
                <Star
                  size={16}
                  fill={favoritesOnly ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {isCreatingDeck ? (
        <CreateDeckForm
          onCreate={handleCreateDeck}
          onCancel={() => setIsCreatingDeck(false)}
        />
      ) : currentDeck ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">
              {filteredCards.length}{" "}
              {filteredCards.length === 1 ? "card" : "cards"}
            </span>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".apkg"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="relative">
                <button
                  onClick={handleImportClick}
                  className="flex cursor-pointer items-center gap-1.5 text-sm text-text-secondary border border-border rounded-lg px-3 py-2 hover:border-text-muted hover:text-text-primary transition-colors"
                >
                  <Upload size={14} />
                  Import deck
                </button>
                {importError && (
                  <p className="absolute top-full right-0 mt-1 text-xs text-danger whitespace-nowrap bg-background px-1">
                    {importError}
                  </p>
                )}
              </div>
              <button
                className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-background bg-accent rounded-lg px-3 py-2"
                onClick={() => setModal({ type: "add-card" })}
              >
                <Plus size={14} />
                Add card
              </button>
            </div>
          </div>

          <FlashcardList
            cards={filteredCards}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleFlashcardDelete}
            onOpenNote={handleOpenNote}
            onSaveEdit={handleFlashcardEdit}
          />
        </>
      ) : (
        <p className="text-sm text-text-muted text-center py-10">
          Select a deck above to view its cards.
        </p>
      )}

      {modal.type === "delete-deck" && currentDeck && (
        <DeleteDeckModal
          deckName={currentDeck.name}
          cardCount={currentDeck.cards.length}
          onConfirm={handleConfirmDelete}
          onCancel={() => setModal({ type: "none" })}
        />
      )}
      {modal.type === "add-card" && (
        <AddFlashcardModal
          onAddCard={handleFlashcardAdd}
          onClose={() => setModal({ type: "none" })}
        />
      )}
      {modal.type === "edit-note" && editingCard && (
        <EditNoteModal
          card={editingCard}
          onSaveNoteEdit={handleFlashcardNoteEdit}
          onClose={() => setModal({ type: "none" })}
        />
      )}
    </section>
  );
}