'use client';
import { useMemo } from 'react';

// Robust set of accessible color themes supporting light and dark modes
export const PARTICIPANT_THEMES = [
    {
        text: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-500/10',
        border: 'border-rose-200 dark:border-rose-500/20',
    },
    {
        text: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        border: 'border-blue-200 dark:border-blue-500/20',
    },
    {
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        border: 'border-emerald-200 dark:border-emerald-500/20',
    },
    {
        text: 'text-violet-600 dark:text-violet-400',
        bg: 'bg-violet-50 dark:bg-violet-500/10',
        border: 'border-violet-200 dark:border-violet-500/20',
    },
    {
        text: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-50 dark:bg-orange-500/10',
        border: 'border-orange-200 dark:border-orange-500/20',
    },
    {
        text: 'text-cyan-600 dark:text-cyan-400',
        bg: 'bg-cyan-50 dark:bg-cyan-500/10',
        border: 'border-cyan-200 dark:border-cyan-500/20',
    },
];

export const useParticipantColors = (participants: string[] = []) => {
    return useMemo(() => {
        const map: Record<string, (typeof PARTICIPANT_THEMES)[0]> = {};
        participants.forEach((name, index) => {
            map[name] = PARTICIPANT_THEMES[index % PARTICIPANT_THEMES.length];
        });
        return map;
    }, [participants]);
};

export default useParticipantColors;
