import React, { useState, useEffect } from 'react';
import { useDialogues } from '../contexts/DialoguesContext';
import DialoguePreview from './DialoguePreview';

const DialoguesList = () => {
    const { dialogues, isLoading, error, loadDialogueContent } = useDialogues();
    const [expandedBooks, setExpandedBooks] = useState({});
    const [expandedLessons, setExpandedLessons] = useState({});
    const [selectedDialogue, setSelectedDialogue] = useState(null);
    const [dialogueContent, setDialogueContent] = useState(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const [loadingContent, setLoadingContent] = useState(false);

    // Load dialogue content when selected
    useEffect(() => {
        const loadContent = async () => {
            if (selectedDialogue) {
                setLoadingContent(true);
                const content = await loadDialogueContent(
                    selectedDialogue.filename
                );
                setDialogueContent(content);
                setLoadingContent(false);
            } else {
                setDialogueContent(null);
            }
        };

        loadContent();
    }, [selectedDialogue, loadDialogueContent]);

    if (isLoading) {
        return (
            <div className="mb-6 bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-center py-8 text-gray-600">
                    Loading dialogues...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-6 bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-center py-8 text-red-600">
                    Error: {error}
                </div>
            </div>
        );
    }

    // Group dialogues by book and lesson
    const groupedDialogues = {};
    dialogues.forEach((dialogue) => {
        const { book, lesson } = dialogue;

        if (!groupedDialogues[book]) {
            groupedDialogues[book] = {
                book,
                lessons: {},
            };
        }

        if (!groupedDialogues[book].lessons[lesson]) {
            groupedDialogues[book].lessons[lesson] = {
                book,
                lesson,
                dialogues: [],
            };
        }

        groupedDialogues[book].lessons[lesson].dialogues.push(dialogue);
    });

    const toggleBookExpansion = (book) => {
        setExpandedBooks((prev) => ({
            ...prev,
            [book]: !prev[book],
        }));
    };

    const toggleLessonExpansion = (book, lesson) => {
        const key = `${book}-${lesson}`;
        setExpandedLessons((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleDialogueClick = (dialogue) => {
        setSelectedDialogue(dialogue);
    };

    const books = Object.values(groupedDialogues).sort(
        (a, b) => a.book - b.book
    );

    return (
        <div className="mb-6 bg-white rounded-lg border border-gray-200">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-200"
            >
                <div className="flex items-center gap-3">
                    <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                    <div className="text-left">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Dialogues & Readings
                        </h2>
                        <p className="text-sm text-gray-600">
                            {dialogues.length} dialogues available
                        </p>
                    </div>
                </div>
                <div className="text-sm text-gray-700">
                    {isExpanded ? '▲ Collapse' : '▼ Expand'}
                </div>
            </button>

            {isExpanded && (
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column - Tree */}
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {books.map((bookData) => {
                                    const isBookExpanded =
                                        expandedBooks[bookData.book];
                                    const lessons = Object.values(
                                        bookData.lessons
                                    ).sort((a, b) => a.lesson - b.lesson);

                                    return (
                                        <div
                                            key={`book-${bookData.book}`}
                                            className="border border-gray-200 rounded-lg overflow-hidden"
                                        >
                                            {/* Book Header */}
                                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                <button
                                                    onClick={() =>
                                                        toggleBookExpansion(
                                                            bookData.book
                                                        )
                                                    }
                                                    className="flex items-center gap-3 w-full text-left"
                                                >
                                                    <div className="w-6 h-6 flex items-center justify-center text-gray-400">
                                                        {isBookExpanded
                                                            ? '▼'
                                                            : '▶'}
                                                    </div>
                                                    <span className="font-medium text-gray-800">
                                                        Book {bookData.book}
                                                    </span>
                                                    <span className="text-sm text-gray-600 ml-auto">
                                                        {lessons.length} lesson
                                                        {lessons.length !== 1
                                                            ? 's'
                                                            : ''}
                                                    </span>
                                                </button>
                                            </div>

                                            {/* Lessons */}
                                            {isBookExpanded && (
                                                <div className="bg-white">
                                                    {lessons.map(
                                                        (lessonData) => {
                                                            const lessonKey = `${bookData.book}-${lessonData.lesson}`;
                                                            const isLessonExpanded =
                                                                expandedLessons[
                                                                    lessonKey
                                                                ];

                                                            return (
                                                                <div
                                                                    key={
                                                                        lessonKey
                                                                    }
                                                                    className="border-t border-gray-100"
                                                                >
                                                                    {/* Lesson Header */}
                                                                    <div className="px-8 py-2 border-b border-gray-100 bg-gray-50">
                                                                        <button
                                                                            onClick={() =>
                                                                                toggleLessonExpansion(
                                                                                    bookData.book,
                                                                                    lessonData.lesson
                                                                                )
                                                                            }
                                                                            className="flex items-center gap-3 w-full text-left"
                                                                        >
                                                                            <div className="w-6 h-6 flex items-center justify-center text-gray-400">
                                                                                {isLessonExpanded
                                                                                    ? '▼'
                                                                                    : '▶'}
                                                                            </div>
                                                                            <span className="text-sm text-gray-700">
                                                                                Lesson{' '}
                                                                                {
                                                                                    lessonData.lesson
                                                                                }
                                                                            </span>
                                                                            <span className="text-xs text-gray-600 ml-auto">
                                                                                {
                                                                                    lessonData
                                                                                        .dialogues
                                                                                        .length
                                                                                }{' '}
                                                                                dialogue
                                                                                {lessonData
                                                                                    .dialogues
                                                                                    .length !==
                                                                                1
                                                                                    ? 's'
                                                                                    : ''}
                                                                            </span>
                                                                        </button>
                                                                    </div>

                                                                    {/* Dialogues */}
                                                                    {isLessonExpanded && (
                                                                        <div className="px-12 py-3 space-y-2">
                                                                            {lessonData.dialogues.map(
                                                                                (
                                                                                    dialogue
                                                                                ) => (
                                                                                    <button
                                                                                        key={
                                                                                            dialogue.id
                                                                                        }
                                                                                        onClick={() =>
                                                                                            handleDialogueClick(
                                                                                                dialogue
                                                                                            )
                                                                                        }
                                                                                        className={`flex items-center justify-between w-full p-3 rounded-lg text-left hover:bg-gray-50 ${
                                                                                            selectedDialogue?.id ===
                                                                                            dialogue.id
                                                                                                ? 'bg-blue-50 border border-blue-200'
                                                                                                : 'border border-gray-100'
                                                                                        }`}
                                                                                    >
                                                                                        <div>
                                                                                            <div className="font-medium text-gray-800">
                                                                                                {
                                                                                                    dialogue.title
                                                                                                }
                                                                                            </div>
                                                                                            <div className="text-sm text-gray-600 mt-1">
                                                                                                {dialogue.type ===
                                                                                                'dialogue'
                                                                                                    ? 'Dialogue'
                                                                                                    : 'Reading'}
                                                                                                {dialogue
                                                                                                    .participants
                                                                                                    .length >
                                                                                                    0 && (
                                                                                                    <span className="ml-2">
                                                                                                        •{' '}
                                                                                                        {
                                                                                                            dialogue
                                                                                                                .participants
                                                                                                                .length
                                                                                                        }{' '}
                                                                                                        participant
                                                                                                        {dialogue
                                                                                                            .participants
                                                                                                            .length !==
                                                                                                        1
                                                                                                            ? 's'
                                                                                                            : ''}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="text-xs text-gray-500">
                                                                                            {
                                                                                                dialogue.dialogue
                                                                                            }
                                                                                        </div>
                                                                                    </button>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right column - Preview */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                        <h3 className="font-medium text-gray-800">
                                            {selectedDialogue
                                                ? 'Preview'
                                                : 'Select a Dialogue'}
                                        </h3>
                                    </div>

                                    <div className="p-4">
                                        <DialoguePreview
                                            dialogue={selectedDialogue}
                                            content={dialogueContent}
                                            isLoading={loadingContent}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DialoguesList;
