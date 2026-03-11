import { Typography } from '@/components/ui/typography';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationBadgeProps {
    location: {
        book: number | string;
        lesson: number | string;
        section?: string | number;
        order?: string | number;
    };
    showOrder?: boolean;
    className?: string;
}

export function LocationBadge({
    location,
    showOrder = false,
    className,
}: LocationBadgeProps) {
    return (
        <Typography
            variant="small"
            className={cn(
                'text-[10px] font-black tracking-tighter opacity-30 group-hover/row:opacity-100 transition-opacity flex items-center gap-0.5 uppercase',
                className,
            )}
        >
            <span className="text-red-500">B{location.book}</span>
            <ChevronRight size={10} className="opacity-50" />
            <span>L{location.lesson}</span>

            {location.section !== undefined && (
                <>
                    <ChevronRight size={10} className="opacity-50" />
                    <span>P{location.section}</span>
                </>
            )}

            {showOrder && location.order !== undefined && (
                <>
                    <ChevronRight size={10} className="opacity-50" />
                    <span className="bg-ink/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-[9px]">
                        #{location.order}
                    </span>
                </>
            )}
        </Typography>
    );
}
