// components/home/BookCard.tsx
import { Card, CardContent, Typography } from '@/components/ui';
import Link from 'next/link';

export const BookCard = ({ number }: { number: number }) => {
    // Generate the dynamic path, e.g., /library/book-2
    const href = `/library/book-${number}`;

    return (
        <Link href={href} className="block group">
            <Card className="cursor-pointer border-border-main hover:border-ink/20 hover:shadow-md transition-all duration-300 active:scale-[0.98]">
                <CardContent className="p-3 flex items-center gap-3">
                    {/* Cover Art Box */}
                    <div className="w-14 h-18 shrink-0 bg-ink/5 rounded-md flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:bg-red-500/10">
                        <span className="text-4xl font-black opacity-[0.03] select-none absolute top-[-5px] right-1">
                            {number}
                        </span>
                        <Typography
                            variant="hanzi"
                            className="text-lg font-bold text-ink/80 group-hover:text-red-500 transition-colors"
                        >
                            第{number}冊
                        </Typography>

                        {/* Red Binding Detail */}
                        <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-red-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <Typography
                            variant="small"
                            className="font-bold truncate text-ink"
                        >
                            Book {number}
                        </Typography>
                        <Typography
                            variant="pinyin"
                            className="text-[10px] leading-tight font-medium tracking-tight opacity-60"
                        >
                            Contemporary Chinese
                        </Typography>
                        <Typography
                            variant="small"
                            className="opacity-40 text-[9px] mt-0.5 font-medium"
                        >
                            15 Lessons • Audio {number}-01
                        </Typography>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};
