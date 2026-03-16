// @/app/study/_components/StudyStartCard.tsx
'use client';

import {
    Play,
    Eye,
    BrainCircuit,
    CheckCircle2,
    Clock,
    Sparkles,
    Trophy,
} from 'lucide-react';
import { Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StudyStartCardProps {
    totalInDeck: number;
    dueCount: number;
    newCount: number;
    isPeeking: boolean;
    onStart: () => void;
    onPeekToggle: () => void;
}

export function StudyStartCard({
    totalInDeck,
    dueCount,
    newCount,
    isPeeking,
    onStart,
    onPeekToggle,
}: StudyStartCardProps) {
    // Logic for bucket counts
    const doneCount = totalInDeck - (dueCount + newCount);
    const sessionTotal = dueCount + newCount;
    const isFinished = totalInDeck > 0 && sessionTotal === 0;
    const isEmpty = totalInDeck === 0;

    return (
        <div className="relative group overflow-hidden bg-surface border border-border-main/50 rounded-[3rem] p-8 lg:p-12 shadow-xl">
            {/* Ambient Background Blur */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors duration-700" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                {/* State-based Icon */}
                <div
                    className={cn(
                        'w-16 h-16 md:w-20 md:h-20 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-lg transition-all duration-500 rotate-3 group-hover:rotate-0',
                        isFinished
                            ? 'bg-green-600 shadow-green-500/20'
                            : 'bg-red-500 shadow-red-500/20',
                    )}
                >
                    {isFinished ? (
                        <CheckCircle2 className="text-white" size={32} />
                    ) : (
                        <BrainCircuit className="text-white" size={32} />
                    )}
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <Typography
                            variant="h2"
                            className="border-none mb-0 pb-0 text-3xl md:text-4xl font-black tracking-tight"
                        >
                            {isFinished ? 'Daily Goal Met' : 'Start Session'}
                        </Typography>
                        <Typography
                            variant="p"
                            className="opacity-40 max-w-md mx-auto text-sm md:text-base font-medium"
                        >
                            {isEmpty
                                ? 'Select a lesson to begin your practice.'
                                : `This selection contains ${totalInDeck} characters.`}
                        </Typography>
                    </div>

                    {/* Deck Health Breakdown */}
                    {!isEmpty && (
                        <div className="flex items-center justify-center gap-6 pt-2">
                            <StatItem
                                label="Due"
                                count={dueCount}
                                color="text-blue-500"
                                icon={Clock}
                            />
                            <StatItem
                                label="New"
                                count={newCount}
                                color="text-green-600"
                                icon={Sparkles}
                            />
                            <StatItem
                                label="Done"
                                count={doneCount}
                                color="text-ink/30"
                                icon={Trophy}
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                    <button
                        onClick={onStart}
                        disabled={sessionTotal === 0}
                        className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale shadow-lg shadow-red-500/10"
                    >
                        <Play size={14} fill="currentColor" />
                        {isFinished ? 'Caught Up' : 'Start Learning'}
                    </button>

                    <button
                        onClick={onPeekToggle}
                        disabled={isEmpty}
                        className={cn(
                            'px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 border shadow-sm',
                            isPeeking
                                ? 'bg-ink text-paper border-ink'
                                : 'bg-ink/5 text-ink border-transparent hover:bg-ink/10',
                            isEmpty && 'opacity-20 pointer-events-none',
                        )}
                    >
                        <Eye size={14} />
                        {isPeeking ? 'Hide' : 'Peek'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Internal Helper for the Health Stats
function StatItem({
    label,
    count,
    color,
    icon: Icon,
}: {
    label: string;
    count: number;
    color: string;
    icon: any;
}) {
    return (
        <div className="flex flex-col items-center">
            <div
                className={cn(
                    'flex items-center gap-1.5 font-black text-lg',
                    color,
                )}
            >
                <Icon size={14} />
                <span>{count}</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest opacity-30">
                {label}
            </span>
        </div>
    );
}
