// @/app/study/_components/FlashcardControls.tsx
'use client';

import { Rating } from 'ts-fsrs';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui';

interface ControlsProps {
    isFlipped: boolean;
    isTransitioning: boolean;
    onFlip: () => void;
    onGrade: (rating: Rating) => void;
}

export function FlashcardControls({
    isFlipped,
    isTransitioning,
    onFlip,
    onGrade,
}: ControlsProps) {
    return (
        <div className="h-28 mt-auto flex items-center justify-center w-full max-w-2xl mx-auto px-4">
            {!isFlipped ? (
                <button
                    disabled={isTransitioning}
                    onClick={onFlip}
                    className="w-full max-w-sm h-14 bg-ink text-paper rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-0"
                >
                    Reveal Answer
                </button>
            ) : (
                <div className="grid grid-cols-4 gap-2 w-full animate-in slide-in-from-bottom-4 duration-500 ease-out">
                    <GradeButton
                        label="Again"
                        desc="Forgot"
                        color="bg-red-500"
                        shortcut="1"
                        onClick={() => onGrade(Rating.Again)}
                        disabled={isTransitioning}
                    />
                    <GradeButton
                        label="Hard"
                        desc="Rough"
                        color="bg-orange-500"
                        shortcut="2"
                        onClick={() => onGrade(Rating.Hard)}
                        disabled={isTransitioning}
                    />
                    <GradeButton
                        label="Good"
                        desc="Got it"
                        color="bg-green-600"
                        shortcut="3"
                        onClick={() => onGrade(Rating.Good)}
                        disabled={isTransitioning}
                    />
                    <GradeButton
                        label="Easy"
                        desc="Simple"
                        color="bg-blue-500"
                        shortcut="4"
                        onClick={() => onGrade(Rating.Easy)}
                        disabled={isTransitioning}
                    />
                </div>
            )}
        </div>
    );
}

function GradeButton({
    label,
    desc,
    color,
    shortcut,
    onClick,
    disabled,
}: {
    label: string;
    desc: string;
    color: string;
    shortcut: string;
    onClick: () => void;
    disabled: boolean;
}) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={cn(
                'group relative flex flex-col items-center justify-center p-3 h-20 rounded-2xl text-white transition-all shadow-xl overflow-hidden',
                color,
                disabled
                    ? 'opacity-0 translate-y-4'
                    : 'hover:brightness-110 hover:-translate-y-1 hover:border-b-4 hover:border-black/20 active:translate-y-0 active:border-b-0',
            )}
        >
            <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 select-none">
                {label}
            </span>
            <span className="text-[8px] font-bold opacity-60 uppercase tracking-tight select-none">
                {desc}
            </span>

            {/* Minimalist Shortcut Key */}
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-black tabular-nums">
                    {shortcut}
                </span>
            </div>
        </button>
    );
}
