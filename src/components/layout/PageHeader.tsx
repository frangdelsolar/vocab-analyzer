// @/components/layout/PageHeader.tsx
import { ReactNode } from 'react';
import { Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    description?: string;
    className?: string;
    // Slots for flexibility
    badges?: ReactNode;
    rightElement?: ReactNode;
    // For Dashboard style "Welcome" text
    overline?: string;
}

export const PageHeader = ({
    title,
    description,
    className,
    badges,
    rightElement,
    overline,
}: PageHeaderProps) => {
    return (
        <div
            className={cn(
                'w-full mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6',
                className,
            )}
        >
            <div className="flex-1 space-y-2">
                {/* Overline/Welcome text */}
                {overline && (
                    <Typography
                        variant="small"
                        className="uppercase tracking-[0.2em] opacity-50 block mb-1 font-bold"
                    >
                        {overline}
                    </Typography>
                )}

                {/* Badges row (from Dialogue Header) */}
                {badges && (
                    <div className="flex items-center gap-2 mb-3">{badges}</div>
                )}

                <Typography
                    variant="h1"
                    className="text-3xl lg:text-5xl leading-tight font-black tracking-tight"
                >
                    {title}
                </Typography>

                {description && (
                    <Typography
                        variant="p"
                        className="opacity-60 mt-1 max-w-2xl"
                    >
                        {description}
                    </Typography>
                )}
            </div>

            {/* Right side element (Stats, Current Goal, etc) */}
            {rightElement && (
                <div className="w-full md:w-auto flex-shrink-0">
                    {rightElement}
                </div>
            )}
        </div>
    );
};
