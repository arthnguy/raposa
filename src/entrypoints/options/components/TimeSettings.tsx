import { setTimeBetweenChallenges } from "@/lib/storage";
import { useState } from "react";

export default function TimeSettings() {
  const [timeBetween, setTimeBetween] = useState(30);
  const [challengeDuration, setChallengeDuration] = useState(60);

  return (
    <section>
      <h2 className="text-sm font-medium text-text-secondary mb-4">
        Time settings
      </h2>

      <div className="flex items-center justify-between mb-4">
        <label className="text-sm text-text-primary">
          Time between challenges
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={timeBetween}
            onChange={(e) => setTimeBetween(Math.max(1, Number(e.target.value)))}
            onBlur={async () => {
              const backgroundAlarm = await browser.alarms.get('translation-prompt');

              if (backgroundAlarm?.periodInMinutes !== timeBetween) {
                setTimeBetweenChallenges(timeBetween);
                await browser.alarms.create('translation-prompt', { periodInMinutes: timeBetween });
              }
            }}
            className="w-16 text-center bg-surface border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
          />
          <span className="text-xs text-text-muted">minutes</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm text-text-primary">Challenge duration</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={challengeDuration}
            onChange={(e) => setChallengeDuration(Math.max(1, Number(e.target.value)))}
            onBlur={async () => {
              setChallengeDuration(challengeDuration);
              await browser.storage.local.set({ challengeDurationSeconds: challengeDuration });
            }}
            className="w-16 text-center bg-surface border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
          />
          <span className="text-xs text-text-muted">seconds</span>
        </div>
      </div>
    </section>
  );
}
