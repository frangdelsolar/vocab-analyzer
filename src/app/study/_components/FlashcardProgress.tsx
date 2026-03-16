// @/app/study/_components/FlashcardProgress.tsx
'use client';

import { X, Clock } from 'lucide-react';

interface ProgressProps {
    current: number;
    total: number;
    onClose: () => void;
}

export function FlashcardProgress({ current, total, onClose }: ProgressProps) {
    const progressPercent = (current / total) * 100;

    return (
        <div className="flex items-center justify-between mb-6 px-2 w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <Clock size={14} className="opacity-20 text-red-500" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-20 block leading-none mb-1">
                            Remaining
                        </span>
                        <span className="text-xs font-bold tabular-nums leading-none">
                            {total - current} cards
                        </span>
                    </div>
                </div>
                <div className="h-6 w-px bg-ink/5" />
                <div className="h-1 w-24 bg-ink/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-ink transition-all duration-700 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            <button
                onClick={onClose}
                className="p-2 hover:bg-ink/5 rounded-full transition-all active:scale-90"
            >
                <X size={16} className="opacity-30" />
            </button>
        </div>
    );
}
