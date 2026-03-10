// components/library/LessonAccordion.tsx
'use client';
import { Typography } from '@/components/ui';
import { ChevronDown, MessageSquare, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const LessonAccordion = ({
    bookId = '', // Provide a default empty string
    lessonNum,
    manifest = [], // Provide a default empty array
}: {
    bookId: string;
    lessonNum: number;
    manifest: string[];
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // 1. Sanitize bookId: Extract number if it's "book-1", otherwise use as is
    const cleanBookId = bookId.includes('-') ? bookId.split('-')[1] : bookId;

    // 2. Safe padding: Check if cleanBookId exists before calling padStart
    const bookPrefix = (cleanBookId || '').padStart(2, '0');
    const lessonPrefix = (lessonNum || 0).toString().padStart(2, '0');

    const parts = manifest.filter((f) =>
        f.startsWith(`${bookPrefix}${lessonPrefix}`),
    );

    return (
        <div className="border border-border-main rounded-xl bg-surface overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between hover:bg-ink/5"
            >
                <Typography variant="small" className="font-bold text-ink">
                    Lesson {lessonNum}
                </Typography>
                <ChevronDown
                    size={14}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="p-2 bg-ink/[0.02] space-y-1 border-t border-border-main">
                    {parts.map((file) => {
                        const partNum = parseInt(file.slice(4, 6));
                        const isReading =
                            parseInt(bookPrefix) >= 2 && partNum === 2;

                        return (
                            <Link
                                key={file}
                                href={`/library/book-${parseInt(bookPrefix)}/${lessonNum}/${partNum}`}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface text-xs font-medium text-ink/70 hover:text-red-500 transition-all"
                            >
                                {isReading ? (
                                    <BookOpen size={14} />
                                ) : (
                                    <MessageSquare size={14} />
                                )}
                                {isReading ? 'Reading' : `Dialogue ${partNum}`}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
