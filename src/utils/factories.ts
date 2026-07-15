import type { Flashcard, Deck } from "@/types/deck";

export function createFlashcard(front: string, back: string): Flashcard {
  return {
    id: crypto.randomUUID(),
    front,
    back,
    favorite: false,
    note: "",
    stats: {
      timesSeen: 0,
      timesCorrect: 0,
      timesIncorrect: 0,
      lastReviewed: null,
    },
  };
}

export function createDeck(name: string): Deck {
  return {
    id: crypto.randomUUID(),
    name,
    cards: [],
    createdAt: Date.now(),
  };
}
