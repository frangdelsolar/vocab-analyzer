'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Play,
    Pause,
    Music2,
    ExternalLink,
    Minus,
    Maximize2,
} from 'lucide-react';
import { Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

interface VocabMediaBarProps {
    videoUrl: string | null;
    title?: string;
}

export default function VocabMediaBar({ videoUrl, title }: VocabMediaBarProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // For Draggable positioning (simple version)
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);

    const getYouTubeId = (url: string) => {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    useEffect(() => {
        if (videoUrl) {
            setIsVisible(true);
            // Auto-expand when a new valid URL is detected
            setIsMinimized(false);
        }
    }, [videoUrl]);

    if (!videoUrl || !isVisible) return null;

    const videoId = getYouTubeId(videoUrl);

    return (
        <>
            {/* 1. The Main Expanded Bar */}
            <div
                className={cn(
                    'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out',
                    isMinimized
                        ? 'scale-0 opacity-0 pointer-events-none'
                        : 'scale-100 opacity-100',
                )}
            >
                <div className="bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-xl border border-border-main/50 shadow-2xl rounded-2xl p-3 flex items-center gap-4 min-w-[340px] max-w-md ring-1 ring-black/5">
                    {/* Video Preview */}
                    <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-black group flex-shrink-0 border border-white/10">
                        {isPlaying ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1`}
                                className="w-full h-full pointer-events-none"
                                allow="autoplay"
                            />
                        ) : (
                            <img
                                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                className="w-full h-full object-cover opacity-60"
                                alt="thumbnail"
                            />
                        )}
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors"
                        >
                            {isPlaying ? (
                                <Pause
                                    className="text-white fill-white"
                                    size={20}
                                />
                            ) : (
                                <Play
                                    className="text-white fill-white"
                                    size={20}
                                />
                            )}
                        </button>
                    </div>

                    <div className="flex-1 min-w-0">
                        <Typography
                            variant="small"
                            className="text-red-500 font-black uppercase text-[9px] tracking-widest flex items-center gap-1.5 mb-0.5"
                        >
                            <Music2 size={10} /> Dictation Audio
                        </Typography>
                        <Typography
                            variant="p"
                            className="text-xs font-bold truncate opacity-80 leading-tight"
                        >
                            {title || 'Lesson Vocabulary'}
                        </Typography>
                    </div>

                    <div className="flex items-center gap-1">
                        <a
                            href={videoUrl}
                            target="_blank"
                            className="p-2 hover:bg-ink/5 rounded-full transition-colors opacity-40 hover:opacity-100"
                        >
                            <ExternalLink size={14} />
                        </a>
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="p-2 hover:bg-ink/5 rounded-full transition-colors opacity-40 hover:opacity-100"
                        >
                            <Minus size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. The Minimized Draggable FAB */}
            <div
                className={cn(
                    'fixed bottom-8 right-8 z-50 transition-all duration-300 group',
                    !isMinimized
                        ? 'scale-0 opacity-0 pointer-events-none'
                        : 'scale-100 opacity-100',
                )}
            >
                <button
                    onClick={() => setIsMinimized(false)}
                    className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ring-4 ring-white/10"
                >
                    <div className="relative">
                        <Music2
                            size={24}
                            className={cn(isPlaying && 'animate-bounce')}
                        />
                        {isPlaying && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-red-500 rounded-full animate-pulse" />
                        )}
                    </div>
                </button>
            </div>
        </>
    );
}
