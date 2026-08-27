import type { Card, Deck } from "@/types/deck";
import type { System } from "@/types/system";

let cardsCache: Card[] | null = null;
let decksCache: Deck[] | null = null;

export async function getAllCards(): Promise<Card[]> {
	if (cardsCache === null) {
		const all = await browser.storage.local.get(null);
		cardsCache = Object.entries(all)
			.filter(([key]) => key.startsWith("card_"))
			.map(([, value]) => value as Card);
	}

  	return cardsCache;
}

export async function getAllDecks(): Promise<Deck[]> {
	if (decksCache === null) {
		const all = await browser.storage.local.get(null);
		decksCache = Object.entries(all)
			.filter(([key]) => key.startsWith("deck_"))
			.map(([, value]) => value as Deck)
			.sort((a, b) => a.createdAt - b.createdAt);
	}

	return decksCache;
}

export async function getSystem(): Promise<System> {
    return await browser.storage.local.get<System>(["challengeDuration", "timeBetweenChallenges", "activeDeckId", "isCurrentlyTranslating"]);
}

export async function getDeck(deckId: string): Promise<Deck> {
	const result = await browser.storage.local.get(deckId);
  	return result[deckId] as Deck;
}

export async function getCard(cardId: string): Promise<Card> {
	const result = await browser.storage.local.get(cardId);
  	return result[cardId] as Card;
}

export async function getCardsInDeck(deckId: string): Promise<Card[]> {
  const allCards = await getAllCards();
  return allCards.filter(card => card.parentDeckId === deckId);
}

export async function setSystem(system: System): Promise<void> {
	await browser.storage.local.set({
		challengeDuration: system.challengeDuration,
		timeBetweenChallenges: system.timeBetweenChallenges,
		activeDeckId: system.activeDeckId,
		isCurrentlyChallenging: system.isCurrentlyTranslating,
	});
}

export async function setDeck(deckId: string, deck: Deck): Promise<void> {
	await browser.storage.local.set({ [deckId]: deck });
}

export async function setCard(cardId: string, card: Card): Promise<void> {
	await browser.storage.local.set({ [cardId]: card });
}

export async function updateSystem(partial: Partial<System> | ((current: System) => Partial<System>)): Promise<System> {
	const current = await getSystem();
	const resolved = typeof partial === "function" ? partial(current) : partial;
	const updated: System = { ...current, ...resolved };
	await setSystem(updated);
	return updated;
}

export async function updateDeck(deckId: string, partial: Partial<Deck>): Promise<Deck> {
	const current = await getDeck(deckId);
	if (!current) {
    	throw new Error(`updateDeck: no deck found for id "${deckId}"`);
  	}

	const updated: Deck = { ...current, ...partial };
	await setDeck(deckId, updated);

	if (decksCache !== null) {
		decksCache = decksCache.map(d => (d.id === deckId ? updated : d));
	}

	return updated;
}

export async function updateCard(cardId: string, partial: Partial<Card>): Promise<Card> {
	const current = await getCard(cardId);
	if (!current) {
    	throw new Error(`updateCard: no card found for id "${cardId}"`);
	}

	const updated: Card = { ...current, ...partial };
	await setCard(cardId, updated);

	if (cardsCache !== null) {
		cardsCache = cardsCache.map(c => (c.id === cardId ? updated : c));
	}

	return updated;
}

export async function addDeck(deck: Deck): Promise<void> {
	await browser.storage.local.set({ [deck.id]: deck });

	if (decksCache !== null) {
		decksCache.push(deck);
	}
}

export async function addCard(card: Card): Promise<void> {
	await browser.storage.local.set({ [card.id]: card });

	if (cardsCache !== null) {
		cardsCache.push(card);
	}
}

export async function deleteDeck(deckId: string): Promise<void> {
	const allCards = await getAllCards();
	const cardsToDelete = allCards
		.filter(item => item.parentDeckId === deckId)
		.map(item => item.id);

	await browser.storage.local.remove(cardsToDelete);
	await browser.storage.local.remove(deckId);

	if (cardsCache !== null) {
		cardsCache = cardsCache.filter(c => c.parentDeckId !== deckId);
	}
}

export async function deleteCard(cardId: string): Promise<void> {
	await browser.storage.local.remove(cardId);

	if (cardsCache !== null) {
		cardsCache = cardsCache.filter(c => c.id !== cardId);
	}
}