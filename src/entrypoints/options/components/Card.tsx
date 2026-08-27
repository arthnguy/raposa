import { useState } from "react";
import { Pencil, Check, Star, Trash2 } from "lucide-react";
import type { Card as CardType } from "@/types/deck";

function Content({
	isEditing,
	front,
	setFront,
	back,
	setBack,
}: {
	isEditing: boolean,
	front: string,
	setFront: (value: string) => void,
	back: string,
	setBack: (value: string) => void,
}) {
	// Chrome 123+ only
	const GROW_STYLE = { fieldSizing: "content" } as React.CSSProperties;

	return (
		<>
			{isEditing ? (
				<textarea
					value={front}
					onChange={(e) => setFront(e.target.value)}
					style={GROW_STYLE}
					className="resize-none w-full bg-background border border-border rounded-lg px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-accent"
				/>
			) : (
				<span className="block min-w-0 wrap-break-word text-sm text-text-primary">{front}</span>
			)}

			{isEditing ? (
				<textarea
					value={back}
					onChange={(e) => setBack(e.target.value)}
					style={GROW_STYLE}
					className="resize-none w-full bg-background border border-border rounded-lg px-2 py-1 text-sm text-text-secondary focus:outline-none focus:border-accent"
				/>
			) : (
				<span className="block min-w-0 wrap-break-word text-sm text-text-secondary">{back}</span>
			)}
		</>
	)
}

function Delete({
	isEditing,
	handleDeleteCard,
}: {
	isEditing: boolean,
	handleDeleteCard: () => void,
}) {
    return (
		<button
			onClick={() => handleDeleteCard()}
			disabled={isEditing}
			aria-label="Delete this card"
			className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mr-3"
		>
			<Trash2 size={16} className="text-danger" />
		</button>
    );
}

function Edit({
	isEditing,
	handleStartEdit,
	handleConfirmEdit,
}: {
	isEditing: boolean,
	handleStartEdit: () => void,
	handleConfirmEdit: () => void,
}) {
	return (
		<button
			onClick={() => isEditing ? handleConfirmEdit() : handleStartEdit()}
			aria-label={isEditing ? "Confirm changes" : "Edit this card"}
			className="cursor-pointer"
		>
			{isEditing ? (
				<Check size={16} className="text-success" />
			) : (
				<Pencil size={16} className="text-text-muted" />
			)}
		</button>
	)
}

function Favorite({
	isFavorite,
	handleToggleFavorite,
}: {
	isFavorite: boolean,
	handleToggleFavorite: () => void,
}) {
	return (
		<button
			onClick={handleToggleFavorite}
			aria-label={isFavorite ? "Unfavorite this card" : "Favorite this card"}
			className="cursor-pointer"
		>
			<Star
				size={16}
				className={isFavorite ? "text-accent" : "text-text-muted"}
				fill={isFavorite ? "currentColor" : "none"}
			/>
		</button>
	);
}

export default function Card({
	card,
	handleDeleteCard,
	handleUpdateCard,
}: {
	card: CardType,
	handleDeleteCard: (card: CardType) => Promise<void>,
	handleUpdateCard: (card: CardType) => Promise<void>,
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [front, setFront] = useState(card.front);
	const [back, setBack] = useState(card.back);
	const [isFavorite, setIsFavorite] = useState(card.favorite);

	const handleStartEdit = (): void => {
		setIsEditing(true);
	};

	const handleConfirmEdit = async (): Promise<void> => {
		await handleUpdateCard({ ...card, front, back, favorite: isFavorite });
		setIsEditing(false);
	};

	const handleToggleFavorite = async (): Promise<void> => {
		const next = !isFavorite;
		setIsFavorite(next);
		await handleUpdateCard({ ...card, front, back, favorite: next });
	};

	return (
		<div style={{ contentVisibility: "auto" }} className="grid grid-cols-[1fr_1fr_96px] gap-4 items-start py-3 border-b border-border">
			<Content isEditing={isEditing} front={front} setFront={setFront} back={back} setBack={setBack} />

			<div className="flex flex-col items-end gap-1">
				<div className="flex gap-2">
					<Delete isEditing={isEditing} handleDeleteCard={() => handleDeleteCard(card)} />
					<Edit isEditing={isEditing} handleStartEdit={handleStartEdit} handleConfirmEdit={handleConfirmEdit} />
					<Favorite isFavorite={isFavorite} handleToggleFavorite={handleToggleFavorite} />
				</div>
			</div>
		</div>
	);
}