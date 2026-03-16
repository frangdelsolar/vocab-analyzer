// @/app/study/_components/StudyStartCard.tsx
'use client';

import { Play, Eye, BrainCircuit } from 'lucide-react';
import { Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StudyStartCardProps {
    totalCards: number;
    dueCount: number;
    newCount: number;
    isPeeking: boolean;
    onStart: () => void;
    onPeekToggle: () => void;
}

export function StudyStartCard({
    totalCards,
    dueCount,
    newCount,
    isPeeking,
    onStart,
    onPeekToggle,
}: StudyStartCardProps) {
    return (
        <div className="relative group overflow-hidden bg-surface border border-border-main/50 rounded-[3rem] p-8 lg:p-12 shadow-xl">
            {/* Subtle background glow */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors duration-700" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                {/* Icon with dynamic tilt */}
                <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-lg shadow-red-500/20 rotate-3 group-hover:rotate-0 transition-all duration-500">
                    <BrainCircuit className="text-white" size={32} />
                </div>

                <div className="space-y-2">
                    <Typography
                        variant="h2"
                        className="border-none mb-0 pb-0 text-2xl md:text-3xl font-black"
                    >
                        Start Session
                    </Typography>
                    <Typography
                        variant="p"
                        className="opacity-50 mt-0 max-w-md mx-auto leading-relaxed text-sm md:text-base"
                    >
                        {totalCards === 0
                            ? 'Select a book or lesson to begin your practice.'
                            : `We've prepared ${dueCount} reviews and ${newCount} new characters for this session.`}
                    </Typography>
                </div>

                {/* Button Group - Responsive sizing */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-4">
                    <button
                        onClick={onStart}
                        disabled={totalCards === 0}
                        className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale shadow-lg shadow-red-500/10"
                    >
                        <Play size={14} fill="currentColor" />
                        Start Learning
                    </button>

                    <button
                        onClick={onPeekToggle}
                        className={cn(
                            'px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 border shadow-sm',
                            isPeeking
                                ? 'bg-ink text-paper border-ink'
                                : 'bg-ink/5 text-ink border-transparent hover:bg-ink/10',
                        )}
                    >
                        <Eye size={14} />
                        {isPeeking ? 'Hide Deck' : 'Peek Deck'}
                    </button>
                </div>
            </div>
        </div>
    );
}
