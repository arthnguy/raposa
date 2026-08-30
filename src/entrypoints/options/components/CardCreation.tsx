import { useState } from "react";

const MAX_LENGTH = 250;

export default function CardCreation({
	onConfirm,
	onCancel,
}: {
	onConfirm: (front: string, back: string) => Promise<void>,
	onCancel: () => void,
}) {
	const [front, setFront] = useState("");
	const [back, setBack] = useState("");

	const handleConfirm = async (): Promise<void> => {
		if (!front.trim() || !back.trim()) {
			return;
		}

		await onConfirm(front, back);
		setFront("");
		setBack("");
	};

	return (
		<div className="absolute right-0 top-full z-10 mt-2 flex w-72 flex-col gap-2 rounded-lg border border-border bg-surface p-3 shadow-lg">
			<div className="relative">
				<textarea
					value={front}
					onChange={(e) => setFront(e.target.value)}
					placeholder="Front"
					autoFocus
					maxLength={MAX_LENGTH}
					className="w-full resize-none rounded-lg border border-border bg-background px-2 py-1 text-sm text-text-primary focus:border-accent focus:outline-none"
				/>
				<span className="pointer-events-none absolute bottom-1 right-2 text-[10px] text-text-muted">
					{front.length}/{MAX_LENGTH}
				</span>
			</div>

			<div className="relative">
				<textarea
					value={back}
					onChange={(e) => setBack(e.target.value)}
					placeholder="Back"
					maxLength={MAX_LENGTH}
					className="w-full resize-none rounded-lg border border-border bg-background px-2 py-1 text-sm text-text-secondary focus:border-accent focus:outline-none"
				/>
				<span className="pointer-events-none absolute bottom-1 right-2 text-[10px] text-text-muted">
					{back.length}/{MAX_LENGTH}
				</span>
			</div>

			<div className="mt-1 flex justify-end gap-2">
				<button
					onClick={onCancel}
					className="cursor-pointer px-2 py-1 text-xs text-text-muted hover:text-text-primary"
				>
					Cancel
				</button>
				<button
					onClick={handleConfirm}
					className="cursor-pointer rounded-lg bg-accent px-3 py-1 text-xs text-background hover:opacity-90"
				>
					Add
				</button>
			</div>
		</div>
	);
}