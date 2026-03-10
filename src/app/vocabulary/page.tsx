'use client';

import { useState, useEffect } from 'react';
import { useVocabulary } from '@/context/VocabularyContext';
import { useUser } from '@/context/UserContext';
import VocabExplorerControls from './_components/VocabExplorerControls';
import VocabTable from './_components/VocabTable';
import VocabMediaBar from './_components/VocabMediaBar'; // New Component
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
    const {
        filteredList,
        isLoading: vocabLoading,
        settings,
        setSettings,
    } = useVocabulary();
    const { isHydrated: userHydrated, progress: userProgress } = useUser();

    const [visibility, setVisibility] = useState<VisibilitySettings>({
        character: true,
        pinyin: true,
        meaning: true,
        simplified: false,
    });

    // --- Media State ---
    const [activeLessonData, setActiveLessonData] = useState<{
        videoUrl: string | null;
        title: string | null;
    }>({ videoUrl: null, title: null });

    useEffect(() => {
        if (userHydrated) {
            setSettings((prev) => ({ ...prev, scope: 'user' }));
        }
    }, [userHydrated, setSettings]);

    // --- Sync Media Bar with Selection ---
    useEffect(() => {
        const updateMediaSource = async () => {
            // Determine which book/lesson to fetch based on current scope
            const b =
                settings.scope === 'user'
                    ? userProgress.book
                    : settings.explorer.b;
            const l =
                settings.scope === 'user'
                    ? userProgress.lesson
                    : settings.explorer.l;
            const p =
                settings.scope === 'user'
                    ? userProgress.section
                    : settings.explorer.p;

            const filename = `${String(b).padStart(2, '0')}${String(l).padStart(2, '0')}${String(p).padStart(2, '0')}.json`;

            try {
                // Assuming your JSONs are in public/data/lessons/
                const res = await fetch(`/dialogues/${filename}`);
                if (res.ok) {
                    const data = await res.json();
                    setActiveLessonData({
                        videoUrl: data.vocabulary_video_url || null,
                        title: data.title || `Book ${b} Lesson ${l}`,
                    });
                }
            } catch (error) {
                console.error(
                    'Could not load lesson metadata for media bar',
                    error,
                );
            }
        };

        updateMediaSource();
    }, [settings.explorer, settings.scope, userProgress, userHydrated]);

    const toggleVisibility = (key: keyof VisibilitySettings) => {
        setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    };

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

            <div className="space-y-8 pb-32">
                {' '}
                {/* Added padding for media bar clearance */}
                <div className="sticky top-0 z-30 py-4 -mt-4 bg-paper-light/80 dark:bg-paper-dark/80 backdrop-blur-md">
                    <VocabExplorerControls
                        visibility={visibility}
                        onToggleVisibility={toggleVisibility}
                    />
                </div>
                <VocabTable
                    data={filteredList}
                    isLoading={isLoading}
                    visibility={visibility}
                    searchQuery={settings.searchQuery}
                />
            </div>

            {/* Floating Media Bar */}
            <VocabMediaBar
                videoUrl={activeLessonData.videoUrl}
                title={activeLessonData.title || ''}
            />
        </Shell>
    );
}
