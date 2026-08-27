import { createDefaultSystem } from "@/utils/factories";
import { setSystem } from "@/lib/storage";

const CHALLENGE_ALARM_NAME = "translation-prompt";

export default defineBackground(() => {
	browser.runtime.onInstalled.addListener(async () => {
		const system = createDefaultSystem();
		await setSystem(system);
		browser.alarms.create(CHALLENGE_ALARM_NAME, { periodInMinutes: system.timeBetweenChallenges });
		await browser.storage.local.set({ challengeDurationSeconds: system.challengeDuration });
	});

	browser.alarms.onAlarm.addListener(async (alarm) => {
		if (alarm.name === CHALLENGE_ALARM_NAME) {
			const tabs = await browser.tabs.query({
				active: true,
				currentWindow: true,
			});
			const tab = tabs[0];

			if (tab?.id) {
				await browser.tabs.sendMessage(tab.id, "show-overlay");
			}
		}
	});
});
