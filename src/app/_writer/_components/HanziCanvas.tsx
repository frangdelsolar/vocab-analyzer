'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface HanziCanvasProps {
    onStrokeComplete: (strokes: number[][][]) => void;
}

const HanziCanvas = forwardRef(
    ({ onStrokeComplete }: HanziCanvasProps, ref) => {
        const sigRef = useRef<SignatureCanvas>(null);

        useImperativeHandle(ref, () => ({
            clear: () => sigRef.current?.clear(),
        }));

        const handleStrokeEnd = () => {
            if (!sigRef.current) return;
            const rawData: any[] = sigRef.current.toData();

            const formattedStrokes = rawData
                .map((stroke: any) => {
                    const points = Array.isArray(stroke)
                        ? stroke
                        : stroke.points;
                    return points ? points.map((p: any) => [p.x, p.y]) : [];
                })
                .filter((s) => s.length > 0);

            onStrokeComplete(formattedStrokes);
        };

        return (
            /* The container determines the size. aspect-square keeps it a box */
            <div className="w-full max-w-[400px] aspect-square border-2 border-slate-300 rounded-lg bg-white shadow-lg overflow-hidden mx-auto">
                <SignatureCanvas
                    ref={sigRef}
                    onEnd={handleStrokeEnd}
                    canvasProps={{
                        // Use CSS to handle sizing instead of fixed attributes
                        className: 'w-full h-full cursor-crosshair',
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
