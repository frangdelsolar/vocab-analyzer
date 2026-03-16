// @/components/status/MasteryStats.tsx
import { Typography } from '@/components/ui';
import { Trophy } from 'lucide-react';

export function MasteryStats({
    count,
    book,
    lesson,
}: {
    count: number;
    book: number;
    lesson: number;
}) {
    return (
        <div className="p-6 border-r border-border-main/50 flex items-center gap-6">
            <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 rotate-3">
                    <Trophy size={24} />
                </div>
            </div>
            <div>
                <Typography
                    variant="small"
                    className="text-[10px] font-black uppercase tracking-widest opacity-40"
                >
                    Mastery Progress
                </Typography>
                <Typography
                    variant="h3"
                    className="font-black leading-tight text-2xl"
                >
                    {count}{' '}
                    <span className="text-sm font-medium opacity-40">
                        Chars
                    </span>
                </Typography>
                <Typography variant="small" className="opacity-40 font-bold">
                    Book {book} • Lesson {lesson}
                </Typography>
            </div>
        </div>
    );
}
