'use client';

import { Typography } from '@/components/ui';

const grades = [
    {
        label: 'Again',
        value: 1,
        color: 'hover:text-red-500 hover:border-red-500',
    },
    {
        label: 'Hard',
        value: 2,
        color: 'hover:text-orange-500 hover:border-orange-500',
    },
    {
        label: 'Good',
        value: 3,
        color: 'hover:text-green-500 hover:border-green-500',
    },
    {
        label: 'Easy',
        value: 4,
        color: 'hover:text-blue-500 hover:border-blue-500',
    },
];

export const RatingSystem = ({
    onGrade,
}: {
    onGrade: (grade: number) => void;
}) => {
    return (
        <div className="grid grid-cols-4 gap-3 w-full max-w-md animate-in fade-in slide-in-from-bottom-2">
            {grades.map((g) => (
                <button
                    key={g.value}
                    onClick={() => onGrade(g.value)}
                    className={`group flex flex-col items-center gap-2 p-4 rounded-2xl border border-border-main bg-surface transition-all active:scale-95 ${g.color}`}
                >
                    <Typography
                        variant="small"
                        className="font-black uppercase tracking-widest text-[10px] opacity-40 group-hover:opacity-100"
                    >
                        {g.label}
                    </Typography>
                    <span className="text-xs font-mono opacity-20 group-hover:opacity-100">
                        {g.value}
                    </span>
                </button>
            ))}
        </div>
    );
};
