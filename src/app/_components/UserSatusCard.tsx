'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useVocabulary } from '@/context/VocabularyContext';
import { useUser } from '@/context/UserContext'; // Import the new context
import { Card, CardContent, Typography, Button } from '@/components/ui';
import { BookOpen, Layers, ListFilter, PlayCircle, Trophy } from 'lucide-react';

export const UserStatusCard = () => {
    const router = useRouter();
    const {
        metadata,
        getFilteredCards,
        isLoading: vocabLoading,
    } = useVocabulary();
    const { progress, updateProgress, isHydrated } = useUser();

    const masteredCount = useMemo(() => {
        return getFilteredCards({
            book: progress.book,
            lesson: progress.lesson,
            section: progress.section,
            mode: 'cumulative',
        }).length;
    }, [progress, getFilteredCards]);

    if (vocabLoading || !isHydrated || !metadata) return null;

    const availableBooks = Object.keys(metadata.books)
        .map(Number)
        .sort((a, b) => a - b);
    const availableLessons = Object.keys(
        metadata.books[progress.book]?.lessons || {},
    )
        .map(Number)
        .sort((a, b) => a - b);
    const availableSections =
        metadata.books[progress.book]?.lessons[progress.lesson]?.sections || [];

    const handleContinue = () => {
        router.push(
            `/library/book-${progress.book}/${progress.lesson}/${progress.section}`,
        );
    };

    return (
        <Card className="mb-8 border-none bg-gradient-to-br from-red-500/5 via-transparent to-transparent ring-1 ring-border-main/50 shadow-none">
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    {/* Progress Stats */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                <Trophy size={28} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-ink text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                LVL {progress.book}
                            </div>
                        </div>
                        <div>
                            <Typography
                                variant="small"
                                className="text-[10px] font-black uppercase tracking-widest opacity-40"
                            >
                                Global Mastery
                            </Typography>
                            <Typography variant="h3" className="mb-1 font-bold">
                                {masteredCount} Characters
                            </Typography>
                            <Typography variant="small" className="opacity-50">
                                Up to Book {progress.book} Lesson{' '}
                                {progress.lesson}
                            </Typography>
                        </div>
                    </div>

                    {/* Quick Selectors */}
                    <div className="flex flex-wrap items-center gap-3">
                        <StatusSelect
                            icon={BookOpen}
                            label="Book"
                            value={progress.book}
                            options={availableBooks}
                            onChange={(v: number) =>
                                updateProgress({
                                    book: v,
                                    lesson: 1,
                                    section: 1,
                                })
                            }
                        />
                        <StatusSelect
                            icon={Layers}
                            label="Lesson"
                            value={progress.lesson}
                            options={availableLessons}
                            onChange={(v: number) =>
                                updateProgress({ lesson: v, section: 1 })
                            }
                        />
                        <StatusSelect
                            icon={ListFilter}
                            label="Part"
                            value={progress.section}
                            options={availableSections}
                            onChange={(v: number) =>
                                updateProgress({ section: v })
                            }
                        />
                    </div>

                    <Button
                        onClick={handleContinue}
                        className="bg-red-500 hover:bg-red-600 text-white h-12 px-6 rounded-xl flex items-center gap-3 transition-transform active:scale-95"
                    >
                        <PlayCircle size={20} />
                        <span className="font-bold">Resume Studies</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const StatusSelect = ({ icon: Icon, label, value, options, onChange }: any) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 opacity-40 px-1">
            <Icon size={10} />
            <span className="text-[9px] font-black uppercase tracking-widest">
                {label}
            </span>
        </div>
        <select
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="bg-ink/[0.03] dark:bg-white/[0.03] border border-border-main/20 rounded-lg px-3 py-2 text-xs font-bold outline-none"
        >
            {options.map((opt: number) => (
                <option key={opt} value={opt}>
                    {label} {opt}
                </option>
            ))}
        </select>
    </div>
);
