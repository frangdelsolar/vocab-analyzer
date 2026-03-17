'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface HanziCanvasProps {
    onStrokeComplete: (strokes: number[][][]) => void;
}

// We use forwardRef so the Orchestrator can call .clear() directly
const HanziCanvas = forwardRef(
    ({ onStrokeComplete }: HanziCanvasProps, ref) => {
        const sigRef = useRef<SignatureCanvas>(null);

        // Expose the clear method to the parent
        useImperativeHandle(ref, () => ({
            clear: () => {
                sigRef.current?.clear();
            },
        }));

        const handleStrokeEnd = () => {
            if (!sigRef.current) return;

            // Get the raw data
            const rawData: any[] = sigRef.current.toData();

            // Safety check: map through strokes and handle different internal structures
            const formattedStrokes = rawData
                .map((stroke: any) => {
                    // If stroke is already an array of points
                    if (Array.isArray(stroke)) {
                        return stroke.map((p: any) => [p.x, p.y]);
                    }
                    // If stroke is an object containing points (older/different versions)
                    if (stroke.points && Array.isArray(stroke.points)) {
                        return stroke.points.map((p: any) => [p.x, p.y]);
                    }
                    return [];
                })
                .filter((s) => s.length > 0); // Remove any empty/invalid strokes

            onStrokeComplete(formattedStrokes);
        };

        return (
            <div className="border-2 border-slate-300 rounded-lg bg-white shadow-lg overflow-hidden">
                <SignatureCanvas
                    ref={sigRef}
                    onEnd={handleStrokeEnd}
                    canvasProps={{
                        width: 300,
                        height: 300,
                        className: 'cursor-crosshair',
                    }}
                    velocityFilterWeight={0.1}
                    minWidth={1.5}
                    maxWidth={4.5}
                    penColor="#2d2d2d"
                />
            </div>
        );
    },
);

HanziCanvas.displayName = 'HanziCanvas';
export default HanziCanvas;
