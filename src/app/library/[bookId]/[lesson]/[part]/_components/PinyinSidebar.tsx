'use client';
import { DialogueContent } from '@/lib/dialogue-utils';
import { Typography, Card } from '@/components/ui';
import { Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PARTICIPANT_THEMES } from './UseParticipantColors';

const PinyinSidebar = ({
    content,
    colorMap,
}: {
    content: DialogueContent[];
    colorMap: Record<string, (typeof PARTICIPANT_THEMES)[0]>;
}) => (
    <Card className="flex-1 flex flex-col overflow-hidden bg-surface/50 backdrop-blur-sm border-border-main shadow-inner">
        <div className="p-4 border-b border-border-main bg-ink/[0.02] flex items-center gap-2">
            <Languages size={16} className="text-red-500" />
            <Typography
                variant="small"
                className="text-xs font-black uppercase tracking-widest opacity-60"
            >
                Phonetic Guide
            </Typography>
        </div>
        <div className="p-5 overflow-y-auto max-h-[50vh] space-y-6 custom-scrollbar">
            {content.map((item, i) => {
                const theme = item.speaker ? colorMap[item.speaker] : null;
                return (
                    <div key={i} className="space-y-2 group">
                        {item.speaker && (
                            <span
                                className={cn(
                                    'text-xs font-black px-2 py-0.5 rounded border uppercase tracking-wide inline-block',
                                    theme?.bg,
                                    theme?.text,
                                    theme?.border,
                                )}
                            >
                                {item.speaker}
                            </span>
                        )}
                        <Typography
                            variant="pinyin"
                            className="block text-base leading-relaxed text-ink/70 italic font-medium pl-1 border-l-2 border-transparent group-hover:border-red-500/20 transition-all"
                        >
                            {item.pinyin}
                        </Typography>
                    </div>
                );
            })}
        </div>
    </Card>
);

export default PinyinSidebar;
