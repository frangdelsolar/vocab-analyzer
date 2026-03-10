'use client';
import { useEffect, useState } from 'react';
import { Typography } from '@/components/ui';
import {
    BookOpenText,
    Languages,
    Mic2,
    GraduationCap,
    Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookStatsProps {
    bookNumber: string;
}

export const BookStats = ({ bookNumber }: BookStatsProps) => {
    const [stats, setStats] = useState({
        vocabCount: 0,
        dialogueCount: 0,
        readingCount: 0,
        audioEst: '0',
    });

    useEffect(() => {
        const calculateStats = async () => {
            try {
                const [cardsRes, manifestRes] = await Promise.all([
                    fetch('/parsed-cards.json'),
                    fetch('/dialogues/manifest.json'),
                ]);

                const cards = await cardsRes.json();
                const manifest = await manifestRes.json();
                const bookNum = parseInt(bookNumber);

                const bookVocab = cards.filter(
                    (card: any) => card.location.book === bookNum,
                );
                const bookFiles = manifest.files.filter((f: string) =>
                    f.startsWith(bookNumber.padStart(2, '0')),
                );

                const readings = bookFiles.filter(
                    (f: string) => f.endsWith('02.json') && bookNum >= 2,
                ).length;
                const dialogues = bookFiles.length - readings;

                setStats({
                    vocabCount: bookVocab.length,
                    dialogueCount: dialogues,
                    readingCount: readings,
                    audioEst: (bookFiles.length * 3.5).toFixed(0),
                });
            } catch (error) {
                console.error('Failed to calculate book stats:', error);
            }
        };
        calculateStats();
    }, [bookNumber]);

    const statItems = [
        {
            label: 'Vocab',
            value: stats.vocabCount,
            icon: Languages,
            color: 'text-blue-500',
        },
        {
            label: 'Dialogues',
            value: stats.dialogueCount,
            icon: Mic2,
            color: 'text-green-500',
        },
        {
            label: 'Readings',
            value: stats.readingCount,
            icon: BookOpenText,
            color: 'text-orange-500',
        },
        {
            label: 'Lessons',
            value: '15',
            icon: GraduationCap,
            color: 'text-red-500',
        },
    ];

    return (
        <div className="w-full space-y-3">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-4 gap-2">
                {statItems.map((item) => (
                    <div
                        key={item.label}
                        className="px-2 py-3 rounded-xl bg-surface border border-border-main/50 flex flex-col items-center justify-center transition-colors hover:bg-ink/[0.02]"
                    >
                        <item.icon
                            size={14}
                            className={cn(item.color, 'mb-1 opacity-70')}
                        />
                        <Typography
                            variant="h4"
                            className="text-sm font-black leading-none mb-1"
                        >
                            {item.value}
                        </Typography>
                        <Typography
                            variant="small"
                            className="text-[9px] font-bold uppercase tracking-tighter opacity-40 leading-none"
                        >
                            {item.label}
                        </Typography>
                    </div>
                ))}
            </div>

            {/* Compact Immersion Banner */}
            <div className="flex items-center justify-between px-3 py-2 bg-ink/[0.03] rounded-lg border border-border-main/20">
                <div className="flex items-center gap-2">
                    <Clock size={12} className="text-green-600 opacity-60" />
                    <Typography
                        variant="small"
                        className="text-[10px] font-bold uppercase tracking-tight opacity-50"
                    >
                        Immersion Time
                    </Typography>
                </div>
                <Typography
                    variant="small"
                    className="text-[10px] font-black text-green-700 dark:text-green-400"
                >
                    ~{stats.audioEst} MINS
                </Typography>
            </div>
        </div>
    );
};
