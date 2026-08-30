import { createDefaultSystem } from "@/utils/factories";
import { getSystem, setSystem, updateSystem, getCardsInDeck } from "@/lib/storage";
import {
	CHALLENGE_ALARM_NAME,
	createChallengeTimer,
	clearChallengeTimer,
	startChallengeTimer,
	stopChallengeTimer,
	isChallengeTimerRunning,
} from "@/lib/timer";

let activeChallengeTabId: number | null = null;

async function hasChallengeableCards(): Promise<boolean> {
	const system = await getSystem();
	if (!system.activeDeckId) {
		return false;
	}

	const cards = await getCardsInDeck(system.activeDeckId);
	return cards.length > 0;
}

async function reevaluateTimer(): Promise<void> {
	const system = await getSystem();

	// Disabled or mid-challenge - alarm should stay off regardless of card
	// availability. This only ever turns the alarm ON, so it can't fight
	// with the isEnabled toggle's own pause/resume handling below.
	if (!system.isEnabled || system.isCurrentlyTranslating) {
		return;
	}

	const canRun = await hasChallengeableCards();
	const running = await isChallengeTimerRunning();

	if (canRun && !running) {
		await createChallengeTimer();
	} else if (!canRun && running) {
		await clearChallengeTimer();
	}
}

async function endChallenge(): Promise<void> {
	activeChallengeTabId = null;
	await updateSystem({ isCurrentlyTranslating: false });

	const system = await getSystem();
	if (system.isEnabled && (await hasChallengeableCards())) {
		await createChallengeTimer();
	}
}

export default defineBackground(() => {
	browser.runtime.onInstalled.addListener(async () => {
		const system = createDefaultSystem();
		await setSystem(system);
		await createChallengeTimer();
	});

	browser.alarms.onAlarm.addListener(async (alarm) => {
		if (alarm.name !== CHALLENGE_ALARM_NAME) {
			return;
		}

		const system = await getSystem();
		if (!system.isEnabled || system.isCurrentlyTranslating) {
			return;
		}

		if (!(await hasChallengeableCards())) {
			await clearChallengeTimer();
			return;
		}

		const tabs = await browser.tabs.query({ active: true, currentWindow: true });
		const tab = tabs[0];
		if (!tab?.id) {
			return;
		}

		await clearChallengeTimer();

		try {
			await browser.tabs.sendMessage(tab.id, "show-overlay");
			await updateSystem({ isCurrentlyTranslating: true });
			activeChallengeTabId = tab.id;
		} catch {
			await createChallengeTimer();
		}
	});

	browser.runtime.onMessage.addListener(async (message) => {
		if (message !== "challenge-dismissed") {
			return;
		}

		await endChallenge();
	});

	// Sudden tab event edge cases
	browser.tabs.onRemoved.addListener(async (tabId) => {
		if (tabId === activeChallengeTabId) {
			await endChallenge();
		}
	});

	browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
		if (tabId === activeChallengeTabId && changeInfo.status === "loading") {
			await endChallenge();
		}
	});

	browser.storage.onChanged.addListener(async (changes, area) => {
		if (area !== "local") {
			return;
		}

		if ("isEnabled" in changes) {
			const { newValue } = changes.isEnabled;

			if (newValue === false) {
				await stopChallengeTimer();
			} else if (newValue === true) {
				const system = await getSystem();
				if (!system.isCurrentlyTranslating) {
					await startChallengeTimer();
				}
			}
			return;
		}

		const relevant = Object.keys(changes).some(
			(key) => key.startsWith("card_") || key.startsWith("deck_") || key === "activeDeckId"
		);

		if (relevant) {
			reevaluateTimer();
		}
	});
});