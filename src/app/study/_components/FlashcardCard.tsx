// @/app/study/_components/FlashcardCard.tsx
'use client';

import { AnkiCard } from '@/context/VocabularyContext';
import { Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

interface CardProps {
    card: AnkiCard;
    isFlipped: boolean;
    isTransitioning: boolean;
    showSimplified: boolean;
    onFlip: () => void;
}

export function FlashcardCard({
    card,
    isFlipped,
    isTransitioning,
    showSimplified,
    onFlip,
}: CardProps) {
    return (
        <div className="flex-1 flex items-center justify-center p-4 w-full h-full min-h-0">
            <div
                className={cn(
                    // Switched from fixed max-h to a responsive min/max range
                    'w-full min-h-[350px] h-fit max-h-[60vh] max-w-4xl transition-all duration-300 rounded-[2rem] flex flex-col items-center justify-center relative shadow-2xl overflow-hidden cursor-pointer',
                    'bg-surface border border-white/5',
                    isTransitioning && 'opacity-0 scale-95 translate-y-2',
                )}
                onClick={() => !isFlipped && !isTransitioning && onFlip()}
            >
                {/* Internal container with scroll support for long content */}
                <div className="w-full h-full overflow-y-auto flex flex-col items-center justify-center p-6 md:p-10 scrollbar-hide">
                    {!isFlipped ? (
                        <Typography
                            variant="hanzi"
                            className="text-8xl md:text-9xl tracking-tighter text-ink selection:bg-transparent animate-in fade-in zoom-in-95 duration-300"
                        >
                            {card.traditional}
                        </Typography>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full animate-in fade-in duration-500">
                            {/* Dimmed Traditional Reference - Shrinking it to save vertical space */}
                            <Typography
                                variant="hanzi"
                                className="text-2xl md:text-3xl opacity-10 mb-6 select-none"
                            >
                                {card.traditional}
                            </Typography>

                            {/* Pinyin */}
                            <Typography
                                variant="pinyin"
                                className="text-3xl md:text-4xl text-red-500 font-bold italic mb-4 tracking-tight"
                            >
                                {card.pinyin}
                            </Typography>

                            {/* Meaning - Using clamp to ensure it doesn't explode on 100% zoom */}
                            <Typography
                                variant="h2"
                                className="text-2xl md:text-4xl lg:text-5xl font-bold text-ink text-center max-w-2xl leading-tight border-none p-0"
                            >
                                {card.meaning}
                            </Typography>

                            {/* Optional Simplified Variant */}
                            {showSimplified &&
                                card.traditional !== card.simplified && (
                                    <div className="mt-8 pt-6 border-t border-white/5 w-1/4 flex flex-col items-center gap-1 opacity-20">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                                            Simplified
                                        </span>
                                        <Typography
                                            variant="simplified"
                                            className="text-xl md:text-2xl"
                                        >
                                            {card.simplified}
                                        </Typography>
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
