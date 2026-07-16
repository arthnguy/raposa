import { Flashcard, Deck } from "@/types/deck";

export async function setTimeBetweenChallenges(time: number): Promise<void> {
  await browser.storage.local.set({cooldown: { timeBetweenChallenges: time }});
}

export async function setChallengeDuration(duration: number): Promise<void> {
  await browser.storage.local.set({ duration: duration });
}

export async function getActiveDeckId(): Promise<string | null> {
  const result = await browser.storage.local.get("activeDeckId");
  return (result.activeDeckId as string | undefined) ?? null;
}

export async function getActiveDeck(): Promise<Deck | null> {
  const activeId: string = await browser.storage.local.get("activeDeckId");
  const decks = await getAllDecks();

  if (!activeId || !decks) {
    return null;
  }

  const result = decks.find((deck) => deck.id === activeId);

  if (result !== undefined) {
    return result;
  } else {
    return null;
  }
}
 
export async function setActiveDeckId(deckId: string): Promise<void> {
  await browser.storage.local.set({ activeDeckId: deckId });
}

export async function getAllDecks(): Promise<Deck[]> {
  const result = await browser.storage.local.get("decks");
  return (result.decks as Deck[] | undefined) ?? [];
}

export async function addDeck(deck: Deck): Promise<void> {
  const result = await browser.storage.local.get("decks");
  const decks = (result.decks as Deck[] | undefined) ?? [];

  await browser.storage.local.set({ decks: [...decks, deck] });
}

export async function deleteDeck(deckId: string) {
  const result = await browser.storage.local.get("decks");
  const decks = (result.decks as Deck[] | undefined) ?? [];

  const updatedDecks = decks.filter((deck) => deck.id !== deckId);

  await browser.storage.local.set({ decks: updatedDecks });
}

export async function addFlashcardToDeck(
  deckId: string,
  card: Flashcard,
): Promise<void> {
  const result = await browser.storage.local.get("decks");
  const decks = (result.decks as Deck[] | undefined) ?? [];

  const updatedDecks = decks.map((deck) =>
    deck.id === deckId ? { ...deck, cards: [...deck.cards, card] } : deck,
  );

  await browser.storage.local.set({ decks: updatedDecks });
}

export async function addMultipleFlashcardsToDeck(
  deckId: string,
  cards: Flashcard[],
): Promise<void> {
  for (const card of cards) {
    await addFlashcardToDeck(deckId, card);
  }
}

export async function deleteFlashcardFromDeck(
  deckId: string,
  cardId: string,
): Promise<void> {
  const result = await browser.storage.local.get("decks");
  const decks = (result.decks as Deck[] | undefined) ?? [];

  const updatedDecks = decks.map((deck) =>
    deck.id === deckId
      ? { ...deck, cards: deck.cards.filter((card) => card.id !== cardId) }
      : deck,
  );

  await browser.storage.local.set({ decks: updatedDecks });
}

// Private, not exported
async function updateCardInDeck(
  deckId: string,
  cardId: string,
  updates: Partial<Flashcard>
): Promise<void> {
  const result = await browser.storage.local.get("decks");
  const decks = (result.decks as Deck[] | undefined) ?? [];

  const updatedDecks = decks.map((deck) =>
    deck.id !== deckId
      ? deck
      : {
          ...deck,
          cards: deck.cards.map((card) =>
            card.id === cardId ? { ...card, ...updates } : card
          ),
        }
  );

  await browser.storage.local.set({ decks: updatedDecks });
}

export async function editFlashcard(deckId: string, cardId: string, front: string, back: string) {
  await updateCardInDeck(deckId, cardId, { front, back });
}

export async function editFlashcardNote(deckId: string, cardId: string, note: string) {
  await updateCardInDeck(deckId, cardId, { note });
}

export async function toggleFlashcardFavorite(deckId: string, cardId: string) {
  const result = await browser.storage.local.get("decks");
  const decks = (result.decks as Deck[] | undefined) ?? [];

  const updatedDecks = decks.map((deck) =>
    deck.id === deckId
      ? { ...deck, cards: deck.cards.filter((card) => card.id !== cardId) }
      : deck,
  );

  await browser.storage.local.set({ decks: updatedDecks });
}

export async function fetchRandomFlashcard(
  deckId: string,
): Promise<Flashcard | null> {
  const result = await browser.storage.local.get("decks");
  const decks = (result.decks as Deck[] | undefined) ?? [];

  const deck = decks.find((d) => d.id === deckId);
  if (!deck || deck.cards.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * deck.cards.length);
  return deck.cards[randomIndex];
}

export async function clearData(): Promise<void> {
  await browser.storage.local.clear();
}
