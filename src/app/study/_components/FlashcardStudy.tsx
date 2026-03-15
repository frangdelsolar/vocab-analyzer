'use client';

import { useState } from 'react';
import { Typography } from '@/components/ui';
import { Shuffle, RotateCcw } from 'lucide-react';
import { useFSRS } from '@/context/FSRSContext';
import { Flashcard } from './Flashcard'; // Assuming Flashcard is in its own file
import { RatingSystem } from './RatingSystem';
import { StudyContainer, ControlGroup } from './StudyLayout';

export default function FlashcardStudy({ vocabList }: { vocabList: any[] }) {
    const { gradeCard } = useFSRS();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cards, setCards] = useState([...vocabList]);

    const currentCard = cards[currentIndex];

    const handleShuffle = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCards([...cards].sort(() => Math.random() - 0.5));
            setCurrentIndex(0);
        }, 150);
    };

    const handleGrade = (grade: number) => {
        // 1. Store progress via FSRS Context
        gradeCard(currentCard.guid, grade as 1 | 2 | 3 | 4);

        // 2. Move to next card
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
        } else {
            // End of session logic could go here
            alert('Session Complete!');
        }
    };

    if (!currentCard) return null;

    return (
        <StudyContainer>
            <ControlGroup>
                <button
                    onClick={handleShuffle}
                    className="px-4 py-2 hover:bg-ink/5 rounded-full text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center gap-2 transition-all"
                >
                    <Shuffle size={14} /> Shuffle
                </button>
                <button
                    onClick={() => {
                        setIsFlipped(false);
                        setCurrentIndex(0);
                    }}
                    className="px-4 py-2 hover:bg-ink/5 rounded-full text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center gap-2 transition-all"
                >
                    <RotateCcw size={14} /> Restart
                </button>
            </ControlGroup>

            <Flashcard
                card={currentCard}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
            />

            {/* If flipped, show ratings. If not, show reveal hint. */}
            <div className="w-full flex flex-col items-center gap-8 min-h-[120px]">
                {isFlipped ? (
                    <RatingSystem onGrade={handleGrade} />
                ) : (
                    <button
                        onClick={() => setIsFlipped(true)}
                        className="px-12 py-4 bg-ink text-paper rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all shadow-xl"
                    >
                        Reveal Answer
                    </button>
                )}

                {/* Progress Bar */}
                <div className="w-full max-w-md space-y-2">
                    <div className="flex justify-between px-1">
                        <Typography
                            variant="small"
                            className="text-[10px] font-black uppercase opacity-20 tracking-widest"
                        >
                            Session Progress
                        </Typography>
                        <Typography
                            variant="small"
                            className="font-mono text-[10px] opacity-40"
                        >
                            {currentIndex + 1} / {cards.length}
                        </Typography>
                    </div>
                    <div className="h-1 w-full bg-ink/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-red-500 transition-all duration-500 ease-out"
                            style={{
                                width: `${((currentIndex + 1) / cards.length) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </StudyContainer>
    );
}
