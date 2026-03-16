// @/app/study/_components/FlashcardPlayer.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnkiCard } from '@/context/VocabularyContext';
import { useFSRS } from '@/context/FSRSContext';
import { Rating } from 'ts-fsrs';

import { FlashcardProgress } from './FlashcardProgress';
import { FlashcardCard } from './FlashcardCard';
import { FlashcardControls } from './FlashcardControls';

interface PlayerProps {
    queue: AnkiCard[];
    onClose: () => void;
    settings: { showSimplified: boolean };
}

export function FlashcardPlayer({ queue, onClose, settings }: PlayerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const { gradeCard } = useFSRS();

    const currentCard = queue[currentIndex];

    const handleGrade = useCallback(
        (rating: Rating) => {
            if (isTransitioning || !isFlipped) return;

            // 1. Lock UI and submit grade immediately
            setIsTransitioning(true);

            // 2. Short delay for the "slide out" animation
            setTimeout(() => {
                gradeCard(currentCard.guid, rating);
                if (currentIndex >= queue.length - 1) {
                    onClose();
                } else {
                    setIsFlipped(false);
                    setIsTransitioning(false);
                }
            }, 200);
        },
        [
            currentCard,
            currentIndex,
            isFlipped,
            isTransitioning,
            gradeCard,
            queue.length,
            onClose,
        ],
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isTransitioning) return;
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
                if (keys[e.key]) {
                    e.preventDefault();
                    handleGrade(keys[e.key]);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFlipped, isTransitioning, handleGrade]);

    if (!currentCard) return null;

    return (
        /* 1. Use h-full to fill the parent container (dialog or main)
           2. min-h-0 is a flexbox hack to allow children to shrink properly
        */
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto select-none overflow-hidden min-h-0">
            {/* Header: Static Height */}
            <div className="flex-none pt-4">
                <FlashcardProgress
                    current={currentIndex + 1}
                    total={queue.length}
                    onClose={onClose}
                />
            </div>

            {/* Card: Dynamic Height (Takes all available space) */}
            <div className="flex-1 min-h-0 w-full flex items-center justify-center py-4">
                <FlashcardCard
                    key={currentIndex}
                    card={currentCard}
                    isFlipped={isFlipped}
                    isTransitioning={isTransitioning}
                    showSimplified={settings.showSimplified}
                    onFlip={() => setIsFlipped(true)}
                />
            </div>

            {/* Controls: Static Height */}
            <div className="flex-none pb-8">
                <FlashcardControls
                    isFlipped={isFlipped}
                    isTransitioning={isTransitioning}
                    onFlip={() => setIsFlipped(true)}
                    onGrade={handleGrade}
                />
            </div>
        </div>
    );
}
