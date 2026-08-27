import { useState } from "react";

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
		<div className="absolute right-0 top-full mt-2 z-10 w-72 bg-surface border border-border rounded-lg p-3 shadow-lg flex flex-col gap-2">
			<textarea
				value={front}
				onChange={(e) => setFront(e.target.value)}
				placeholder="Front"
				autoFocus
				rows={2}
				className="resize-none w-full bg-background border border-border rounded-lg px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-accent"
			/>
			<textarea
				value={back}
				onChange={(e) => setBack(e.target.value)}
				placeholder="Back"
				rows={2}
				className="resize-none w-full bg-background border border-border rounded-lg px-2 py-1 text-sm text-text-secondary focus:outline-none focus:border-accent"
			/>
			<div className="flex justify-end gap-2 mt-1">
				<button
					onClick={onCancel}
					className="cursor-pointer text-xs text-text-muted hover:text-text-primary px-2 py-1"
				>
					Cancel
				</button>
				<button
					onClick={handleConfirm}
					className="cursor-pointer text-xs text-background bg-accent rounded-lg px-3 py-1 hover:opacity-90"
				>
					Add
				</button>
			</div>
		</div>
	);
}