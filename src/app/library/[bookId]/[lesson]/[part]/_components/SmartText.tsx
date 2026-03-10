'use client';

import { useVocabulary } from '@/context/VocabularyContext';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export const SmartText = ({ text }: { text: string }) => {
    const { filteredMap, isLoading } = useVocabulary();

    if (isLoading) return <>{text}</>;

    let rendered = [];
    let i = 0;
    while (i < text.length) {
        let found = false;
        // Check for words up to 4 chars long
        for (let len = 4; len >= 1; len--) {
            const word = text.substring(i, i + len);
            const card = filteredMap.get(word);

            if (card) {
                rendered.push(
                    <Popover key={`${i}-${word}`}>
                        <PopoverTrigger asChild>
                            <span
                                className="inline-flex items-center mx-[2px] mr-1.5 pl-1 pr-1.5 py-[1px]
                               rounded-lg cursor-help transition-all duration-300
                               bg-yellow-100 dark:bg-yellow-500/10 
                               border-b-2 border-r-4 border-yellow-400/30
                               hover:bg-yellow-200 dark:hover:bg-yellow-500/30
                               hover:shadow-md hover:border-yellow-400"
                            >
                                {word}
                            </span>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-4 shadow-2xl">
                            <div className="space-y-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-2xl font-bold font-kaiti">
                                        {card.traditional}
                                    </span>
                                    <span className="text-[10px] bg-ink/5 px-1.5 rounded">
                                        B{card.location.book} L
                                        {card.location.lesson}
                                    </span>
                                </div>
                                <p className="text-blue-500 font-medium italic">
                                    {card.pinyin}
                                </p>
                                <p className="text-sm opacity-80 pt-2 border-t mt-2">
                                    {card.meaning}
                                </p>
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
