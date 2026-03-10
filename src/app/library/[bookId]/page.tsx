// app/library/[bookId]/page.tsx
import { Shell } from '@/components/layout/Shell';
import { Typography, Card } from '@/components/ui';
import { BookOpen, ChevronLeft } from 'lucide-react';
import { LessonAccordion } from './_components/LessonAccordion';
import { BookStats } from './_components/BookStats';
import { PageHeader } from '@/components/layout/PageHeader';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

// This is now a local sync function for build-time safety
function getManifest() {
    try {
        const filePath = path.join(
            process.cwd(),
            'public',
            'dialogues',
            'manifest.json',
        );
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Manifest load error:', error);
        return { files: [] };
    }
}

export async function generateStaticParams() {
    return [
        { bookId: 'book-1' },
        { bookId: 'book-2' },
        { bookId: 'book-3' },
        { bookId: 'book-4' },
        { bookId: 'book-5' },
        { bookId: 'book-6' },
    ];
}

export default async function BookExplorer({
    params,
}: {
    params: Promise<{ bookId: string }>;
}) {
    const { bookId } = await params;
    const manifestData = await getManifest();
    const lessons = Array.from({ length: 15 }, (_, i) => i + 1);
    const bookNumber = bookId.replace('book-', '');

    return (
        <Shell>
            {/* 1. Integrated PageHeader */}
            <PageHeader
                overline="Course Explorer"
                title={`Contemporary Chinese Vol. ${bookNumber}`}
                description={`Explore 15 lessons of specialized content for Volume ${bookNumber}.`}
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
                {/* Left Sidebar: Lesson Selection */}
                <div className="w-full lg:w-80 shrink-0">
                    <Typography
                        variant="small"
                        className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4 block"
                    >
                        Lesson Index
                    </Typography>

                    <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        {lessons.map((num) => (
                            <LessonAccordion
                                key={num}
                                bookId={bookId}
                                lessonNum={num}
                                manifest={manifestData.files}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Content: Overview Dashboard */}
                <div className="flex-1">
                    <Card className="p-12 h-full bg-surface/50 border-dashed flex flex-col items-center justify-center text-center">
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
                                        ? 'Foundational volume covering phonetics, basic greetings, and essential sentence structures for daily survival.'
                                        : 'Focusing on expanding vocabulary and complex grammatical patterns for intermediate conversational topics.'}
                                </Typography>
                            </div>

                            <div className="pt-4 border-t border-border-main/50 w-full">
                                <BookStats bookNumber={bookNumber} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Shell>
    );
}
