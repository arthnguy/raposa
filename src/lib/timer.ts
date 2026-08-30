import { getSystem, updateSystem } from "@/lib/storage";

export const CHALLENGE_ALARM_NAME = "translation-prompt";

export async function createChallengeTimer(): Promise<void> {
	const system = await getSystem();
	await browser.alarms.create(CHALLENGE_ALARM_NAME, { periodInMinutes: system.timeBetweenChallenges });
}

export async function clearChallengeTimer(): Promise<void> {
	await browser.alarms.clear(CHALLENGE_ALARM_NAME);
}

export async function isChallengeTimerRunning(): Promise<boolean> {
	const alarm = await browser.alarms.get(CHALLENGE_ALARM_NAME);
	return alarm !== undefined;
}

// Because Chrome's alarms can't pause I gotta do it myself
export async function stopChallengeTimer(): Promise<void> {
	const alarm = await browser.alarms.get(CHALLENGE_ALARM_NAME);
	const remainingMs = alarm ? Math.max(0, alarm.scheduledTime - Date.now()) : null;

	await clearChallengeTimer();
	await updateSystem({ pausedRemainingMs: remainingMs });
}

export async function startChallengeTimer(): Promise<void> {
	const system = await getSystem();

	// Nothing was paused
	if (system.pausedRemainingMs === null) {
		await createChallengeTimer();
		return;
	}

	await browser.alarms.create(CHALLENGE_ALARM_NAME, {
		when: Date.now() + system.pausedRemainingMs,
		periodInMinutes: system.timeBetweenChallenges,
	});

	await updateSystem({ pausedRemainingMs: null });
}