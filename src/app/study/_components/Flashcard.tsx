'use client';

import { useState } from 'react';
import { Typography } from '@/components/ui';
import {
    ChevronLeft,
    ChevronRight,
    Shuffle,
    RotateCcw,
    Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Flashcard = ({
    card,
    isFlipped,
    onFlip,
}: {
    card: any;
    isFlipped: boolean;
    onFlip: () => void;
}) => {
    // Dynamic scaling for traditional characters/sentences
    const text = card.traditional || '';
    const hanziSize =
        text.length > 15
            ? 'text-3xl'
            : text.length > 8
              ? 'text-5xl'
              : 'text-8xl';

    return (
        <div
            className="group h-[450px] w-full max-w-2xl perspective-2000 cursor-pointer mx-auto"
            onClick={onFlip}
        >
            <div
                className={cn(
                    'relative h-full w-full transition-all duration-700 preserve-3d shadow-2xl rounded-[3rem] border border-border-main',
                    isFlipped ? 'rotate-y-180' : 'hover:scale-[1.01]',
                )}
            >
                {/* FRONT */}
                <div className="absolute inset-0 backface-hidden bg-surface flex flex-col items-center justify-center p-12 rounded-[3rem]">
                    <Typography
                        variant="small"
                        className="absolute top-10 opacity-20 font-black uppercase tracking-[0.4em] text-[9px]"
                    >
                        Traditional
                    </Typography>

                    <div className="w-full text-center overflow-y-auto max-h-[300px] py-4 scrollbar-hide">
                        <Typography
                            variant="hanzi"
                            className={cn(
                                'text-ink transition-all duration-500 leading-relaxed',
                                hanziSize,
                            )}
                        >
                            {text}
                        </Typography>
                    </div>

                    <div className="absolute bottom-10 flex items-center gap-2 opacity-30">
                        <Eye size={14} />
                        <Typography
                            variant="small"
                            className="font-black uppercase tracking-widest text-[9px]"
                        >
                            Click to reveal
                        </Typography>
                    </div>
                </div>

                {/* BACK */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-surface flex flex-col items-center justify-center p-12 rounded-[3rem] border-2 border-red-500/10">
                    <div className="w-full overflow-y-auto space-y-6 text-center max-h-full scrollbar-hide">
                        <Typography
                            variant="pinyin"
                            className="text-2xl text-red-600 italic leading-snug"
                        >
                            {card.pinyin}
                        </Typography>
                        <div className="h-px w-12 bg-border-main mx-auto" />
                        <Typography
                            variant="p"
                            className="text-xl md:text-2xl font-bold leading-tight text-ink"
                        >
                            {card.meaning}
                        </Typography>
                    </div>
                    <div className="absolute bottom-10 px-4 py-1.5 bg-ink/5 rounded-full">
                        <Typography
                            variant="small"
                            className="text-[10px] font-black opacity-40 uppercase"
                        >
                            B{card.location.book} • L{card.location.lesson}
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;
export { Flashcard };
