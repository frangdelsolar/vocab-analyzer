// @/components/status/ProgressSelectors.tsx
'use client';

import { BookOpen, Layers, ListFilter } from 'lucide-react';
import { StatusSelect } from '../IdentitySettings'; // Reusing your existing selector UI

interface ProgressSelectorsProps {
    progress: { book: number; lesson: number; section: number };
    metadata: any; // Ideally typed to your Metadata interface
    onUpdate: (update: any) => void;
}

export function ProgressSelectors({
    progress,
    metadata,
    onUpdate,
}: ProgressSelectorsProps) {
    // Memoize options to prevent "shimmering" on re-renders
    const availableBooks = Object.keys(metadata.books)
        .map(Number)
        .sort((a, b) => a - b);

    const availableLessons = Object.keys(
        metadata.books[progress.book]?.lessons || {},
    )
        .map(Number)
        .sort((a, b) => a - b);

    const availableSections =
        metadata.books[progress.book]?.lessons[progress.lesson]?.sections || [];

    return (
        <div className="flex flex-wrap items-center gap-3">
            <StatusSelect
                icon={BookOpen}
                label="Book"
                value={progress.book}
                options={availableBooks}
                onChange={(v: number) =>
                    onUpdate({
                        book: v,
                        lesson: 1,
                        section: 1,
                    })
                }
            />
            <StatusSelect
                icon={Layers}
                label="Lesson"
                value={progress.lesson}
                options={availableLessons}
                onChange={(v: number) => onUpdate({ lesson: v, section: 1 })}
            />
            <StatusSelect
                icon={ListFilter}
                label="Part"
                value={progress.section}
                options={availableSections}
                onChange={(v: number) => onUpdate({ section: v })}
            />
        </div>
    );
}
