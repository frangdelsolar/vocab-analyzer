'use client';
import { DialogueContent } from '@/lib/dialogue-utils';
import { Typography } from '@/components/ui';
import { SmartText } from './SmartText';
import { cn } from '@/lib/utils';
import { PARTICIPANT_THEMES } from './UseParticipantColors';

const ContentLine = ({
    item,
    isReading,
    theme,
}: {
    item: DialogueContent;
    isReading: boolean;
    theme?: (typeof PARTICIPANT_THEMES)[0];
}) => {
    // If it's a comment, render it simply as centered or italicized text
    if (item.comment) {
        return (
            <div className="py-2 flex justify-center">
                <Typography
                    variant="small"
                    className="italic opacity-50 tracking-wide"
                >
                    （{item.comment}）
                </Typography>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {item.speaker && (
                <div className="flex items-center gap-2 ml-1">
                    <span
                        className={cn(
                            'text-xs font-black uppercase tracking-widest opacity-70',
                            theme?.text || 'text-ink',
                        )}
                    >
                        {item.speaker}
                    </span>
                    <div className="h-[1px] flex-1 bg-ink/10 rounded-full" />
                </div>
            )}
            <div
                className={cn(
                    'transition-colors',
                    isReading
                        ? 'bg-transparent'
                        : 'p-4 rounded-xl bg-surface border border-border-main',
                )}
            >
                <Typography
                    variant="hanzi"
                    className={cn(
                        'leading-relaxed',
                        isReading ? 'text-2xl' : 'text-xl font-medium',
                    )}
                >
                    {/* Ensure we only pass string to SmartText */}
                    <SmartText text={item.text || ''} />
                </Typography>
            </div>
        </div>
    );
};

export default ContentLine;
