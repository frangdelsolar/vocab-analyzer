// lib/hanzi/validator.ts

/**
 * Compares two sets of strokes and returns a similarity score (0 to 1)
 * 1 = Perfect match, 0 = No match
 */
export function calculateSimilarity(
    userStrokes: number[][][],
    targetStrokes: number[][][],
): number {
    if (!userStrokes || !targetStrokes) return 0;
    if (userStrokes.length !== targetStrokes.length) return 0.2; // Wrong stroke count penalty

    let totalDistance = 0;
    let pointCount = 0;

    userStrokes.forEach((stroke, sIdx) => {
        const targetStroke = targetStrokes[sIdx];
        if (!targetStroke) return;

        // Compare start and end points of each stroke (critical in Hanzi)
        const startDist = getDistance(stroke[0], targetStroke[0]);
        const endDist = getDistance(
            stroke[stroke.length - 1],
            targetStroke[targetStroke.length - 1],
        );

        totalDistance += startDist + endDist;
        pointCount += 2;
    });

    const averageDist = totalDistance / pointCount;
    // Turn distance into a score (lower distance = higher score)
    return Math.max(0, 1 - averageDist * 2);
}

function getDistance(p1: number[], p2: number[]) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

/**
 * Normalizes strokes to a 0.0 - 1.0 unit square.
 */
export function normalize(strokes: number[][][]): number[][][] {
    if (strokes.length === 0) return [];

    // 1. Find the Bounding Box of the drawing
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

    // Use the largest dimension to maintain aspect ratio (don't stretch the character)
    const size = Math.max(width, height, 1);

    // 2. Scale and Center
    return strokes.map((stroke) =>
        stroke.map(([x, y]) => [(x - minX) / size, (y - minY) / size]),
    );
}
