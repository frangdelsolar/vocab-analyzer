'use client';

import { useState } from 'react';
import HanziValidator from './HanziValidator';
import { Stack, Row, Box } from '@/components/layout/Primitives';
import { Typography } from '@/components/ui';

interface Props {
    targetPhrase: string; // La frase completa de la card
}

export default function HanziWriter({ targetPhrase }: Props) {
    const [charIndex, setCharIndex] = useState(0);
    const charArray = Array.from(targetPhrase);
    const currentChar = charArray[charIndex];

    const handleCharSuccess = (score: number) => {
        console.log('Score:', score, 'for', currentChar);
        if (score > 0.75 && charIndex < charArray.length - 1) {
            // Auto-advance al siguiente carácter tras un breve delay
            setTimeout(() => setCharIndex((prev) => prev + 1), 600);
        }
    };

    return (
        <Stack gap={8} className="items-center w-full">
            {/* Indicador visual de progreso de la frase */}
            <Row gap={3} className="justify-center">
                {charArray.map((char, i) => (
                    <Box
                        key={i}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all duration-500 ${
                            i === charIndex
                                ? 'border-cyan-500 bg-cyan-50 scale-110 shadow-sm'
                                : i < charIndex
                                  ? 'border-green-500 bg-green-50 opacity-40'
                                  : 'border-slate-100 opacity-20'
                        }`}
                    >
                        <Typography
                            variant="hanzi"
                            className="font-kaiti font-bold"
                        >
                            {char}
                        </Typography>
                    </Box>
                ))}
            </Row>

            {/* El validador se reinicia totalmente con la prop 'key' al cambiar de carácter */}
            <HanziValidator
                key={`${targetPhrase}-${charIndex}`}
                targetChar={currentChar}
                onValidated={handleCharSuccess}
            />

            <Typography variant="small" className="opacity-30 italic">
                Escribe el carácter {charIndex + 1} de {charArray.length}
            </Typography>
        </Stack>
    );
}
