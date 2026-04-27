'use client';

import { useEffect, useRef } from 'react';
import HanziWriter from 'hanzi-writer';
import { Stack, Row, Box } from '@/components/layout/Primitives';
import { Button, Typography } from '@/components/ui';

interface Props {
    targetChar: string;
    onValidated: (score: number) => void;
}

export default function HanziValidator({ targetChar, onValidated }: Props) {
    const writerElementRef = useRef<HTMLDivElement>(null);
    const writerRef = useRef<any>(null);

    useEffect(() => {
        if (!writerElementRef.current) return;

        // Initialize the writer
        writerRef.current = HanziWriter.create(
            writerElementRef.current,
            targetChar,
            {
                width: 300,
                height: 300,
                showCharacter: false, // Don't show the answer
                padding: 20,
                strokeColor: '#2d2d2d',
                radicalColor: '#06b6d4', // Cyan for radicals
            },
        );

        // Start the built-in quiz mode
        writerRef.current.quiz({
            onOutcome: (outcome: any) => {
                if (outcome.isCorrect) {
                    onValidated(1); // Pass 100% to the parent
                }
            },
            onMistake: (mistake: any) => {
                console.log('User messed up:', mistake.strokeNum);
            },
        });

        return () => {
            if (writerElementRef.current)
                writerElementRef.current.innerHTML = '';
        };
    }, [targetChar]);

    const handleReset = () => {
        writerRef.current?.cancelQuiz();
        writerRef.current?.quiz();
    };

    const showHint = () => {
        writerRef.current?.animateCharacter();
    };

    return (
        <Stack gap={6} className="items-center">
            <Box
                ref={writerElementRef}
                className="bg-white border-2 border-slate-200 rounded-2xl shadow-inner cursor-crosshair"
            />

            <Row gap={4} className="w-full">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleReset}
                >
                    Clear
                </Button>
                <Button variant="ghost" className="flex-1" onClick={showHint}>
                    Show Hint
                </Button>
            </Row>
        </Stack>
    );
}
