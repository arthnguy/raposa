import { useState, useEffect, useRef } from "react";

interface TimerProps {
  disabled: boolean;
}

export default function Timer({ disabled }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const scheduledTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (disabled) {
      scheduledTimeRef.current = null;
      setSecondsLeft(null);
      return;
    }

    let intervalId: number | undefined;
    let cancelled = false;

    const init = async () => {
      const alarm = await browser.alarms.get("translation-prompt");

      // If disabled flipped (or this component unmounted) while this fetch was still in flight, this is stale so bail
      if (cancelled || !alarm) {
        return;
      }

      scheduledTimeRef.current = alarm.scheduledTime;
      setSecondsLeft(
        Math.max(0, Math.floor((alarm.scheduledTime - Date.now()) / 1000))
      );

      intervalId = window.setInterval(() => {
        if (scheduledTimeRef.current === null) return;
        setSecondsLeft(
          Math.max(0, Math.floor((scheduledTimeRef.current - Date.now()) / 1000))
        );
      }, 1000);
    };

    init();

    return () => {
      cancelled = true;
      
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [disabled]);

  const format = (seconds: number | null) => {
    if (seconds === null) {
      return "--:--:--";
    }

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

  if (disabled) {
    return (
      <span className="text-sm text-text-muted">Select a deck to start</span>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-4xl font-mono font-medium tracking-tight">
        {format(secondsLeft)}
      </span>
      <span className="text-xs text-text-secondary uppercase tracking-widest">
        until next challenge
      </span>
    </div>
  );
}