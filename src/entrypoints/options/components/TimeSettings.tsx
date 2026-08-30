import { getSystem, updateSystem } from "@/lib/storage";
import { CHALLENGE_ALARM_NAME } from "@/lib/timer";
import { useState, useEffect } from "react";

function NumberSetting({
	label, unit, value, onChange, onCommit,
}: {
	label: string; unit: string; value: number;
	onChange: (value: number) => void; onCommit: () => void;
}) {
	return (
		<div className="flex items-center justify-between">
			<label className="text-sm text-text-primary">{label}</label>
			<div className="flex items-center gap-2">
				<input
					type="number"
					value={value}
					onChange={(e) => onChange(Math.max(1, Number(e.target.value)))}
					onBlur={onCommit}
					className="w-16 text-center bg-surface border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
				/>
				<span className="text-xs text-text-muted">{unit}</span>
			</div>
		</div>
	);
}

export default function TimeSettings() {
	const [timeBetween, setTimeBetween] = useState<number | null>(null);
	const [challengeDuration, setChallengeDuration] = useState<number | null>(null);

	useEffect(() => {
		(async () => {
			const result = await getSystem();
			setTimeBetween(result.timeBetweenChallenges);
			setChallengeDuration(result.challengeDuration);
		})();
	}, []);

	async function handleUpdateTimeBetween() {
		if (timeBetween === null) {
			return;
		}

		const system = await getSystem();
		if (system.timeBetweenChallenges === timeBetween) {
			return;
		}

		await updateSystem({ timeBetweenChallenges: timeBetween });

		if (!system.isCurrentlyTranslating) {
			await browser.alarms.create(CHALLENGE_ALARM_NAME, { periodInMinutes: timeBetween });
		}
	}

	// Challenge duration has nothing to do with the recurring alarm - just save it.
	async function handleUpdateChallengeDuration() {
		if (challengeDuration === null) {
			return;
		}
		await updateSystem({ challengeDuration });
	}

	return (
		<section>
			<h2 className="text-sm font-medium text-text-secondary mb-4">Time settings</h2>

			{timeBetween !== null &&
				<div className="mb-4">
					<NumberSetting
						label="Time between challenges" unit="minutes"
						value={timeBetween} onChange={setTimeBetween}
						onCommit={handleUpdateTimeBetween}
					/>
				</div>
			}

			{challengeDuration !== null &&
				<NumberSetting
					label="Challenge duration" unit="seconds"
					value={challengeDuration} onChange={setChallengeDuration}
					onCommit={handleUpdateChallengeDuration}
				/>
			}
		</section>
	);
}