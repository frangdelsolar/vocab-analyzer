'use client';

import { useState, useRef } from 'react';
import HanziEngine from './HanziEngine';
import HanziCanvas from './HanziCanvas';
import { Stack, Row, Box } from '@/components/layout/Primitives';
import { Typography, Button } from '@/components/ui';

export default function HanziWriter() {
    const [strokes, setStrokes] = useState<number[][][]>([]);
    const [predictions, setPredictions] = useState<string[]>([]);
    const canvasRef = useRef<{ clear: () => void }>(null);

    const handleReset = () => {
        setStrokes([]);
        setPredictions([]);
        canvasRef.current?.clear();
    };

    return (
        /* Stack handles the vertical spacing between title, canvas, and results */
        <Stack gap={8} className="items-center w-full">
            <Stack gap={1} className="items-center">
                <Typography variant="h4" className="font-bold">
                    Handwriting Recognition
                </Typography>
                <Typography
                    variant="small"
                    className="opacity-40 uppercase tracking-widest text-[10px]"
                >
                    AI Engine Active
                </Typography>
            </Stack>

            {/* Business Logic (Headless) */}
            <HanziEngine strokes={strokes} onPredictions={setPredictions} />

            {/* Input Layer */}
            <HanziCanvas ref={canvasRef} onStrokeComplete={setStrokes} />

            {/* Results Layer - Row handles horizontal wrapping for mobile */}
            <Stack gap={3} className="items-center w-full">
                <Typography
                    variant="small"
                    className="opacity-20 font-black uppercase text-[9px] tracking-tighter"
                >
                    Top Predictions
                </Typography>
                <Row
                    gap={2}
                    className="justify-center flex-wrap min-h-[60px] w-full"
                >
                    {predictions.slice(0, 5).map((p, i) => (
                        <Box
                            key={i}
                            className="w-14 h-14 text-3xl flex items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm font-kaiti animate-in fade-in zoom-in duration-300"
                        >
                            <Typography variant="simplified">{p}</Typography>
                        </Box>
                    ))}
                </Row>
            </Stack>

            {/* Action Layer */}
            <Button
                onClick={handleReset}
                className="rounded-full px-8 h-12 uppercase text-xs font-bold tracking-widest shadow-sm"
            >
                Clear Canvas
            </Button>
        </Stack>
    );
}
