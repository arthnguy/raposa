import { useState, useEffect } from "react";
import type { Deck, Flashcard } from "@/types/deck";
import {
  getAllDecks,
  addDeck,
  deleteDeck,
  toggleFlashcardFavorite,
  addFlashcardToDeck,
  deleteFlashcardFromDeck,
  editFlashcard,
  editFlashcardNote,
  addMultipleFlashcardsToDeck,
} from "@/lib/storage";
import { createDeck, createFlashcard } from "@/utils/factories";
import { parseApkgFile } from "@/lib/ankiImport";

export const CREATE_NEW_DECK = "__create__";

export type ActiveModal =
  | { type: "none" }
  | { type: "delete-deck" }
  | { type: "add-card" }
  | { type: "edit-note"; cardId: string };

export function useDeckManagement() {
  const [modal, setModal] = useState<ActiveModal>({ type: "none" });
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentDeckId, setCurrentDeckId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    const loadDecks = async () => {
      const allDecks = await getAllDecks();
      setDecks(allDecks);
      setCurrentDeckId("");
    };
    loadDecks();
  }, []);

  const currentDeck = decks.find((deck) => deck.id === currentDeckId);

  const filteredCards =
    currentDeck?.cards.filter((card) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        card.front.toLowerCase().includes(query) ||
        card.back.toLowerCase().includes(query) ||
        card.note.toLowerCase().includes(query);
      const matchesFavorite = !favoritesOnly || card.favorite;
      return matchesSearch && matchesFavorite;
    }) ?? [];

  // Shared helper
  const updateCardInCurrentDeck = (
    cardId: string,
    updates: Partial<Flashcard>
  ) => {
    setDecks((prev) =>
      prev.map((deck) =>
        deck.id !== currentDeckId
          ? deck
          : {
              ...deck,
              cards: deck.cards.map((card) =>
                card.id === cardId ? { ...card, ...updates } : card
              ),
            }
      )
    );
  };

  const handleToggleFavorite = async (cardId: string) => {
    const card = currentDeck?.cards.find((c) => c.id === cardId);
    if (!card) {
      return;
    }

    updateCardInCurrentDeck(cardId, { favorite: !card.favorite });
    await toggleFlashcardFavorite(currentDeckId, cardId);
  };

  const handleOpenNote = (cardId: string) => {
    setModal({ type: "edit-note", cardId });
  };

  const handleConfirmDelete = async () => {
    const remainingDecks = decks.filter((deck) => deck.id !== currentDeckId);
    setDecks(remainingDecks);
    setCurrentDeckId(remainingDecks[0]?.id ?? "");
    setModal({ type: "none" });

    await deleteDeck(currentDeckId);
  };

  const handleCreateDeck = async (name: string) => {
    const newDeck = createDeck(name);

    setDecks((prev) => [...prev, newDeck]);
    setCurrentDeckId(newDeck.id);
    setIsCreatingDeck(false);

    await addDeck(newDeck);
  };

  const handleDeckSelectChange = (value: string) => {
    if (value === CREATE_NEW_DECK) {
      setIsCreatingDeck(true);
    } else {
      setIsCreatingDeck(false);
      setCurrentDeckId(value);
    }
  };

  const handleFlashcardAdd = async (front: string, back: string) => {
    const flashcard = createFlashcard(front, back);

    setDecks((prev) =>
      prev.map((deck) =>
        deck.id !== currentDeckId
          ? deck
          : { ...deck, cards: [...deck.cards, flashcard] }
      )
    );

    await addFlashcardToDeck(currentDeckId, flashcard);
  };

  const handleFlashcardDelete = async (cardId: string) => {
    setDecks((prev) =>
      prev.map((deck) =>
        deck.id !== currentDeckId
          ? deck
          : { ...deck, cards: deck.cards.filter((card) => card.id !== cardId) }
      )
    );

    await deleteFlashcardFromDeck(currentDeckId, cardId);
  };

  const handleFlashcardEdit = async (cardId: string, front: string, back: string) => {
    updateCardInCurrentDeck(cardId, { front, back });
    await editFlashcard(currentDeckId, cardId, front, back);
  };

  const handleFlashcardNoteEdit = async (cardId: string, note: string) => {
    updateCardInCurrentDeck(cardId, { note });
    await editFlashcardNote(currentDeckId, cardId, note);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // In case importing same file
    
    if (!file) {
      return;
    }
 
    // `accept` is just a hint to the OS picker — it doesn't stop someone
    // from switching to "All files" and picking anything, so validate here too.
    if (!file.name.toLowerCase().endsWith(".apkg")) {
      setImportError("Please select a valid Anki .apkg file.");
      return;
    }
 
    setImportError(null);
 
    try {
      const buffer = await file.arrayBuffer();
      const parsedCards = await parseApkgFile(buffer);
 
      if (parsedCards.length === 0) {
        setImportError("No cards were found in that file.");
        return;
      }
 
      const importedCards = parsedCards.map((card) => createFlashcard(card.front, card.back));
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id !== currentDeckId
            ? deck
            : { ...deck, cards: [...deck.cards, ...importedCards] }
        )
      );
      await addMultipleFlashcardsToDeck(currentDeckId, importedCards);

      if (currentDeck) {
        currentDeck.cards = [...currentDeck.cards, ...importedCards]
      }
    } catch (err) {
      console.error("Failed to import Anki deck:", err);
      setImportError(
        err instanceof Error ? err.message : "Something went wrong importing that file."
      );
    }
  };

  const editingCard =
    modal.type === "edit-note"
      ? currentDeck?.cards.find((card) => card.id === modal.cardId)
      : undefined;

  return {
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
  };
}