// @/components/UserStatusCard.tsx
'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useVocabulary } from '@/context/VocabularyContext';
import { useUser } from '@/context/UserContext';
import { useProgress } from '@/context/ProgressContext';
import { useFSRS } from '@/context/FSRSContext';
import { Card, CardContent, Button } from '@/components/ui';
import { PlayCircle } from 'lucide-react';

import { IdentitySettings } from './IdentitySettings';
import { ProgressSelectors } from './status/ProgressSelectors';
import { MasteryStats } from './status/MasteryStats';
import { StudyHealthStats } from './status/StudyHealthStats';

export const UserStatusCard = () => {
    const router = useRouter();
    const {
        metadata,
        getFilteredCards,
        filteredList,
        isLoading: vocabLoading,
    } = useVocabulary();
    const { userId, setUserId, isHydrated: userHydrated } = useUser();
    const {
        progress,
        updateProgress,
        isLoading: progressLoading,
    } = useProgress();
    const { getSessionQueue } = useFSRS();

    // 1. Mastery Calculation
    const masteredCount = useMemo(() => {
        if (!metadata) return 0;
        return getFilteredCards({
            book: progress.book,
            lesson: progress.lesson,
            section: progress.section,
            mode: 'cumulative',
        }).length;
    }, [progress, getFilteredCards, metadata]);

    // 2. SRS Health Calculation
    const srsStats = useMemo(() => {
        const queue = getSessionQueue(filteredList);
        return {
            due: queue.due.length,
            new: queue.new.length,
            total: filteredList.length,
        };
    }, [filteredList, getSessionQueue]);

    if (vocabLoading || progressLoading || !userHydrated || !metadata)
        return null;

    return (
        <Card className="mb-8 border-none bg-surface ring-1 ring-border-main/50 shadow-none overflow-hidden">
            <CardContent className="p-0">
                {/* Top Row: Mastery & Study Health */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-b border-border-main/50">
                    <MasteryStats
                        count={masteredCount}
                        book={progress.book}
                        lesson={progress.lesson}
                    />

                    <StudyHealthStats
                        due={srsStats.due}
                        newCards={srsStats.new}
                        total={srsStats.total}
                    />

                    <div className="p-6 flex items-center justify-center bg-ink/[0.02]">
                        <Button
                            onClick={() => router.push(`/study`)}
                            className="w-full max-w-[240px] bg-red-500 hover:bg-red-600 text-white h-14 rounded-2xl flex items-center gap-3 shadow-lg shadow-red-500/20"
                        >
                            <PlayCircle size={22} />
                            <div className="flex flex-col items-start">
                                <span className="font-black uppercase text-[10px] tracking-widest leading-none">
                                    Flashcards
                                </span>
                                <span className="font-bold text-lg leading-none">
                                    Start Session
                                </span>
                            </div>
                        </Button>
                    </div>
                </div>

                {/* Bottom Row: Selectors & Identity */}
                <div className="p-6 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <ProgressSelectors
                        progress={progress}
                        metadata={metadata}
                        onUpdate={updateProgress}
                    />
                    <IdentitySettings userId={userId} onIdChange={setUserId} />
                </div>
            </CardContent>
        </Card>
    );
};
