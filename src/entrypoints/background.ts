export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    browser.alarms.create("translation-prompt", { periodInMinutes: 30 });
  });

  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "translation-prompt") {
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
