'use client';

import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui';
import { VisibilitySettings } from '../page';
import { ChevronRight } from 'lucide-react';

interface VocabTableProps {
    data: any[];
    isLoading: boolean;
    visibility: VisibilitySettings;
    searchQuery: string;
}

export default function VocabTable({
    data,
    isLoading,
    visibility,
    searchQuery,
}: VocabTableProps) {
    // Dynamic colSpan for full-width rows (4 base columns + 1 optional simplified)
    const totalCols = visibility.simplified ? 5 : 4;

    return (
        <div className="border border-border-main/50 rounded-2xl overflow-hidden bg-surface dark:bg-surface-dark shadow-sm transition-colors duration-500">
            <table className="w-full text-left border-collapse">
                <thead className="bg-ink/[0.03] dark:bg-white/[0.03] border-b border-border-main/50">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40">
                            Traditional
                        </th>
                        {visibility.simplified && (
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40 animate-in fade-in zoom-in-95 duration-300">
                                Simplified
                            </th>
                        )}
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40">
                            Pinyin
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40">
                            Meaning
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40 text-right">
                            Source
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-main/30">
                    {isLoading ? (
                        <TableMessage
                            message="Loading vocabulary..."
                            animate
                            colSpan={totalCols}
                        />
                    ) : data.length === 0 ? (
                        <TableMessage
                            message={`No matches found for "${searchQuery}"`}
                            colSpan={totalCols}
                        />
                    ) : (
                        data.map((item, idx) => (
                            <tr
                                key={idx}
                                className="hover:bg-ink/[0.01] dark:hover:bg-white/[0.01] transition-colors group/row"
                            >
                                {/* Character Cell */}
                                <td className="px-6 py-5 group cursor-help">
                                    <span
                                        className={cn(
                                            'text-2xl font-black tracking-tighter transition-all duration-300 block',
                                            'dark:text-ink-dark',
                                            !visibility.character &&
                                                'blur-md opacity-10 select-none group-hover:blur-none group-hover:opacity-100',
                                        )}
                                    >
                                        {item.traditional}
                                    </span>
                                </td>

                                {/* Simplified Cell */}
                                {visibility.simplified && (
                                    <td className="px-6 py-5 group animate-in fade-in slide-in-from-left-2 duration-300">
                                        <span className="text-2xl font-black tracking-tighter block dark:text-ink-dark/80">
                                            {item.simplified}
                                        </span>
                                    </td>
                                )}

                                {/* Pinyin Cell */}
                                <td className="px-6 py-5 group cursor-help">
                                    <Typography
                                        variant="pinyin"
                                        className={cn(
                                            'text-sm text-red-600 dark:text-red-400 font-bold italic transition-all duration-300 block',
                                            !visibility.pinyin &&
                                                'blur-md opacity-10 select-none group-hover:blur-none group-hover:opacity-100',
                                        )}
                                    >
                                        {item.pinyin}
                                    </Typography>
                                </td>

                                {/* Meaning Cell */}
                                <td className="px-6 py-5 group cursor-help">
                                    <Typography
                                        variant="p"
                                        className={cn(
                                            'text-sm text-ink/70 dark:text-ink-dark/60 leading-relaxed line-clamp-2 transition-all duration-300 block',
                                            !visibility.meaning &&
                                                'blur-md opacity-10 select-none group-hover:blur-none group-hover:opacity-100',
                                        )}
                                    >
                                        {item.meaning}
                                    </Typography>
                                </td>

                                {/* Breadcrumb Source Cell */}
                                <td className="px-6 py-5 text-right whitespace-nowrap">
                                    <div className="inline-flex items-center gap-1 font-black text-[10px] tracking-tighter opacity-30 group-hover/row:opacity-100 transition-opacity uppercase">
                                        <span className="text-red-500">
                                            B{item.location.book}
                                        </span>
                                        <ChevronRight
                                            size={10}
                                            className="opacity-50"
                                        />
                                        <span>L{item.location.lesson}</span>
                                        <ChevronRight
                                            size={10}
                                            className="opacity-50"
                                        />
                                        <span>{item.location.section}</span>
                                        <ChevronRight
                                            size={10}
                                            className="opacity-50"
                                        />
                                        <span className="bg-ink/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-[9px]">
                                            #{item.location.order}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

function TableMessage({
    message,
    animate,
    colSpan,
}: {
    message: string;
    animate?: boolean;
    colSpan: number;
}) {
    return (
        <tr>
            <td colSpan={colSpan} className="px-6 py-20 text-center">
                <div className={cn(animate && 'animate-pulse')}>
                    <Typography
                        variant="p"
                        className="opacity-40 italic dark:text-ink-dark"
                    >
                        {message}
                    </Typography>
                </div>
            </td>
        </tr>
    );
}
