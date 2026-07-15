import { useState, useEffect, useRef } from "react";

export default function Timer() {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const scheduledTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const init = async () => {
      const alarm = await browser.alarms.get("translation-prompt");
      if (!alarm) {
        return;
      }

      scheduledTimeRef.current = alarm.scheduledTime;
      setSecondsLeft(
        Math.max(0, Math.floor((alarm.scheduledTime - Date.now()) / 1000)),
      );
    };

    init();

    const interval = setInterval(() => {
      if (scheduledTimeRef.current === null) {
        return;
      }

      setSecondsLeft(
        Math.max(0, Math.floor((scheduledTimeRef.current - Date.now()) / 1000)),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const format = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    seconds %= 3600;
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    seconds %= 60;
    const secs = seconds.toString().padStart(2, "0");

    return `${hours}:${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-4xl font-mono font-medium tracking-tight text-text-primary">
        {secondsLeft === null ? "--:--:--" : format(secondsLeft)}
      </span>
      <span className="text-xs font-sans text-text-secondary uppercase tracking-widest">
        until next challenge
      </span>
    </div>
  );
}
