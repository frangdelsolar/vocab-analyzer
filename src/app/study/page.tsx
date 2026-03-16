// @/app/study/page.tsx
'use client';

import { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { PageHeader } from '@/components/layout/PageHeader';
import VocabExplorerControls from '../vocabulary/_components/VocabExplorerControls';
import { Typography } from '@/components/ui';
import { useVocabulary } from '@/context/VocabularyContext';

export type VisibilitySettings = {
    character: boolean;
    pinyin: boolean;
    meaning: boolean;
    simplified: boolean;
    showSimplified: boolean;
};

export default function StudyPage() {
    const { filteredList } = useVocabulary();

    // Visibility state to satisfy the Controls component requirements
    const [visibility, setVisibility] = useState<VisibilitySettings>({
        character: true,
        pinyin: true,
        meaning: true,
        simplified: true,
        showSimplified: false,
    });

    const toggleVisibility = (key: keyof VisibilitySettings) => {
        setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Shell>
            <PageHeader
                overline="Review Mode"
                title="Active Recall"
                description="Manage your progress and start your daily study session."
                rightElement={
                    <div className="bg-ink/5 border border-border-main/50 rounded-2xl p-4 flex flex-col items-end min-w-[120px]">
                        <Typography
                            variant="small"
                            className="opacity-40 font-black uppercase text-[10px] tracking-widest"
                        >
                            Cards in Queue
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

            <div className="space-y-8 mt-8">
                {/* The Controls component now allows the user to filter 
                    the 'filteredList' from VocabContext specifically for this session.
                */}
                <VocabExplorerControls
                    visibility={visibility}
                    onToggleVisibility={toggleVisibility}
                />

                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border-main/20 rounded-[3rem]">
                    <Typography variant="p" className="opacity-40 italic">
                        Ready to study {filteredList.length} cards?
                    </Typography>
                    {/* Flashcard component will go here next */}
                </div>
            </div>
        </Shell>
    );
}
