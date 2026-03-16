// @/app/study/_components/FlashcardPlayer.tsx
'use client';

import { useState, useEffect } from 'react';
import { AnkiCard } from '@/context/VocabularyContext';
import { Typography } from '@/components/ui';
import { useFSRS } from '@/context/FSRSContext';
import { Rating } from 'ts-fsrs';
import { X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerProps {
    queue: AnkiCard[];
    onClose: () => void;
    settings: { showSimplified: boolean };
}

export function FlashcardPlayer({ queue, onClose, settings }: PlayerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const { gradeCard } = useFSRS();

    const currentCard = queue[currentIndex];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setIsFlipped(true);
            }
            if (isFlipped) {
                const keys: Record<string, Rating> = {
                    '1': Rating.Again,
                    '2': Rating.Hard,
                    '3': Rating.Good,
                    '4': Rating.Easy,
                };
                if (keys[e.key]) handleGrade(keys[e.key]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFlipped, currentIndex]);

    const handleGrade = async (rating: Rating) => {
        await gradeCard(currentCard.guid, rating);
        setIsFlipped(false);
        if (currentIndex < queue.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            onClose();
        }
    };

    if (!currentCard) return null;

    return (
        <div className="flex flex-col h-[65vh] min-h-[450px] max-h-[600px] w-full animate-in fade-in duration-500">
            {/* Minimal Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-baseline gap-2">
                    <Typography
                        variant="small"
                        className="font-black uppercase tracking-tighter opacity-30 text-[10px]"
                    >
                        Session
                    </Typography>
                    <span className="text-xs font-bold tabular-nums">
                        {currentIndex + 1} / {queue.length}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-ink/5 rounded-full transition-colors"
                >
                    <X size={16} className="opacity-30" />
                </button>
            </div>

            {/* Stage: Flexes horizontally on desktop */}
            <div className="flex-1 flex items-center justify-center py-2 overflow-hidden">
                <div
                    className={cn(
                        'w-full h-full max-w-5xl transition-all duration-500 preserve-3d cursor-pointer rounded-[2rem] border-2 shadow-sm bg-surface overflow-hidden',
                        isFlipped
                            ? 'border-ink shadow-xl'
                            : 'border-border-main',
                    )}
                    onClick={() => !isFlipped && setIsFlipped(true)}
                >
                    {!isFlipped ? (
                        /* FRONT - Focused Hanzi */
                        <div className="h-full w-full flex flex-col items-center justify-center p-6">
                            <Typography
                                variant="hanzi"
                                className="text-[min(12vw,140px)] leading-none text-ink select-none"
                            >
                                {currentCard.traditional}
                            </Typography>
                            <div className="mt-8 flex items-center gap-2 opacity-10">
                                <RotateCcw size={12} />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    Space to Flip
                                </span>
                            </div>
                        </div>
                    ) : (
                        /* BACK - Horizontal Layout */
                        <div className="h-full w-full flex flex-col md:flex-row animate-in fade-in duration-300">
                            {/* Left Side: The Hanzi stays visible but smaller */}
                            <div className="flex-[1] flex items-center justify-center bg-ink/[0.02] border-b md:border-b-0 md:border-r border-border-main p-6">
                                <Typography
                                    variant="hanzi"
                                    className="text-7xl md:text-8xl text-ink/40"
                                >
                                    {currentCard.traditional}
                                </Typography>
                            </div>

                            {/* Right Side: The Reveal */}
                            <div className="flex-[2] flex flex-col justify-center p-8 md:p-16 space-y-4 text-left">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500/50">
                                        Pronunciation
                                    </span>
                                    <Typography
                                        variant="pinyin"
                                        className="text-4xl text-red-500 font-bold italic tracking-tight"
                                    >
                                        {currentCard.pinyin}
                                    </Typography>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30">
                                        Definition
                                    </span>
                                    <Typography
                                        variant="h3"
                                        className="text-2xl md:text-3xl border-none p-0 m-0 leading-tight"
                                    >
                                        {currentCard.meaning}
                                    </Typography>
                                </div>

                                {settings.showSimplified && (
                                    <div className="pt-4 border-t border-border-main flex items-center gap-6">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black uppercase opacity-30">
                                                Simplified
                                            </span>
                                            <Typography
                                                variant="simplified"
                                                className="text-3xl text-ink/40"
                                            >
                                                {currentCard.simplified}
                                            </Typography>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls: Compact grid */}
            <div className="h-20 mt-6 flex items-center justify-center">
                {!isFlipped ? (
                    <button
                        onClick={() => setIsFlipped(true)}
                        className="px-12 py-3 bg-ink text-paper rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Reveal Answer
                    </button>
                ) : (
                    <div className="grid grid-cols-4 gap-3 w-full max-w-xl">
                        <GradeBtn
                            label="Again"
                            val="1"
                            color="bg-red-500"
                            onClick={() => handleGrade(Rating.Again)}
                        />
                        <GradeBtn
                            label="Hard"
                            val="2"
                            color="bg-orange-500"
                            onClick={() => handleGrade(Rating.Hard)}
                        />
                        <GradeBtn
                            label="Good"
                            val="3"
                            color="bg-green-600"
                            onClick={() => handleGrade(Rating.Good)}
                        />
                        <GradeBtn
                            label="Easy"
                            val="4"
                            color="bg-blue-500"
                            onClick={() => handleGrade(Rating.Easy)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function GradeBtn({
    label,
    val,
    color,
    onClick,
}: {
    label: string;
    val: string;
    color: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'group relative flex flex-col items-center justify-center py-3 rounded-xl text-white transition-all hover:brightness-105 active:scale-95 shadow-sm',
                color,
            )}
        >
            <span className="text-[9px] font-black uppercase tracking-wider">
                {label}
            </span>
            <span className="text-[8px] font-bold opacity-30 mt-0.5">
                {val}
            </span>
        </button>
    );
}
