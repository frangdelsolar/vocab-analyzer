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

export default function FlashcardStudy({ vocabList }: { vocabList: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cards, setCards] = useState([...vocabList]);

    const handleShuffle = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCards([...cards].sort(() => Math.random() - 0.5));
            setCurrentIndex(0);
        }, 150);
    };

    const navigate = (dir: number) => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex((prev) => prev + dir), 150);
    };

    return (
        <div className="flex flex-col items-center gap-12 w-full max-w-4xl mx-auto">
            <div className="flex gap-4">
                <button
                    onClick={handleShuffle}
                    className="px-5 py-2 hover:bg-ink/5 rounded-full transition-all text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center gap-2"
                >
                    <Shuffle size={14} /> Shuffle
                </button>
                <button
                    onClick={() => {
                        setIsFlipped(false);
                        setCurrentIndex(0);
                    }}
                    className="px-5 py-2 hover:bg-ink/5 rounded-full transition-all text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center gap-2"
                >
                    <RotateCcw size={14} /> Restart
                </button>
            </div>

            <Flashcard
                card={cards[currentIndex]}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
            />

            <div className="w-full max-w-md space-y-8">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        disabled={currentIndex === 0}
                        className="p-6 rounded-[2rem] border border-border-main bg-surface disabled:opacity-5 hover:border-red-500 transition-all shadow-md"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="text-center">
                        <Typography
                            variant="h4"
                            className="font-mono tabular-nums leading-none mb-1"
                        >
                            {currentIndex + 1}{' '}
                            <span className="opacity-20 mx-1">/</span>{' '}
                            {cards.length}
                        </Typography>
                        <Typography
                            variant="small"
                            className="text-[9px] font-black uppercase tracking-widest opacity-30"
                        >
                            Progress
                        </Typography>
                    </div>
                    <button
                        onClick={() => navigate(1)}
                        disabled={currentIndex === cards.length - 1}
                        className="p-6 rounded-[2rem] border border-border-main bg-surface disabled:opacity-5 hover:border-red-500 transition-all shadow-md"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
                <div className="h-1.5 w-full bg-ink/5 rounded-full overflow-hidden shadow-inner">
                    <div
                        className="h-full bg-red-500 transition-all duration-700"
                        style={{
                            width: `${((currentIndex + 1) / cards.length) * 100}%`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
