'use client';

import { cn } from '@/lib/utils';
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
import { VisibilitySettings } from '../page';

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
    const totalCols = visibility.simplified ? 5 : 4;

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead>Traditional</TableHead>
                    {visibility.simplified && (
                        <TableHead className="animate-in fade-in zoom-in-95">
                            Simplified
                        </TableHead>
                    )}
                    <TableHead>Pinyin</TableHead>
                    <TableHead>Meaning</TableHead>
                    <TableHead className="text-right">Source</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
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
                        <TableRow key={idx}>
                            <TableCell
                                className={cn(
                                    'group',
                                    !visibility.character && 'cursor-help',
                                )}
                            >
                                <Typography
                                    variant="hanzi"
                                    className={cn(
                                        'text-2xl font-bold tracking-tighter transition-all duration-300',
                                        !visibility.character &&
                                            'blur-[5px] opacity-20 select-none group-hover:blur-none group-hover:opacity-100',
                                    )}
                                >
                                    {item.traditional}
                                </Typography>
                            </TableCell>

                            {visibility.simplified && (
                                <TableCell className="animate-in fade-in slide-in-from-left-2 duration-300">
                                    <Typography
                                        variant="hanzi"
                                        className="text-2xl font-bold tracking-tighter opacity-80"
                                    >
                                        {item.simplified}
                                    </Typography>
                                </TableCell>
                            )}

                            <TableCell
                                className={cn(
                                    'group',
                                    !visibility.pinyin && 'cursor-help',
                                )}
                            >
                                <Typography
                                    variant="pinyin"
                                    className={cn(
                                        'text-sm text-red-600 dark:text-red-400 font-bold italic transition-all duration-300',
                                        !visibility.pinyin &&
                                            'blur-[5px] opacity-20 select-none group-hover:blur-none group-hover:opacity-100',
                                    )}
                                >
                                    {item.pinyin}
                                </Typography>
                            </TableCell>

                            <TableCell
                                className={cn(
                                    'group',
                                    !visibility.meaning && 'cursor-help',
                                )}
                            >
                                <Typography
                                    variant="p"
                                    className={cn(
                                        'text-sm opacity-70 leading-relaxed line-clamp-2 transition-all duration-300 mt-0',
                                        !visibility.meaning &&
                                            'blur-[5px] opacity-20 select-none group-hover:blur-none group-hover:opacity-100',
                                    )}
                                >
                                    {item.meaning}
                                </Typography>
                            </TableCell>

                            <TableCell className="text-right">
                                <LocationBadge
                                    location={item.location}
                                    showOrder
                                    className="justify-end"
                                />
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
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
        <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colSpan} className="py-20 text-center">
                <Typography
                    variant="p"
                    className={cn(
                        'opacity-40 italic mt-0',
                        animate && 'animate-pulse',
                    )}
                >
                    {message}
                </Typography>
            </TableCell>
        </TableRow>
    );
}
