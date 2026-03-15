'use client';

import { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { PageHeader } from '@/components/layout/PageHeader';
import { useVocabulary } from '@/context/VocabularyContext';
import VocabExplorerControls from '../vocabulary/_components/VocabExplorerControls';
import FlashcardStudy from './_components/FlashcardStudy';
import StudyDashboard from './_components/StudyDashboard';
import { PlayCircle } from 'lucide-react';

export default function StudyPage() {
    const { filteredList } = useVocabulary();
    const [isStarted, setIsStarted] = useState(false);
    const [visibility, setVisibility] = useState({
        character: true,
        pinyin: true,
        meaning: true,
        simplified: false,
    });

    if (isStarted) {
        return (
            <Shell>
                <div className="py-8 animate-in zoom-in-95 duration-500">
                    <button
                        onClick={() => setIsStarted(false)}
                        className="mb-12 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 hover:opacity-100 transition-all mx-auto block"
                    >
                        ← Exit to Dashboard
                    </button>
                    <FlashcardStudy vocabList={filteredList} />
                </div>
            </Shell>
        );
    }

    return (
        <Shell>
            <PageHeader
                overline="Review Mode"
                title="Active Recall"
                description="Manage your progress and start your daily study session."
            />

            <StudyDashboard />

            <div className="bg-surface border border-border-main rounded-[2.5rem] p-10">
                <VocabExplorerControls
                    visibility={visibility}
                    onToggleVisibility={(key) =>
                        setVisibility((v) => ({ ...v, [key]: !v[key] }))
                    }
                />

                <button
                    onClick={() => setIsStarted(true)}
                    disabled={filteredList.length === 0}
                    className="w-full mt-8 py-5 bg-red-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.01] transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 disabled:opacity-20"
                >
                    <PlayCircle size={18} /> Start with {filteredList.length}{' '}
                    Cards
                </button>
            </div>
        </Shell>
    );
}
