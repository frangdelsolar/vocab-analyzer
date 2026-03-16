// @/app/study/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Shell } from '@/components/layout/Shell';
import { PageHeader } from '@/components/layout/PageHeader';
import VocabExplorerControls from '../vocabulary/_components/VocabExplorerControls';
import { Typography } from '@/components/ui';
import { useVocabulary } from '@/context/VocabularyContext';
import { useFSRS } from '@/context/FSRSContext';

import { FlashcardPlayer } from './_components/FlashcardPlayer';
import { SessionDeckPreview } from './_components/SessionDeckPreview';
import { StudyStartCard } from './_components/StudyStartCard';

export default function StudyPage() {
    const { filteredList } = useVocabulary();
    const { getSessionQueue } = useFSRS();

    const [isPeeking, setIsPeeking] = useState(false);
    const [isStudyActive, setIsStudyActive] = useState(false);
    const [visibility, setVisibility] = useState({
        character: true,
        pinyin: true,
        meaning: true,
        simplified: true,
        showSimplified: false,
    });

    const queue = useMemo(
        () => getSessionQueue(filteredList),
        [filteredList, getSessionQueue],
    );
    const dueGuids = useMemo(
        () => new Set(queue.due.map((c) => c.guid)),
        [queue.due],
    );
    const sessionCards = useMemo(() => [...queue.due, ...queue.new], [queue]);

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

            <div className="space-y-8 mt-8 pb-20 max-w-5xl mx-auto w-full">
                <VocabExplorerControls
                    visibility={visibility}
                    onToggleVisibility={(key) =>
                        setVisibility((v) => ({ ...v, [key]: !v[key] }))
                    }
                />

                <StudyStartCard
                    totalCards={sessionCards.length}
                    dueCount={queue.due.length}
                    newCount={queue.new.length}
                    isPeeking={isPeeking}
                    onStart={() => setIsStudyActive(true)}
                    onPeekToggle={() => setIsPeeking(!isPeeking)}
                />

                {isPeeking && filteredList.length > 0 && (
                    <SessionDeckPreview
                        allFilteredCards={filteredList} // The raw list before session logic
                        sessionCards={sessionCards} // The actual queue (reviews + new)
                        dueGuids={dueGuids}
                    />
                )}
            </div>
        </Shell>
    );
}
