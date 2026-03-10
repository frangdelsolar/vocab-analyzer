// components/home/BookCard.tsx
import { Card, CardContent, Typography } from '@/components/ui';
import Link from 'next/link';

interface BookCardProps {
    bookId: string;
    lessonCount: number;
    partCount: number;
    wordCount: number;
}

export const BookCard = ({
    bookId,
    lessonCount,
    partCount,
    wordCount,
}: BookCardProps) => {
    return (
        <Link href={`/library/book-${bookId}`} className="block group">
            <Card className="cursor-pointer border-border-main hover:border-ink/20 hover:shadow-md transition-all duration-300 active:scale-[0.98]">
                <CardContent className="p-3 flex items-center gap-3">
                    <div className="w-14 h-18 shrink-0 bg-ink/5 rounded-md flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-red-500/10">
                        <span className="text-4xl font-black opacity-[0.03] select-none absolute top-[-5px] right-1">
                            {bookId}
                        </span>
                        <Typography
                            variant="hanzi"
                            className="text-lg font-bold text-ink/80 group-hover:text-red-500 transition-colors"
                        >
                            第{bookId}冊
                        </Typography>
                        <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-red-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                    </div>

                    <div className="flex flex-col gap-0.5 min-w-0">
                        <Typography
                            variant="small"
                            className="font-bold truncate text-ink"
                        >
                            Book {bookId}
                        </Typography>
                        <Typography
                            variant="pinyin"
                            className="text-[10px] leading-tight font-medium opacity-60"
                        >
                            {lessonCount} Lessons • {partCount} Parts
                        </Typography>
                        <Typography
                            variant="small"
                            className="opacity-40 text-[9px] mt-0.5 font-medium"
                        >
                            {wordCount} Vocabulary Words
                        </Typography>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};
