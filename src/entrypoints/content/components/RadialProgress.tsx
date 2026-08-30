interface Point {
    x: number;
    y: number;
}

export default function RadialProgress({ fraction }: { fraction: number }) {
    const cx = 10;
    const cy = 10;
    const r = 8; // Small inset so the edge doesn't clip

    // Guard against NaN/undefined/out-of-range values (e.g. 0/0 upstream)
    const safeFraction = Number.isFinite(fraction)
        ? Math.min(1, Math.max(0, fraction))
        : 0;

    const polarToCartesian = (angleDeg: number): Point => {
        const rad = ((angleDeg - 90) * Math.PI) / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    const describePie = (fraction: number): string => {
        if (fraction >= 0.999) {
            return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
        }
        if (fraction <= 0.001) {
            return "";
        }

        const top = { x: cx, y: cy - r };
        const end = polarToCartesian(fraction * 360);
        const largeArcFlag = fraction > 0.5 ? 1 : 0;

        return `M ${cx} ${cy} L ${top.x} ${top.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
    };

    return (
        <div className="flex items-center gap-6">
            <svg width={20} height={20} viewBox={`0 0 20 20`}>
                <circle cx={cx} cy={cy} r={r} fill="#1e293b" />
                <path d={describePie(safeFraction)} fill={fraction >= 0.25 ? "#e2e8f0" : "#e7000b"} />
            </svg>
        </div>
    );
}