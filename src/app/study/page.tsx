// @/app/study/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Shell } from '@/components/layout/Shell';
import { PageHeader } from '@/components/layout/PageHeader';
import VocabExplorerControls from '../vocabulary/_components/VocabExplorerControls';
import { Typography } from '@/components/ui';
import { useVocabulary } from '@/context/VocabularyContext';
import { useFSRS } from '@/context/FSRSContext';
import { Play, Eye, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import our new sub-components
import { SessionDeckPreview } from './_components/SessionDeckPreview';
import { FlashcardPlayer } from './_components/FlashcardPlayer';

export type VisibilitySettings = {
    character: boolean;
    pinyin: boolean;
    meaning: boolean;
    simplified: boolean;
    showSimplified: boolean;
};

export default function StudyPage() {
    const { filteredList } = useVocabulary();
    const { getSessionQueue } = useFSRS();

    const [isPeeking, setIsPeeking] = useState(false);
    const [isStudyActive, setIsStudyActive] = useState(false);
    const [visibility, setVisibility] = useState<VisibilitySettings>({
        character: true,
        pinyin: true,
        meaning: true,
        simplified: true,
        showSimplified: false,
    });

    // Compute queues and helpers
    const queue = useMemo(
        () => getSessionQueue(filteredList),
        [filteredList, getSessionQueue],
    );
    const dueGuids = useMemo(
        () => new Set(queue.due.map((c) => c.guid)),
        [queue.due],
    );
    const sessionCards = useMemo(() => [...queue.due, ...queue.new], [queue]);

    const toggleVisibility = (key: keyof VisibilitySettings) => {
        setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // If session is active, render the Player instead of the Shell content
    if (isStudyActive) {
        return (
            <Shell>
                <FlashcardPlayer
                    queue={sessionCards}
                    settings={visibility}
                    onClose={() => setIsStudyActive(false)}
                />
            </Shell>
        );
    }

    return (
        <Shell>
            <PageHeader
                overline="Review Mode"
                title="Active Recall"
                description="Manage your progress and start your daily study session."
                rightElement={
                    <div className="bg-ink/5 border border-border-main/50 rounded-2xl p-4 flex flex-col items-end min-w-[120px]">
                        <Typography
                            variant="small"
                            className="opacity-40 font-black uppercase text-[10px] tracking-widest"
                        >
                            Ready to Study
                        </Typography>
                        <Typography
                            variant="h2"
                            className="text-red-500 font-black leading-none mt-1"
                        >
                            {sessionCards.length}
                        </Typography>
                    </div>
                }
            />

            <div className="space-y-8 mt-8 pb-20">
                <VocabExplorerControls
                    visibility={visibility}
                    onToggleVisibility={toggleVisibility}
                />

                {/* --- SESSION START CARD --- */}
                <div className="relative group overflow-hidden bg-surface dark:bg-surface-dark border border-border-main/50 rounded-[3rem] p-8 lg:p-12 shadow-xl ring-1 ring-black/5">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors duration-700" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        <div className="w-20 h-20 bg-red-500 rounded-[2.5rem] flex items-center justify-center shadow-lg shadow-red-500/20 rotate-3 group-hover:rotate-0 transition-all duration-500">
                            <BrainCircuit className="text-white" size={40} />
                        </div>

                        <div className="space-y-2">
                            <Typography
                                variant="h2"
                                className="border-none mb-0 pb-0"
                            >
                                Start Session
                            </Typography>
                            <Typography
                                variant="p"
                                className="opacity-50 mt-0 max-w-md mx-auto leading-relaxed"
                            >
                                {sessionCards.length === 0
                                    ? 'Select a book or lesson to begin your practice.'
                                    : `We've prepared ${queue.due.length} reviews and ${queue.new.length} new characters for this session.`}
                            </Typography>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                            <button
                                onClick={() => setIsStudyActive(true)}
                                disabled={sessionCards.length === 0}
                                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
                            >
                                <Play size={16} fill="currentColor" />
                                Start Learning
                            </button>

                            <button
                                onClick={() => setIsPeeking(!isPeeking)}
                                className={cn(
                                    'px-6 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 border shadow-sm',
                                    isPeeking
                                        ? 'bg-ink text-paper border-ink'
                                        : 'bg-ink/5 text-ink border-transparent hover:bg-ink/10',
                                )}
                            >
                                <Eye size={16} />
                                {isPeeking ? 'Hide Deck' : 'Peek Deck'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- PEEK SECTION --- */}
                {isPeeking && sessionCards.length > 0 && (
                    <SessionDeckPreview
                        cards={sessionCards}
                        dueGuids={dueGuids}
                    />
                )}
            </div>
        </Shell>
    );
}
