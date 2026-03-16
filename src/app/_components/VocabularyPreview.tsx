'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useVocabulary } from '@/context/VocabularyContext';
import { useProgress } from '@/context/ProgressContext';
import { Typography } from '@/components/ui';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { LocationBadge } from '@/components/ui/location-badge';
import { ArrowRight, ExternalLink } from 'lucide-react';

export const VocabularyPreview = () => {
    const { getFilteredCards, isLoading: vocabLoading } = useVocabulary();
    const { progress } = useProgress();

    const { activeWords, totalCount } = useMemo(() => {
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
    }, [progress, getFilteredCards]);

    const isLoading = vocabLoading;

    return (
        <div className="w-full space-y-6">
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
                        className="text-xs opacity-50 font-bold uppercase tracking-widest mt-0"
                    >
                        Unlocked up to Book {progress.book} · Lesson{' '}
                        {progress.lesson}
                    </Typography>
                </div>
                <Link
                    href="/vocabulary"
                    className="group flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest hover:translate-x-1 transition-transform"
                >
                    Full Explorer <ArrowRight size={14} />
                </Link>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Hanzi</TableHead>
                        <TableHead>Pinyin</TableHead>
                        <TableHead>Meaning</TableHead>
                        <TableHead className="text-right">Source</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <PreviewLoadingState />
                    ) : (
                        activeWords.map((item, i) => (
                            <TableRow key={`${item.traditional}-${i}`}>
                                <TableCell className="whitespace-nowrap">
                                    <Typography
                                        variant="hanzi"
                                        className="text-2xl font-bold mt-0"
                                    >
                                        {item.traditional}
                                    </Typography>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <Typography
                                        variant="pinyin"
                                        className="text-sm font-bold text-red-500/80 italic mt-0"
                                    >
                                        {item.pinyin}
                                    </Typography>
                                </TableCell>
                                <TableCell className="min-w-[200px]">
                                    <Typography
                                        variant="p"
                                        className="text-sm opacity-70 line-clamp-1 mt-0"
                                    >
                                        {item.meaning}
                                    </Typography>
                                </TableCell>
                                <TableCell className="text-right">
                                    <LocationBadge
                                        location={item.location}
                                        className="justify-end"
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <tfoot>
                    <tr>
                        <td colSpan={4} className="p-0">
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
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </div>
    );
};

const PreviewLoadingState = () =>
    [...Array(6)].map((_, i) => (
        <TableRow key={i} className="animate-pulse">
            <TableCell>
                <div className="h-8 w-12 bg-ink/10 dark:bg-white/10 rounded" />
            </TableCell>
            <TableCell>
                <div className="h-4 w-20 bg-ink/10 dark:bg-white/10 rounded" />
            </TableCell>
            <TableCell>
                <div className="h-4 w-32 bg-ink/10 dark:bg-white/10 rounded" />
            </TableCell>
            <TableCell className="text-right">
                <div className="h-4 w-8 bg-ink/10 dark:bg-white/10 rounded ml-auto" />
            </TableCell>
        </TableRow>
    ));
