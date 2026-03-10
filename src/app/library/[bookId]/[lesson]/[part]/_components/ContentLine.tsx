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
}) => (
    <div className="group flex flex-col gap-2">
        {item.speaker && (
            <div className="flex items-center gap-2 ml-1">
                <span
                    className={cn(
                        'text-base font-black uppercase tracking-wider', // Reduced text-lg to text-base
                        theme?.text || 'text-red-600',
                    )}
                >
                    {item.speaker}
                </span>
                <div
                    className={cn(
                        'h-[1.5px] flex-1 bg-current opacity-10 rounded-full',
                        theme?.text || 'text-red-600',
                    )}
                />
            </div>
        )}
        <div
            className={cn(
                'p-4 rounded-2xl transition-all border shadow-sm group-hover:shadow-md', // Reduced p-6 to p-4, rounded-3xl to 2xl
                isReading
                    ? 'bg-transparent px-0 border-none shadow-none'
                    : 'bg-surface border-border-main group-hover:border-red-500/20',
            )}
        >
            <Typography
                variant="hanzi"
                className={isReading ? 'text-2xl' : 'text-xl font-medium'}
            >
                {/* Reduced sizes by one level */}
                <SmartText text={item.text} />
            </Typography>
        </div>
    </div>
);

export default ContentLine;
