'use client';

import { Typography } from '@/components/ui';
import { BookCard } from './BookCard';
import { useVocabulary } from '@/context/VocabularyContext';
import { useMemo } from 'react';

export const CourseLibrary = () => {
    const { dialogueManifest, cards, isLoading } = useVocabulary();

    const libraryData = useMemo(() => {
        // 1. Map out exactly what dialogues we have available
        // Structure: { "1": { "01": Set([1, 2]) } }
        const availableMap: Record<string, Record<string, Set<number>>> = {};

        dialogueManifest.forEach((filename) => {
            const b = parseInt(filename.substring(0, 2)).toString();
            const l = filename.substring(2, 4); // Keep as string "01"
            const s = parseInt(filename.substring(4, 6)); // Section as number

            if (!availableMap[b]) availableMap[b] = {};
            if (!availableMap[b][l]) availableMap[b][l] = new Set();
            availableMap[b][l].add(s);
        });

        // 2. Reduce the data for the UI
        return Object.entries(availableMap).reduce(
            (acc, [bookId, lessons]) => {
                const lessonIds = Object.keys(lessons);

                // Calculate total parts (sections) for this book
                const totalParts = lessonIds.reduce(
                    (sum, l) => sum + lessons[l].size,
                    0,
                );

                // Calculate words only for the parts we actually have files for
                const wordCount = cards.filter((card) => {
                    const loc = card.location;
                    const bookMatch = loc.book.toString() === bookId;
                    // Pad lesson to match "01" style if necessary, or compare as numbers
                    const lessonKey = loc.lesson.toString().padStart(2, '0');
                    const hasLesson = lessons[lessonKey];
                    const hasSection = hasLesson?.has(loc.section);

                    return bookMatch && hasSection;
                }).length;

                acc[bookId] = {
                    lessonCount: lessonIds.length,
                    partCount: totalParts,
                    wordCount,
                };
                return acc;
            },
            {} as Record<
                string,
                { lessonCount: number; partCount: number; wordCount: number }
            >,
        );
    }, [dialogueManifest, cards]);

    if (isLoading)
        return (
            <div className="h-48 flex items-center justify-center opacity-50">
                Loading...
            </div>
        );

    const bookIds = Object.keys(libraryData).sort(
        (a, b) => Number(a) - Number(b),
    );

    return (
        <div className="w-full mb-12">
            <div className="flex items-center justify-between mb-6">
                <Typography variant="h2" className="border-none pb-0">
                    Course Library
                </Typography>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {bookIds.map((id) => (
                    <BookCard
                        key={id}
                        bookId={id}
                        lessonCount={libraryData[id].lessonCount}
                        partCount={libraryData[id].partCount}
                        wordCount={libraryData[id].wordCount}
                    />
                ))}
            </div>
        </div>
    );
};
