'use client';

import { useState, useMemo } from 'react';
import { Shell } from '@/components/layout/Shell';
import { PageHeader } from '@/components/layout/PageHeader';
import { useVocabulary } from '@/context/VocabularyContext';
import { useStorage } from '@/context/StorageContext';
import VocabExplorerControls from '../vocabulary/_components/VocabExplorerControls';
import FlashcardStudy from './_components/FlashcardStudy';
import StudyDashboard from './_components/StudyDashboard';
import { PlayCircle, Sparkles } from 'lucide-react';
import { Typography } from '@/components/ui';

export default function StudyPage() {
    const { filteredList } = useVocabulary();
    const { studyData } = useStorage();

    const [isStarted, setIsStarted] = useState(false);
    const [visibility, setVisibility] = useState({
        character: true,
        pinyin: true,
        meaning: true,
        simplified: false,
    });

    // Compute the list of cards that are actually due or new
    const dueList = useMemo(() => {
        const now = Date.now();
        return filteredList.filter((card) => {
            const progress = studyData[card.guid];
            // If card has never been seen OR the due date has passed
            return !progress || progress.due <= now;
        });
    }, [filteredList, studyData]);

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
                    {/* Pass only the dueList to the study session */}
                    <FlashcardStudy vocabList={dueList} />
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
                <div className="mb-8">
                    <VocabExplorerControls
                        visibility={visibility}
                        onToggleVisibility={(key) =>
                            setVisibility((v) => ({ ...v, [key]: !v[key] }))
                        }
                    />
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => setIsStarted(true)}
                        disabled={dueList.length === 0}
                        className="w-full py-6 bg-red-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.01] transition-all shadow-xl shadow-red-500/20 flex flex-col items-center justify-center gap-2 disabled:opacity-20 disabled:grayscale disabled:hover:scale-100"
                    >
                        <div className="flex items-center gap-3">
                            <PlayCircle size={20} />
                            <span>Start Due Session</span>
                        </div>
                        <span className="text-[9px] opacity-60 tracking-widest font-bold">
                            {dueList.length} Cards Ready for Review
                        </span>
                    </button>

                    {dueList.length === 0 && filteredList.length > 0 && (
                        <div className="flex items-center justify-center gap-2 py-4 animate-in fade-in slide-in-from-top-2">
                            <Sparkles size={14} className="text-orange-400" />
                            <Typography
                                variant="small"
                                className="text-[10px] font-black uppercase tracking-widest opacity-40"
                            >
                                Everything is currently memorized.
                            </Typography>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-8 border-t border-border-main/50 flex justify-between items-center px-2">
                    <Typography
                        variant="small"
                        className="text-[10px] font-black uppercase opacity-20 tracking-widest"
                    >
                        Total Pool: {filteredList.length}
                    </Typography>
                    <Typography
                        variant="small"
                        className="text-[10px] font-black uppercase opacity-20 tracking-widest"
                    >
                        New/Due: {dueList.length}
                    </Typography>
                </div>
            </div>
        </Shell>
    );
}
