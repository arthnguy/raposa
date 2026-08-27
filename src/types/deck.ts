export interface Card {
  id: string;
  front: string;
  back: string;
  favorite: boolean;
  parentDeckId: string;
}

export interface Deck {
  id: string;
  name: string;
  createdAt: number;
}
