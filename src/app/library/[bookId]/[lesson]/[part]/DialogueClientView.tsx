'use client';

import React from 'react';
import { useEffect, useState, use } from 'react';
import { getDialogue, DialogueData } from '@/lib/dialogue-utils';
import { Shell } from '@/components/layout/Shell';
import { Typography } from '@/components/ui';
import { Youtube } from 'lucide-react';
import { useVocabulary } from '@/context/VocabularyContext';

import { PageHeader } from '@/components/layout/PageHeader';
import { useParticipantColors } from './_components/UseParticipantColors';
import ContentLine from './_components/ContentLine';
import PinyinSidebar from './_components/PinyinSidebar';

import StudySettingsControl from '@/components/StudySettingsControl';

export default function DialogueClienView({
    params,
}: {
    params: Promise<{ bookId: string; lesson: string; part: string }>;
}) {
    const resolvedParams = use(params);
    const { bookId, lesson, part } = resolvedParams;
    const [data, setData] = useState<DialogueData | null>(null);
    const bookNum = bookId.replace('book-', '');

    const { setSettings, isLoading: isVocabLoading } = useVocabulary();

    // Sync Page State to Global Vocabulary Context
    useEffect(() => {
        setSettings({
            book: parseInt(bookNum),
            lesson: parseInt(lesson),
            section: part,
        });
    }, [bookNum, lesson, part, setSettings]);

    useEffect(() => {
        getDialogue(bookNum, lesson, part).then(setData);
    }, [bookNum, lesson, part]);

    const colorMap = useParticipantColors(data?.participants);

    if (!data || isVocabLoading) {
        return (
            <Shell>
                <div className="flex flex-col h-96 items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                    <Typography
                        variant="p"
                        className="opacity-50 font-bold uppercase tracking-widest text-xs"
                    >
                        {isVocabLoading
                            ? 'Indexing Vocabulary Cards...'
                            : 'Loading lesson...'}
                    </Typography>
                </div>
            </Shell>
        );
    }

    const getYTId = (url: string) => {
        const match = url?.match(
            /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{11})/,
        );
        return match ? match[1] : null;
    };

    const videoId = getYTId(data.video_url || '');

    return (
        <Shell>
            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* LEFT: MAIN CONTENT (Chars Only) */}
                <div className="flex-1 w-full space-y-8 max-w-3xl">
                    <PageHeader
                        title={data.title}
                        badges={
                            <>
                                <span className="px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase">
                                    Book {bookNum}
                                </span>
                                <span className="px-2.5 py-0.5 bg-ink/5 text-ink/60 text-[10px] font-bold rounded-full uppercase">
                                    Lesson {data.lesson_number}
                                </span>
                            </>
                        }
                    />

                    <StudySettingsControl />

                    <div className="space-y-5">
                        {data.content.map((item, i) => (
                            <ContentLine
                                key={i}
                                item={item}
                                isReading={data.dialogue_id === 'reading'}
                                theme={
                                    item.speaker
                                        ? colorMap[item.speaker]
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT: VIDEO & PINYIN GUIDE (Sticky) */}
                <aside className="w-full lg:w-[380px] lg:sticky lg:top-12 space-y-6 flex flex-col h-[calc(100vh-80px)]">
                    {/* Video Player */}
                    <div className="shrink-0 aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
                        {videoId ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                allowFullScreen
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                                <Youtube size={48} />
                            </div>
                        )}
                    </div>

                    {/* Scrollable Pinyin Section */}
                    <PinyinSidebar content={data.content} colorMap={colorMap} />
                </aside>
            </div>
        </Shell>
    );
}
