'use client';

import { useState, useEffect } from 'react';
import { useVocabulary } from '@/context/VocabularyContext';
import { useUser } from '@/context/UserContext';
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
    // 1. Context Integration
    const {
        filteredList,
        isLoading: vocabLoading,
        settings,
        setSettings,
    } = useVocabulary();
    const { isHydrated: userHydrated } = useUser();

    // 2. Study Mode State (Page-level visibility)
    const [visibility, setVisibility] = useState<VisibilitySettings>({
        character: true,
        pinyin: true,
        meaning: true,
        simplified: false,
    });

    // 3. Logic: Ensure we default to 'user' scope once user progress is loaded
    useEffect(() => {
        if (userHydrated) {
            setSettings((prev) => ({ ...prev, scope: 'user' }));
        }
    }, [userHydrated, setSettings]);

    const toggleVisibility = (key: keyof VisibilitySettings) => {
        setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Combine loading states
    const isLoading = vocabLoading || !userHydrated;

    return (
        <Shell>
            <PageHeader
                overline="Language Resources"
                title="Vocabulary Explorer"
                description="Master characters from your current lessons or explore the full series."
                rightElement={
                    <div className="bg-ink/5 border border-border-main/50 rounded-2xl p-4 flex flex-col items-end min-w-[120px]">
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
                            {filteredList.length}
                        </Typography>
                    </div>
                }
            />

            <div className="space-y-8">
                {/* Sticky Controls bar */}
                <div className="sticky top-0 z-30 py-4 -mt-4 bg-paper-light/80 dark:bg-paper-dark/80 backdrop-blur-md">
                    <VocabExplorerControls
                        visibility={visibility}
                        onToggleVisibility={toggleVisibility}
                    />
                </div>

                {/* The Main Data Grid */}
                <VocabTable
                    data={filteredList}
                    isLoading={isLoading}
                    visibility={visibility}
                    searchQuery={settings.searchQuery}
                />
            </div>
        </Shell>
    );
}
