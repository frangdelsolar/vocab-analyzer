'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useVocabulary } from '@/context/VocabularyContext';
import { useUser } from '@/context/UserContext';
import { Card, Typography } from '@/components/ui';
import { ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';

export const VocabularyPreview = () => {
    const { getFilteredCards, isLoading: vocabLoading } = useVocabulary();
    const { progress, isHydrated } = useUser();

    // 1. Data Orchestration
    const { activeWords, totalCount } = useMemo(() => {
        if (!isHydrated) return { activeWords: [], totalCount: 0 };

        const allActive = getFilteredCards({
            book: progress.book,
            lesson: progress.lesson,
            section: progress.section,
            mode: 'cumulative',
        });

        return {
            activeWords: [...allActive].reverse().slice(0, 6),
            totalCount: allActive.length,
        };
    }, [progress, getFilteredCards, isHydrated]);

    const isLoading = vocabLoading || !isHydrated;

    return (
        <div className="w-full space-y-6">
            <PreviewHeader progress={progress} />

            <Card className="border-border-main/50 overflow-hidden bg-surface/50 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <TableHead />
                        <tbody className="divide-y divide-border-main/20">
                            {isLoading ? (
                                <PreviewLoadingState />
                            ) : (
                                activeWords.map((item, i) => (
                                    <VocabRow
                                        key={`${item.traditional}-${i}`}
                                        item={item}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <FooterLink totalCount={totalCount} />
            </Card>
        </div>
    );
};

// --- Sub-components ---

const PreviewHeader = ({ progress }: { progress: any }) => (
    <div className="flex items-end justify-between px-2">
        <div className="space-y-1">
            <Typography
                variant="h2"
                className="text-3xl font-black tracking-tighter"
            >
                Active Vocabulary
            </Typography>
            <Typography
                variant="p"
                className="text-xs opacity-50 font-bold uppercase tracking-widest"
            >
                Unlocked up to Book {progress.book} · Lesson {progress.lesson}
            </Typography>
        </div>
        <Link
            href="/vocabulary"
            className="group flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest hover:translate-x-1 transition-transform"
        >
            Full Explorer <ArrowRight size={14} />
        </Link>
    </div>
);

const TableHead = () => (
    <thead>
        <tr className="border-b border-border-main/50 bg-ink/[0.02] dark:bg-white/[0.02]">
            {['Hanzi', 'Pinyin', 'Meaning', 'Source'].map((label) => (
                <th
                    key={label}
                    className={`p-4 text-[10px] font-black uppercase tracking-widest opacity-40 ${label === 'Source' ? 'text-right' : ''}`}
                >
                    {label}
                </th>
            ))}
        </tr>
    </thead>
);

const VocabRow = ({ item }: { item: any }) => (
    <tr className="hover:bg-ink/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
        <td className="p-4">
            <span className="text-2xl font-black dark:text-ink-dark">
                {item.traditional}
            </span>
        </td>
        <td className="p-4">
            <span className="text-sm font-bold text-red-500/80 italic">
                {item.pinyin}
            </span>
        </td>
        <td className="p-4">
            <span className="text-sm opacity-70 line-clamp-1">
                {item.meaning}
            </span>
        </td>
        <td className="p-4 text-right">
            <div className="inline-flex items-center gap-1 text-[9px] font-black opacity-30 group-hover:opacity-100 transition-opacity">
                B{item.location.book} <ChevronRight size={8} /> L
                {item.location.lesson}
            </div>
        </td>
    </tr>
);

const FooterLink = ({ totalCount }: { totalCount: number }) => (
    <Link href="/vocabulary">
        <div className="p-4 bg-ink/[0.03] dark:bg-white/[0.03] border-t border-border-main/50 flex items-center justify-center gap-2 group hover:bg-red-500 transition-all duration-300">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                Explore all {totalCount} words
            </span>
            <ExternalLink
                size={12}
                className="group-hover:text-white group-hover:translate-x-1 transition-all"
            />
        </div>
    </Link>
);

const PreviewLoadingState = () =>
    [...Array(6)].map((_, i) => (
        <tr key={i} className="animate-pulse">
            <td className="p-4">
                <div className="h-8 w-12 bg-ink/10 rounded" />
            </td>
            <td className="p-4">
                <div className="h-4 w-20 bg-ink/10 rounded" />
            </td>
            <td className="p-4">
                <div className="h-4 w-32 bg-ink/10 rounded" />
            </td>
            <td className="p-4 text-right">
                <div className="h-4 w-8 bg-ink/10 rounded ml-auto" />
            </td>
        </tr>
    ));
