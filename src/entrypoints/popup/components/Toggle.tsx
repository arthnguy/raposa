export default function Toggle({
	isOn,
	onToggle,
	label,
}: {
	isOn: boolean;
	onToggle: () => void;
	label?: string;
}) {
	return (
        <div className="flex items-center">
            <button
                role="switch"
                aria-checked={isOn}
                aria-label={label}
                onClick={onToggle}
                className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    isOn ? "bg-accent" : "bg-border"
                }`}
            >
            <span
                className={`inline-block h-2 w-2 transform rounded-full bg-text-primary shadow-sm transition-transform duration-200 ${
                    isOn ? "translate-x-5" : "translate-x-1"
                }`}
            />
            </button>

            <p className={"transition-colors ml-1 text-sm " + (isOn ? "text-accent" : "text-text-muted")}>TIMER {isOn ? "ACTIVE" : "INACTIVE"}</p>
        </div>
	);
}