export interface Flashcard {
  id: string;
  front: string;
  back: string;
  favorite: boolean;
  note: string;
  stats: {
    timesSeen: number;
    timesCorrect: number;
    timesIncorrect: number;
    lastReviewed: number | null;
  };
}

export interface Deck {
  id: string;
  name: string;
  cards: Flashcard[];
  createdAt: number;
}
