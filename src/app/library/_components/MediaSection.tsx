'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Typography } from '@/components/ui';
import { Play, Headphones, Clock, Loader2 } from 'lucide-react';
import { useVocabulary } from '@/context/VocabularyContext';
import { cn } from '@/lib/utils';

interface DialogueData {
    title: string;
    video_url?: string;
    vocabulary_video_url?: string;
    lesson_number?: number;
    lesson?: number;
    part?: number;
    section?: number;
    dialogue_id: string;
    book_number?: number;
}

export function MediaSection() {
    const { dialogueManifest, isLoading: vocabLoading } = useVocabulary();
    const [mediaItems, setMediaItems] = useState<DialogueData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllDialogues = async () => {
            if (dialogueManifest.length === 0) return;
            try {
                const requests = dialogueManifest.map((file) =>
                    fetch(`/dialogues/${file}`).then(async (res) => {
                        const data = await res.json();
                        const book_number = parseInt(file.substring(0, 2));
                        return { ...data, book_number };
                    }),
                );
                const results = await Promise.all(requests);
                setMediaItems(results);
            } catch (err) {
                console.error('Failed to load media manifest details:', err);
            } finally {
                setLoading(false);
            }
        };

        if (!vocabLoading) fetchAllDialogues();
    }, [dialogueManifest, vocabLoading]);

    const contentVideos = useMemo(
        () =>
            mediaItems
                .filter((item) => item.video_url)
                .sort((a, b) => {
                    const aL = a.lesson_number || a.lesson || 0;
                    const bL = b.lesson_number || b.lesson || 0;
                    return (
                        (a.book_number || 0) - (b.book_number || 0) || aL - bL
                    );
                }),
        [mediaItems],
    );

    const dictationVideos = useMemo(
        () =>
            mediaItems
                .filter((item) => item.vocabulary_video_url)
                .sort((a, b) => {
                    const aL = a.lesson_number || a.lesson || 0;
                    const bL = b.lesson_number || b.lesson || 0;
                    return (
                        (a.book_number || 0) - (b.book_number || 0) || aL - bL
                    );
                }),
        [mediaItems],
    );

    if (loading || vocabLoading)
        return (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <Loader2 className="animate-spin mb-2" />
                <Typography
                    variant="small"
                    className="font-bold uppercase tracking-widest"
                >
                    Loading Media...
                </Typography>
            </div>
        );

    return (
        <section className="space-y-12 pb-20">
            <MediaRow
                title="Lesson Dialogues"
                icon={<Play size={18} fill="currentColor" />}
                accentColor="text-red-500"
                bgColor="bg-red-500/10"
                items={contentVideos}
                useVocabUrl={false}
            />

            <MediaRow
                title="Vocabulary & Dictation"
                icon={<Headphones size={18} />}
                accentColor="text-blue-500"
                bgColor="bg-blue-500/10"
                items={dictationVideos}
                useVocabUrl={true}
            />
        </section>
    );
}

function MediaRow({
    title,
    icon,
    accentColor,
    bgColor,
    items,
    useVocabUrl,
}: any) {
    if (items.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', bgColor, accentColor)}>
                        {icon}
                    </div>
                    <Typography
                        variant="h3"
                        className="text-xl font-black tracking-tighter"
                    >
                        {title}
                    </Typography>
                </div>
            </div>

            {/* REMOVED 'group' FROM HERE */}
            <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-1">
                    {items.map((item: DialogueData, idx: number) => {
                        const lesson = item.lesson_number || item.lesson;
                        const part = item.part || item.section;
                        const book = item.book_number;

                        return (
                            <MediaCard
                                key={`${item.dialogue_id}-${idx}`}
                                title={item.title}
                                subtitle={`Vol ${book} • L${lesson} • Part ${part}`}
                                url={
                                    useVocabUrl
                                        ? item.vocabulary_video_url
                                        : item.video_url
                                }
                                type={useVocabUrl ? 'audio' : 'video'}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function MediaCard({
    title,
    subtitle,
    url,
    type,
}: {
    title: string;
    subtitle: string;
    url?: string;
    type: 'video' | 'audio';
}) {
    const getYouTubeId = (url?: string) => {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeId(url);
    const thumbnailUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        : null;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none w-[280px] md:w-[320px] snap-start block group"
        >
            <div className="relative aspect-video bg-ink/[0.03] dark:bg-white/[0.03] rounded-2xl border border-border-main/50 overflow-hidden transition-all hover:border-red-500/30">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <Play size={40} />
                    </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl',
                            'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
                            type === 'video'
                                ? 'bg-red-500 text-white shadow-red-500/40'
                                : 'bg-white text-black shadow-white/20',
                        )}
                    >
                        {type === 'video' ? (
                            <Play size={20} fill="currentColor" />
                        ) : (
                            <Headphones size={20} />
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-3 px-1">
                <Typography
                    variant="small"
                    className="font-black block leading-none text-sm tracking-tight group-hover:text-red-500 transition-colors"
                >
                    {title}
                </Typography>
                <Typography
                    variant="p"
                    className="text-[11px] opacity-40 font-medium uppercase tracking-tighter mt-1"
                >
                    {subtitle}
                </Typography>
            </div>
        </a>
    );
}
