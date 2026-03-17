'use client';

import { useState, useRef } from 'react';
import HanziEngine from './HanziEngine';
import HanziCanvas from './HanziCanvas';

export default function HanziWriter() {
    const [strokes, setStrokes] = useState<number[][][]>([]);
    const [predictions, setPredictions] = useState<string[]>([]);
    const canvasRef = useRef<{ clear: () => void }>(null);

    const handleReset = () => {
        setStrokes([]);
        setPredictions([]);
        canvasRef.current?.clear(); // Tell the canvas to clear its pixels
    };

    return (
        <div className="flex flex-col items-center gap-6 p-10">
            <h1 className="text-lg font-bold">Handwriting Recognition</h1>

            <HanziEngine strokes={strokes} onPredictions={setPredictions} />

            <HanziCanvas ref={canvasRef} onStrokeComplete={setStrokes} />

            <div className="flex gap-2 min-h-[60px]">
                {predictions.map((p) => (
                    <button
                        key={p}
                        className="text-4xl p-2 bg-slate-100 rounded border hover:bg-white transition-all font-kaiti"
                    >
                        {p}
                    </button>
                ))}
            </div>

            <button
                onClick={handleReset}
                className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium uppercase tracking-wider hover:bg-slate-800 transition-colors"
            >
                Clear Canvas
            </button>
        </div>
    );
}
