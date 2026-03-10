'use client';

import { useState } from 'react';
import { useVocabulary } from '@/context/VocabularyContext';
import VocabExplorerControls from './_components/VocabExplorerControls';
import VocabTable from './_components/VocabTable';
import { PageHeader } from '@/components/layout/PageHeader';
import { Typography } from '@/components/ui/typography';
import { Shell } from '@/components/layout/Shell';

export type VisibilitySettings = {
    character: boolean;
    pinyin: boolean;
    meaning: boolean;
    simplified: boolean;
};

export default function VocabularyPage() {
    const { filteredMap, isLoading, settings } = useVocabulary();

    // Internal UI state for study mode (not in context)
    const [visibility, setVisibility] = useState<VisibilitySettings>({
        character: true,
        pinyin: true,
        meaning: true,
        simplified: false,
    });

    const toggleVisibility = (key: keyof VisibilitySettings) => {
        setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const vocabList = Array.from(filteredMap.values());

    return (
        <Shell>
            <PageHeader
                overline="Language Resources"
                title="Vocabulary Explorer"
                description="Master characters across the Contemporary Chinese series with smart filtering."
                rightElement={
                    <div className="bg-ink/5 border border-border-main/50 rounded-2xl p-4 flex flex-col items-end">
                        <Typography
                            variant="small"
                            className="opacity-40 font-black uppercase text-[10px] tracking-widest"
                        >
                            Results Found
                        </Typography>
                        <Typography
                            variant="h2"
                            className="text-red-500 font-black leading-none mt-1"
                        >
                            {vocabList.length}
                        </Typography>
                    </div>
                }
            />

            <div className="space-y-8">
                <div className="sticky top-0 z-30 py-4 -mt-4 bg-paper-light/80 dark:bg-paper-dark/80 backdrop-blur-md">
                    <VocabExplorerControls
                        visibility={visibility}
                        onToggleVisibility={toggleVisibility}
                    />
                </div>

                <VocabTable
                    data={vocabList}
                    isLoading={isLoading}
                    visibility={visibility}
                    searchQuery={settings.searchQuery}
                />
            </div>
        </Shell>
    );
}
