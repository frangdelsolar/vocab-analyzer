// @/components/LibraryStats.tsx
'use client';

import { useMemo } from 'react';
import { Typography, Card, CardContent } from '@/components/ui';
import { BookCheck } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext'; // Use ProgressContext
import { useVocabulary } from '@/context/VocabularyContext';

export function LibraryStats() {
    // Consume progress and loading state from ProgressContext
    const { progress, isLoading: progressLoading } = useProgress();
    const { metadata, isLoading: vocabLoading } = useVocabulary();

    const stats = useMemo(() => {
        if (progressLoading || vocabLoading || !metadata) {
            return { currentTotal: 0, totalLessons: 0, percentage: 0 };
        }

        let totalLessons = 0;
        let currentTotal = 0;

        // Sort books numerically to ensure correct iteration
        const bookIds = Object.keys(metadata.books)
            .map(Number)
            .sort((a, b) => a - b);

        bookIds.forEach((bookId) => {
            const lessonsInBook = Object.keys(
                metadata.books[bookId].lessons,
            ).length;
            totalLessons += lessonsInBook;

            if (bookId < progress.book) {
                // User has finished all lessons in previous books
                currentTotal += lessonsInBook;
            } else if (bookId === progress.book) {
                // User is currently in this book, add completed lessons
                // Note: progress.lesson represents the current lesson they are on
                currentTotal += progress.lesson;
            }
        });

        const percentage =
            totalLessons > 0
                ? Math.min(Math.round((currentTotal / totalLessons) * 100), 100)
                : 0;

        return {
            currentTotal,
            totalLessons,
            percentage,
        };
    }, [progress, progressLoading, metadata, vocabLoading]);

    // Skeleton loader to prevent layout shift
    if (progressLoading || vocabLoading || !metadata) {
        return (
            <div className="w-48 h-16 bg-ink/5 dark:bg-white/5 animate-pulse rounded-2xl" />
        );
    }

    return (
        <Card className="bg-ink/5 dark:bg-white/5 border-none shadow-none">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg">
                    <BookCheck size={20} />
                </div>
                <div>
                    <Typography
                        variant="small"
                        className="font-black block leading-none text-sm tracking-tighter"
                    >
                        {stats.currentTotal} / {stats.totalLessons} Lessons
                    </Typography>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-20 h-1.5 bg-ink/10 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-1000 ease-out"
                                style={{ width: `${stats.percentage}%` }}
                            />
                        </div>
                        <span className="text-[9px] uppercase font-black tracking-widest opacity-50">
                            {stats.percentage}%
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
