'use client';

import { useState, useMemo } from 'react';
import { Shell } from '@/components/layout/Shell';
import { PageHeader } from '@/components/layout/PageHeader';
import { useVocabulary } from '@/context/VocabularyContext';
import HanziWriter from '@/app/writer/_components/HanziWriter';
import { Button, Typography } from '@/components/ui';
import {
    ChevronLeft,
    ChevronRight,
    BookOpen,
    CheckCircle2,
} from 'lucide-react';

export default function WritingPage() {
    const { filteredList, isLoading } = useVocabulary();
    const [currentIndex, setCurrentIndex] = useState(0);

    const characters = useMemo(() => {
        return filteredList.map((item) => item.traditional);
    }, [filteredList]);

    const currentChar = characters[currentIndex];
    const progress = ((currentIndex + 1) / characters.length) * 100;

    const handleNext = () => {
        if (currentIndex < characters.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    if (isLoading)
        return (
            <Shell>
                <div className="p-20 text-center opacity-20">Loading...</div>
            </Shell>
        );
    if (characters.length === 0)
        return (
            <Shell>
                <div className="p-20 text-center">No characters found.</div>
            </Shell>
        );

    return (
        <Shell>
            <PageHeader
                overline="Practice Mode"
                title="Stroke Mastery"
                description={`Currently practicing character ${currentIndex + 1} of ${characters.length}`}
            />

            <div className="max-w-xl mx-auto w-full mt-10 pb-20 space-y-12">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="h-1 w-full bg-ink/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-cyan-500 transition-all duration-700 ease-in-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Orchestrator with key to reset state on character change */}
                <HanziWriter key={currentChar} />

                {/* Navigation */}
                <div className="flex items-center justify-between pt-8 border-t border-ink/5">
                    <Button
                        variant="ghost"
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex((prev) => prev - 1)}
                        className="rounded-2xl gap-2"
                    >
                        <ChevronLeft size={18} />
                        <span className="font-bold">Prev</span>
                    </Button>

                    <div className="flex flex-col items-center">
                        <Typography
                            variant="small"
                            className="font-black italic text-cyan-500"
                        >
                            {currentIndex + 1} / {characters.length}
                        </Typography>
                    </div>

                    <Button
                        variant="primary"
                        disabled={currentIndex === characters.length - 1}
                        onClick={handleNext}
                        className="rounded-2xl gap-2 px-8"
                    >
                        <span className="font-bold">Next</span>
                        <ChevronRight size={18} />
                    </Button>
                </div>
            </div>
        </Shell>
    );
}
