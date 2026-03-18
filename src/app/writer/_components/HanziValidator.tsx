'use client';

import { useState, useRef, useEffect } from 'react';
import HanziCanvas from './HanziCanvas';
import { Stack, Box, Row } from '@/components/layout/Primitives';
import { Typography, Button } from '@/components/ui';
import { calculateSimilarity, normalize } from '@/lib/hanzi/validator';

interface Props {
    targetChar: string;
    onValidated?: (score: number) => void;
}

export default function HanziValidator({ targetChar, onValidated }: Props) {
    const [userStrokes, setUserStrokes] = useState<number[][][]>([]);
    const [refStrokes, setRefStrokes] = useState<number[][][] | null>(null);
    const [score, setScore] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef<{ clear: () => void }>(null);

    // 1. Cargar datos de referencia para el carácter individual
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${targetChar}.json`,
                );
                const data = await res.json();
                // Usamos 'medians' para comparación de puntos o 'strokes' si están normalizados
                setRefStrokes(data.medians || []);
            } catch (e) {
                console.error('Error loading reference strokes');
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [targetChar]);

    const validate = () => {
        if (!refStrokes || userStrokes.length === 0) return;

        const normalizedUser = normalize(userStrokes);
        const similarity = calculateSimilarity(normalizedUser, refStrokes);

        setScore(similarity);
        if (onValidated) onValidated(similarity);
    };

    const handleReset = () => {
        setUserStrokes([]);
        setScore(0);
        canvasRef.current?.clear();
    };

    if (loading)
        return (
            <Box className="p-10 text-center opacity-30 animate-pulse">
                Cargando trazos...
            </Box>
        );

    return (
        <Stack gap={6} className="items-center relative w-full">
            {/* Guía visual fantasma de fondo */}
            <Typography
                variant="h1"
                className="font-kaiti opacity-[0.05] absolute top-10 pointer-events-none text-[10rem] select-none"
            >
                {targetChar}
            </Typography>

            <HanziCanvas ref={canvasRef} onStrokeComplete={setUserStrokes} />

            <Stack gap={2} className="w-full max-w-[400px]">
                <Box className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <Box
                        className={`h-full transition-all duration-500 ${score > 0.75 ? 'bg-green-500' : 'bg-cyan-500'}`}
                        style={{ width: `${score * 100}%` }}
                    />
                </Box>
            </Stack>

            <Row gap={4} className="w-full max-w-[400px]">
                <Button
                    variant="ghost"
                    className="flex-1 rounded-xl"
                    onClick={handleReset}
                >
                    Reiniciar
                </Button>
                <Button
                    variant="primary"
                    className="flex-2 rounded-xl"
                    onClick={validate}
                >
                    Verificar {targetChar}
                </Button>
            </Row>
        </Stack>
    );
}
