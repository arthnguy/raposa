import { getSystem, updateSystem } from "@/lib/storage";
import type { System } from "@/types/system";
import { useState } from "react";

const CHALLENGE_ALARM_NAME = "translation-prompt";

function NumberSetting({
	label,
	unit,
	value,
	onChange,
	onCommit,
}: {
	label: string;
	unit: string;
	value: number;
	onChange: (value: number) => void;
	onCommit: () => void;
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
	const [system, setSystem] = useState<System | null>(null);

	useEffect(() => {
		(async () => {
			const result = await getSystem()
			setSystem(result);
			setTimeBetween(result.timeBetweenChallenges);
			setChallengeDuration(result.challengeDuration);
		})();
	}, []);

	async function handleUpdateTime() {
		if (timeBetween === null) {
			return;
		}

		const alarm = await browser.alarms.get(CHALLENGE_ALARM_NAME);
		if (alarm?.periodInMinutes === timeBetween) {
			return;
		}

		updateSystem({ timeBetweenChallenges: timeBetween });
		await browser.alarms.create(CHALLENGE_ALARM_NAME, {
			periodInMinutes: timeBetween,
		});
	}

	return (
		<section>
			<h2 className="text-sm font-medium text-text-secondary mb-4">
				Time settings
			</h2>

			{
				timeBetween && 
				<div className="mb-4">
					<NumberSetting
						label="Time between challenges"
						unit="minutes"
						value={timeBetween}
						onChange={setTimeBetween}
						onCommit={() => {
							handleUpdateTime();

							// TODO
							if (!system?.isCurrentlyTranslating) {
								
							} else {

							}
						}}
					/>
				</div>
			}

			{
				challengeDuration &&
				<NumberSetting
					label="Challenge duration"
					unit="seconds"
					value={challengeDuration}
					onChange={setChallengeDuration}
					onCommit={handleUpdateTime}
				/>
			}
		</section>
	);
}