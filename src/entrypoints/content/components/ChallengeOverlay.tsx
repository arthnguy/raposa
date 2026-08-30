import { useState, useEffect, useRef, type CSSProperties } from "react";
import RadialProgress from "@/entrypoints/content/components/RadialProgress";
import { getSystem, getCardsInDeck } from "@/lib/storage";
import { diffText, type Segment } from "@/utils/diff";
import { X } from "lucide-react";
import type { Card } from "@/types/deck";

function Front({
    front,
    deckName,
    userAnswer,
    setUserAnswer,
    handleSubmission,
}: {
    front: string,
    deckName: string,
    userAnswer: string,
    setUserAnswer: (value: string) => void,
    handleSubmission: () => void,
}) {
	const GROW_STYLE = { fieldSizing: "content" } as CSSProperties;

    const [isClicked, setIsClicked] = useState(false);

    return (
        <div className="font-sans w-full flex flex-col items-center gap-3">
            <div className="w-full">
                <p className="text-text-muted text-sm text-center">{deckName}</p>
                <p className="text-text-primary text-lg font-medium text-center wrap-break-word">{front}</p>
            </div>
            <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer..."
                style={GROW_STYLE}
                className="w-full text-center wrap-break-word resize-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            />
            <button
                onClick={() => {
                    setIsClicked(true);
                    handleSubmission();
                }}
                disabled={isClicked}
                className="cursor-pointer disabled:cursor-default bg-accent text-background text-sm rounded-lg px-5 py-2"
            >
                Check answer
            </button>
        </div>
    )
}

function Back({
    back,
    userAnswer,
}: {
    back: string,
    userAnswer: string,
}) {
    const backDiff: Segment[] = diffText(userAnswer, back)[1];

    return (
        <div className="font-sans w-full flex flex-col items-center gap-2">
            <p className="text-text-primary text-lg font-medium text-center wrap-break-word max-w-full">{back}</p>
            <p className="text-sm text-center leading-relaxed w-full wrap-break-word">
                {backDiff.map((segment, i) => (
                    <span
                        key={i}
                        className={
                            segment.matched
                                ? "bg-green-400"
                                : "bg-red-400"
                        }
                    >
                        {segment.text}
                    </span>
                ))}
            </p>
        </div>
    )
}

export default function ChallengeOverlay({ onDismiss }: { onDismiss: () => void }) {
    const [currTime, setCurrTime] = useState(0);
    const [challengeDuration, setChallengeDuration] = useState(0);

    const [userAnswer, setUserAnswer] = useState("");
    const [card, setCard] = useState<Card | null>(null);
    const [deckName, setDeckName] = useState("");
    const [showBack, setShowBack] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        (async () => {
            const system = await getSystem();
            const cards = await getCardsInDeck(system.activeDeckId);
            const deck = await getDeck(system.activeDeckId);
            setDeckName(deck.name);

            if (cards.length === 0) {
                onDismiss();
                return;
            }

            const randomCard = cards[Math.floor(Math.random() * cards.length)];
            setCard(randomCard ? randomCard : null);

            setChallengeDuration(system.challengeDuration);
            setCurrTime(system.challengeDuration);

            intervalRef.current = setInterval(() => {
                setCurrTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        setShowBack(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        })();

        return () => {
            if (intervalRef.current !== null) clearInterval(intervalRef.current);
        };
    }, []);

    const onSubmission = () => {
        if (intervalRef.current !== null) clearInterval(intervalRef.current);
        setShowBack(true);
    };

    return (
        <div className="fixed left-6 top-6 w-100 bg-surface p-5 border border-border shadow-xl rounded-2xl">
            <div className="flex justify-between items-center mb-4">
                <RadialProgress fraction={challengeDuration ? currTime / challengeDuration : 0} />
                <X
                    size={18}
                    className="text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
                    onClick={() => onDismiss()}
                />
            </div>

            {
                card !== null &&
                <div className="flex flex-col items-center">
                    <Front
                        front={card.front}
                        userAnswer={userAnswer}
                        deckName={deckName}
                        setUserAnswer={setUserAnswer}
                        handleSubmission={onSubmission}
                    />
                    {showBack && (
                        <>
                            <hr className="w-full border-t border-border my-5" />
                            <Back
                                back={card.back}
                                userAnswer={userAnswer}
                            />
                        </>
                    )}
                </div>
            }
        </div>
    )
}