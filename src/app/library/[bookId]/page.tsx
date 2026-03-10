'use client';

import { use, useMemo } from 'react';
import { useVocabulary } from '@/context/VocabularyContext';
import { Shell } from '@/components/layout/Shell';
import { Typography, Card } from '@/components/ui';
import { BookOpen, ChevronLeft, Loader2, Info } from 'lucide-react';
import { LessonAccordion } from './_components/LessonAccordion';
import { BookStats } from './_components/BookStats';
import { PageHeader } from '@/components/layout/PageHeader';
import Link from 'next/link';

export default function BookExplorer({
    params,
}: {
    params: Promise<{ bookId: string }>;
}) {
    const { bookId } = use(params);
    const { dialogueManifest, cards, isLoading } = useVocabulary();

    const bookNumber = bookId.replace('book-', '');

    // 1. Calculate available content for this specific book
    // 1. Calculate available content for this specific book
    const bookContent = useMemo(() => {
        if (isLoading) return null;

        const bookPrefix = bookNumber.padStart(2, '0');
        const availableFiles = dialogueManifest.filter((f) =>
            f.startsWith(bookPrefix),
        );

        // This Set now contains exactly which lessons exist (e.g., [1, 2, 3, 4, 5])
        const availableLessonNums = new Set(
            availableFiles.map((f) => parseInt(f.substring(2, 4))),
        );

        const wordCount = cards.filter((card) => {
            const loc = card.location;
            const bookMatch = loc.book.toString() === bookNumber;
            const lessonKey = loc.lesson.toString().padStart(2, '0');
            const sectionKey = loc.section.toString().padStart(2, '0');
            const fileName = `${bookPrefix}${lessonKey}${sectionKey}.json`;
            return bookMatch && dialogueManifest.includes(fileName);
        }).length;

        return {
            availableLessonNums: Array.from(availableLessonNums).sort(
                (a, b) => a - b,
            ), // Convert to sorted array
            totalFiles: availableFiles.length,
            wordCount,
        };
    }, [dialogueManifest, cards, bookNumber, isLoading]);

    if (isLoading) {
        return (
            <Shell>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="animate-spin text-red-500" size={40} />
                    <Typography variant="p" className="opacity-50 font-medium">
                        Syncing Library Manifest...
                    </Typography>
                </div>
            </Shell>
        );
    }

    // We still show 15 lessons as placeholders, but the Accordion
    const lessons = bookContent?.availableLessonNums || [];

    return (
        <Shell>
            <PageHeader
                overline="Course Explorer"
                title={`Contemporary Chinese Vol. ${bookNumber}`}
                description={`Master ${bookContent?.wordCount || 0} vocabulary terms across ${bookContent?.totalFiles || 0} active dialogues.`}
                badges={
                    <span className="px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-tighter shadow-sm">
                        Book {bookNumber}
                    </span>
                }
                rightElement={
                    <Link href="/library">
                        <button className="flex items-center gap-2 px-4 py-2 border border-border-main rounded-xl text-xs font-bold uppercase tracking-tighter hover:bg-ink/5 transition-all">
                            <ChevronLeft size={14} />
                            Back to Library
                        </button>
                    </Link>
                }
            />

            <div className="flex flex-col lg:flex-row gap-8 min-h-[60vh]">
                {/* Left Sidebar: Filtered Lesson Index */}
                <div className="w-full lg:w-80 shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <Typography
                            variant="small"
                            className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 block"
                        >
                            Lesson Index
                        </Typography>
                        <div className="flex items-center gap-1 opacity-30">
                            <Info size={10} />
                            <span className="text-[9px] font-bold uppercase">
                                {bookContent?.totalFiles} Parts Loaded
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        {lessons.map((num) => (
                            <LessonAccordion
                                key={num}
                                bookId={bookId}
                                lessonNum={num}
                                manifest={dialogueManifest}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Content: Stats-driven Overview */}
                <div className="flex-1">
                    <Card className="p-12 h-full bg-surface/50 border-dashed border-border-main/50 flex flex-col items-center justify-center text-center">
                        <div className="max-w-md w-full space-y-6">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                                <BookOpen size={40} className="text-red-500" />
                            </div>

                            <div>
                                <Typography
                                    variant="h3"
                                    className="text-2xl font-black"
                                >
                                    Volume {bookNumber} Overview
                                </Typography>
                                <Typography
                                    variant="p"
                                    className="opacity-60 text-sm mt-3 leading-relaxed"
                                >
                                    {parseInt(bookNumber) === 1
                                        ? 'Foundational volume covering phonetics, basic greetings, and essential sentence structures.'
                                        : `Exploring specialized topics for Volume ${bookNumber} with a focus on ${bookContent?.wordCount} key vocabulary items.`}
                                </Typography>
                            </div>

                            <div className="pt-4 border-t border-border-main/50 w-full">
                                {/* Pass the calculated wordCount and lessonCount to BookStats if it accepts props, 
                                    otherwise it can also use useVocabulary() internally */}
                                <BookStats bookNumber={bookNumber} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Shell>
    );
}
