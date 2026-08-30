import type { Card, Deck } from "@/types/deck";
import type { System } from "@/types/system";

export function createCard(deckId: string, front: string, back: string): Card {
  const card: Card = {
    id: "card_" + crypto.randomUUID(),
    front: front,
    back: back,
    favorite: false,
    parentDeckId: deckId,
  };

  return card;
}

export function createDeck(name: string): Deck {
  const deck: Deck = {
    id: "deck_" + crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    cardCount: 0,
  };

  return deck;
}

export function createDefaultSystem(): System {
  return {
    challengeDuration: 60,
    timeBetweenChallenges: 30,
    activeDeckId: "",
    isCurrentlyTranslating: false,
    isEnabled: true,
    pausedRemainingMs: null,
  };
}