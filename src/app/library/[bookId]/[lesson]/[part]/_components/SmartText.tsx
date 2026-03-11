'use client';

import { useVocabulary } from '@/context/VocabularyContext';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Typography } from '@/components/ui';

export const SmartText = ({ text }: { text: string }) => {
    const { filteredMap, isLoading } = useVocabulary();

    if (isLoading) return <>{text}</>;

    let rendered = [];
    let i = 0;
    while (i < text.length) {
        let found = false;
        for (let len = 4; len >= 1; len--) {
            const word = text.substring(i, i + len);
            const card = filteredMap.get(word);

            if (card) {
                rendered.push(
                    <Popover key={`${i}-${word}`}>
                        <PopoverTrigger asChild>
                            <span
                                className="cursor-help mx-[1px] px-1 rounded-md transition-all
                                           bg-red-500/5 dark:bg-red-500/10 
                                           border border-red-500/20 hover:border-red-500/50
                                           text-red-600 dark:text-red-400"
                            >
                                {word}
                            </span>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-4 shadow-2xl border-border-main bg-surface">
                            <div className="space-y-1">
                                <div className="flex justify-between items-start">
                                    <Typography
                                        variant="hanzi"
                                        className="text-2xl font-bold"
                                    >
                                        {card.traditional}
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        className="bg-ink/5 px-1.5 rounded text-[10px] font-bold"
                                    >
                                        B{card.location.book} L
                                        {card.location.lesson}
                                    </Typography>
                                </div>
                                <Typography
                                    variant="pinyin"
                                    className="text-blue-500 font-medium"
                                >
                                    {card.pinyin}
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="block pt-2 border-t mt-2 opacity-90 leading-snug"
                                >
                                    {card.meaning}
                                </Typography>
                            </div>
                        </PopoverContent>
                    </Popover>,
                );
                i += len;
                found = true;
                break;
            }
        }
        if (!found) {
            rendered.push(text[i]);
            i++;
        }
    }

    return <>{rendered}</>;
};
