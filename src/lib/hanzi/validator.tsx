// lib/hanzi/validator.ts

/**
 * Normalizes any set of strokes (User or Reference) to a consistent 0-1 range
 */
export function normalize(strokes: number[][][]): number[][][] {
    if (!strokes || strokes.length === 0) return [];

    let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

    strokes.forEach((stroke) => {
        stroke.forEach(([x, y]) => {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        });
    });

    const width = maxX - minX;
    const height = maxY - minY;
    const size = Math.max(width, height, 1);

    return strokes.map((stroke) =>
        stroke.map(([x, y]) => [(x - minX) / size, (y - minY) / size]),
    );
}

export function calculateSimilarity(
    userStrokes: number[][][],
    targetStrokes: number[][][],
): number {
    if (!userStrokes?.length || !targetStrokes?.length) return 0;

    // 1. IMPORTANT: Normalize BOTH to the same 0-1 scale so they are comparable
    const user = normalize(userStrokes);
    const target = normalize(targetStrokes);

    // 2. Stroke count penalty
    if (user.length !== target.length) {
        const diff = Math.abs(user.length - target.length);
        return Math.max(0, 0.4 - diff * 0.1); // Low score for wrong stroke count
    }

    let totalScore = 0;

    user.forEach((uStroke, i) => {
        const tStroke = target[i];
        if (!tStroke) return;

        // Check 3 points: Start, Middle, and End
        const uMid = uStroke[Math.floor(uStroke.length / 2)];
        const tMid = tStroke[Math.floor(tStroke.length / 2)];

        const startDist = getDistance(uStroke[0], tStroke[0]);
        const midDist = getDistance(uMid, tMid);
        const endDist = getDistance(
            uStroke[uStroke.length - 1],
            tStroke[tStroke.length - 1],
        );

        // Average distance for this stroke (closer to 0 is better)
        const strokeDist = (startDist + midDist + endDist) / 3;

        // Convert distance to score (1.0 is perfect, 0.0 is far away)
        // 0.3 is a threshold for "too far"
        totalScore += Math.max(0, 1 - strokeDist / 0.3);
    });

    return totalScore / target.length;
}

function getDistance(p1: number[], p2: number[]) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}
