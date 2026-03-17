'use client';

import { useEffect, useState } from 'react';
// @ts-ignore
import { init, Matcher, AnalyzedCharacter } from '@/lib/hanzi/hanzilookup.min';

interface HanziEngineProps {
    strokes: number[][][];
    onPredictions: (chars: string[]) => void;
}

export default function HanziEngine({
    strokes,
    onPredictions,
}: HanziEngineProps) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        init('mmah', '/data/mmah.json', (success: boolean) => {
            setIsReady(success);
        });
    }, []);

    useEffect(() => {
        if (!isReady || strokes.length === 0) return;

        const M = Matcher as any;
        const AC = AnalyzedCharacter as any;

        try {
            const matcher = new M('mmah');
            const char = new AC(strokes);
            matcher.match(char, 8, (matches: any[]) => {
                onPredictions(matches.map((m) => m.character));
            });
        } catch (e) {
            console.error('Engine Error:', e);
        }
    }, [strokes, isReady, onPredictions]);

    return null;
}
