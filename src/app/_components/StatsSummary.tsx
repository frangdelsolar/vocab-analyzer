'use client';

import { useVocabulary } from '@/context/VocabularyContext';
import { Card, Typography } from '@/components/ui';
import { BookOpen, Zap, BarChart3, Trophy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const StatsSummary = () => {
    const { filteredMap, settings } = useVocabulary();

    // Insight 1: Current Scope count
    const totalInView = filteredMap.size;

    // Insight 2: Complexity Check (average strokes or character length)
    // Here we'll just simulate "Mastery" based on Book progress
    const currentBook = settings.explorer.b;
    const seriesCompletion = Math.round((currentBook / 6) * 100);

    const INSIGHTS = [
        {
            label: 'Series Progress',
            value: `${seriesCompletion}%`,
            sub: `Book ${currentBook} of 6`,
            icon: Trophy,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
        },
        {
            label: 'Vocabulary Density',
            value: totalInView.toString(),
            sub: settings.scope === 'all' ? 'Total Series' : 'Active Filter',
            icon: BookOpen,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
        },
        {
            label: 'Daily Goal',
            value: '24 / 50',
            sub: 'Characters Read',
            icon: Zap,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
            {INSIGHTS.map((stat) => (
                <Card
                    key={stat.label}
                    className="relative overflow-hidden group hover:border-red-500/30 transition-colors"
                >
                    <div className="flex items-center p-6">
                        <div
                            className={cn(
                                'p-3 rounded-2xl mr-4 transition-transform group-hover:scale-110 duration-300',
                                stat.bg,
                                stat.color,
                            )}
                        >
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <Typography
                                variant="small"
                                className="opacity-40 font-bold uppercase text-[10px] tracking-widest"
                            >
                                {stat.label}
                            </Typography>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black text-ink dark:text-ink-dark leading-none tracking-tighter">
                                    {stat.value}
                                </p>
                                <span className="text-[10px] font-bold opacity-40 uppercase">
                                    {stat.sub}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Subtle Progress Bar Decoration */}
                    <div
                        className="absolute bottom-0 left-0 h-1 bg-current opacity-10 w-full"
                        style={{ color: 'inherit' }}
                    />
                </Card>
            ))}
        </div>
    );
};
