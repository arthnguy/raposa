export type Segment = {
    text: string;
    matched: boolean;
};

const DELIMITER = /[\s,;:.!?()\[\]{}"'“”‘’«»]/;

export function segmentText(text: string): string[] {
    return Array.from(text);
}

function isDelimiterToken(token: string): boolean {
    return DELIMITER.test(token);
}

type MatchBlock = {
    aStart: number;
    bStart: number;
    length: number;
};

function findLongestMatch(
    a: string[],
    b: string[],
    aLo: number,
    aHi: number,
    bLo: number,
    bHi: number
): MatchBlock | null {
    const n = aHi - aLo;
    const m = bHi - bLo;

    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

    let best: MatchBlock | null = null;

    for (let i = 1; i <= n; i++) {
        const prevRow = dp[i - 1]!;
        const row = dp[i]!;

        for (let j = 1; j <= m; j++) {
            const aToken = a[aLo + i - 1]!;
            const bToken = b[bLo + j - 1]!;

            if (aToken.toLowerCase() !== bToken.toLowerCase()) continue;

            const length = prevRow[j - 1]! + 1;
            row[j] = length;

            if (length === 1 && isDelimiterToken(aToken)) continue;

            if (best === null || length > best.length) {
                best = { aStart: aLo + i - length, bStart: bLo + j - length, length };
            }
        }
    }

    return best;
}

// Recursively finds the longest match, then the longest match to its left and to its right, and so on
// Find the biggest match, split, repeat approach
function getMatchingBlocks(a: string[], b: string[]): MatchBlock[] {
    const blocks: MatchBlock[] = [];
    const ranges: [number, number, number, number][] = [[0, a.length, 0, b.length]];

    while (ranges.length > 0) {
        const [aLo, aHi, bLo, bHi] = ranges.pop()!;
        const match = findLongestMatch(a, b, aLo, aHi, bLo, bHi);
        if (match === null) continue;

        blocks.push(match);

        if (aLo < match.aStart && bLo < match.bStart) {
            ranges.push([aLo, match.aStart, bLo, match.bStart]);
        }

        const aEnd = match.aStart + match.length;
        const bEnd = match.bStart + match.length;
        if (aEnd < aHi && bEnd < bHi) {
            ranges.push([aEnd, aHi, bEnd, bHi]);
        }
    }

    return blocks.sort((x, y) => x.aStart - y.aStart);
}

function toSegments(tokens: string[], blocks: MatchBlock[], side: "a" | "b"): Segment[] {
    const matched: boolean[] = new Array(tokens.length).fill(false);

    for (const block of blocks) {
        const start = side === "a" ? block.aStart : block.bStart;
        for (let i = 0; i < block.length; i++) {
            matched[start + i] = true;
        }
    }

    return tokens.map((text, i) => ({ text, matched: matched[i]! }));
}

export function diffText(a: string, b: string): [Segment[], Segment[]] {
    const aTokens = segmentText(a);
    const bTokens = segmentText(b);
    const blocks = getMatchingBlocks(aTokens, bTokens);

    return [toSegments(aTokens, blocks, "a"), toSegments(bTokens, blocks, "b")];
}