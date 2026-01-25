import React, { useState, useEffect, useMemo } from 'react';
import { useDialogues } from '../contexts/DialoguesContext';
import DialoguePreview from './DialoguePreview';

// --- Sub-component: Dialogue Item ---
const DialogueItem = ({ dialogue, isSelected, onClick }) => (
    <button
        onClick={() => onClick(dialogue)}
        className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-all ${
            isSelected
                ? 'bg-blue-50 border-blue-300 shadow-sm ring-1 ring-blue-200'
                : 'border border-gray-100 hover:bg-gray-50'
        }`}
    >
        <div>
            <div
                className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}
            >
                {dialogue.title}
            </div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                {dialogue.type} • Part {dialogue.dialogue}
            </div>
        </div>
        <div
            className={`text-xs ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}
        >
            {isSelected ? '●' : '○'}
        </div>
    </button>
);

// --- Sub-component: Lesson Group ---
const LessonGroup = ({
    book,
    lesson,
    dialogues,
    expanded,
    onToggle,
    selectedId,
    onSelect,
}) => {
    const key = `${book}-${lesson}`;
    return (
        <div className="border-t border-gray-100">
            <button
                onClick={() => onToggle(key)}
                className="px-8 py-3 w-full flex items-center justify-between bg-gray-50/50 hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span
                        className={`text-xs transition-transform ${expanded ? 'rotate-90' : ''}`}
                    >
                        ▶
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                        Lesson {lesson}
                    </span>
                </div>
                <span className="text-xs text-gray-500">
                    {dialogues.length} parts
                </span>
            </button>
            {expanded && (
                <div className="px-10 py-3 space-y-2 bg-white">
                    {dialogues.map((d) => (
                        <DialogueItem
                            key={d.id}
                            dialogue={d}
                            isSelected={selectedId === d.id}
                            onClick={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Main Component ---
const DialoguesList = () => {
    const { dialogues, isLoading, error, loadDialogueContent } = useDialogues();
    const [expandedBooks, setExpandedBooks] = useState({});
    const [expandedLessons, setExpandedLessons] = useState({});
    const [selectedDialogue, setSelectedDialogue] = useState(null);
    const [dialogueContent, setDialogueContent] = useState(null);
    const [isMainExpanded, setIsMainExpanded] = useState(true);
    const [loadingContent, setLoadingContent] = useState(false);

    // Grouping Logic (Memoized for performance)
    const books = useMemo(() => {
        const grouped = {};
        dialogues.forEach((d) => {
            if (!grouped[d.book]) grouped[d.book] = { id: d.book, lessons: {} };
            if (!grouped[d.book].lessons[d.lesson])
                grouped[d.book].lessons[d.lesson] = [];
            grouped[d.book].lessons[d.lesson].push(d);
        });
        return Object.values(grouped).sort((a, b) => a.id - b.id);
    }, [dialogues]);

    useEffect(() => {
        const loadContent = async () => {
            if (selectedDialogue) {
                setLoadingContent(true);
                try {
                    const content = await loadDialogueContent(
                        selectedDialogue.filename,
                    );
                    setDialogueContent(content);
                } catch (e) {
                    console.error('Failed to load dialogue', e);
                } finally {
                    setLoadingContent(false);
                }
            }
        };
        loadContent();
    }, [selectedDialogue, loadDialogueContent]);

    if (isLoading)
        return (
            <div className="p-10 text-center animate-pulse text-gray-400">
                Loading curriculum...
            </div>
        );
    if (error)
        return (
            <div className="p-10 text-center text-red-500">Error: {error}</div>
        );

    return (
        <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Main Accordion Header */}
            <button
                onClick={() => setIsMainExpanded(!isMainExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                    <div className="text-left">
                        <h2 className="text-lg font-bold text-gray-900">
                            Curriculum Explorer
                        </h2>
                        <p className="text-xs text-gray-500 uppercase font-semibold">
                            Contemporary Chinese Series
                        </p>
                    </div>
                </div>
                <span
                    className={`transform transition-transform ${isMainExpanded ? 'rotate-180' : ''}`}
                >
                    ▼
                </span>
            </button>

            {isMainExpanded && (
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
                    {/* Left Navigation Tree */}
                    <div className="lg:col-span-4 border-r border-gray-100 bg-gray-50/30 overflow-y-auto max-h-[800px]">
                        <div className="p-4 space-y-4">
                            {books.map((book) => (
                                <div
                                    key={book.id}
                                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                                >
                                    <button
                                        onClick={() =>
                                            setExpandedBooks((prev) => ({
                                                ...prev,
                                                [book.id]: !prev[book.id],
                                            }))
                                        }
                                        className="w-full px-4 py-3 flex items-center justify-between bg-white border-b border-gray-100"
                                    >
                                        <span className="font-bold text-gray-800 italic">
                                            Book {book.id}
                                        </span>
                                        <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase">
                                            {Object.keys(book.lessons).length}{' '}
                                            Lessons
                                        </span>
                                    </button>

                                    {expandedBooks[book.id] && (
                                        <div className="divide-y divide-gray-50">
                                            {Object.entries(book.lessons)
                                                .sort(([a], [b]) => a - b)
                                                .map(
                                                    ([
                                                        lessonNum,
                                                        dialogues,
                                                    ]) => (
                                                        <LessonGroup
                                                            key={lessonNum}
                                                            book={book.id}
                                                            lesson={lessonNum}
                                                            dialogues={
                                                                dialogues
                                                            }
                                                            expanded={
                                                                expandedLessons[
                                                                    `${book.id}-${lessonNum}`
                                                                ]
                                                            }
                                                            onToggle={(key) =>
                                                                setExpandedLessons(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [key]: !prev[
                                                                            key
                                                                        ],
                                                                    }),
                                                                )
                                                            }
                                                            selectedId={
                                                                selectedDialogue?.id
                                                            }
                                                            onSelect={
                                                                setSelectedDialogue
                                                            }
                                                        />
                                                    ),
                                                )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Preview Pane */}
                    <div className="lg:col-span-8 p-6 bg-white">
                        <div className="h-full border-2 border-dashed border-gray-100 rounded-2xl p-4">
                            <DialoguePreview
                                dialogue={selectedDialogue}
                                content={dialogueContent}
                                isLoading={loadingContent}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DialoguesList;
