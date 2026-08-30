import { useState, useEffect, useRef } from "react";
import { getSystem } from "@/lib/storage";
import { CHALLENGE_ALARM_NAME } from "@/lib/timer";

export default function Timer({ canChallenge, isEnabled }: { canChallenge: boolean, isEnabled: boolean }) {
	const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
	const [isTranslating, setIsTranslating] = useState(false);
	const scheduledTimeRef = useRef<number | null>(null);

	useEffect(() => {
		if (!canChallenge) {
			scheduledTimeRef.current = null;
			setSecondsLeft(null);
			setIsTranslating(false);
			return;
		}

		// Dumb timer edge case fix (empty timer when going from no valid decks to valid decks)
		let tickIntervalId: number | undefined;
		let pollIntervalId: number | undefined;
		let cancelled = false;

		setTimeout(async (): Promise<boolean> => {
			const system = await getSystem();
			if (cancelled) {
				return true;
			}

			if (system.isCurrentlyTranslating) {
				setIsTranslating(true);
				return true;
			}

			const alarm = await browser.alarms.get(CHALLENGE_ALARM_NAME);
			if (cancelled) {
				return true;
			}
			if (!alarm) {
				return false;
			}

			setIsTranslating(false);
			scheduledTimeRef.current = alarm.scheduledTime;
			setSecondsLeft(Math.max(0, Math.floor((alarm.scheduledTime - Date.now()) / 1000)));

			tickIntervalId = window.setInterval(() => {
				if (scheduledTimeRef.current === null) {
					return;
				}
				setSecondsLeft(Math.max(0, Math.floor((scheduledTimeRef.current - Date.now()) / 1000)));
			}, 1000);

			return true;
		}, 10);

		return () => {
			cancelled = true;
			if (tickIntervalId !== undefined) {
				clearInterval(tickIntervalId);
			}
			if (pollIntervalId !== undefined) {
				clearInterval(pollIntervalId);
			}
		};
	}, [canChallenge, isEnabled]);

	const format = (seconds: number | null) => {
		if (seconds === null) {
			return "--:--:--";
		}

		const hours = Math.floor(seconds / 3600).toString().padStart(2, "0");
		seconds %= 3600;
		const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
		seconds %= 60;
		const secs = seconds.toString().padStart(2, "0");
		return `${hours}:${mins}:${secs}`;
	};

	if (!canChallenge) {
		return <span className="text-sm text-text-muted">Create deck and cards to start</span>;
	}

	if (!isEnabled) {
		return <span className="text-sm text-text-muted">Timer paused</span>;
	}

	if (isTranslating) {
		return (
		<div className="flex flex-col items-center gap-1">
			<span className="text-sm text-text-secondary">Challenge in progress…</span>
		</div>
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