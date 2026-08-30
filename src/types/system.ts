export interface System {
	challengeDuration: number;
	timeBetweenChallenges: number;
	activeDeckId: string;
	isCurrentlyTranslating: boolean;
	isEnabled: boolean;
	pausedRemainingMs: number | null;
}