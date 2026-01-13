import React, { useState, useMemo } from 'react';
import { useVocabulary } from '../contexts/VocabularyContext';

const VocabularySettings = () => {
    const {
        availableLists,
        selectedLists,
        selectList,
        deselectList,
        clearSelection,
        filteredVocabulary,
    } = useVocabulary();

    const [searchTerm, setSearchTerm] = useState('');
    const [expandedBooks, setExpandedBooks] = useState({});
    const [expandedLessons, setExpandedLessons] = useState({});
    const [isExpanded, setIsExpanded] = useState(true);

    // Group lists by book and lesson
    const groupedLists = useMemo(() => {
        const groups = {};

        availableLists.forEach((list) => {
            const { book, lesson } = list;

            if (!groups[book]) {
                groups[book] = {
                    book,
                    lessons: {},
                    count: 0,
                };
            }

            if (!groups[book].lessons[lesson]) {
                groups[book].lessons[lesson] = {
                    book,
                    lesson,
                    lists: [],
                    count: 0,
                };
            }

            groups[book].lessons[lesson].lists.push(list);
            groups[book].lessons[lesson].count += list.count;
            groups[book].count += list.count;
        });

        return groups;
    }, [availableLists]);

    // Filter lists based on search term
    const filteredGroups = useMemo(() => {
        if (!searchTerm.trim()) return groupedLists;

        const searchLower = searchTerm.toLowerCase();
        const filtered = {};

        Object.entries(groupedLists).forEach(([book, bookData]) => {
            // Check if book matches search
            const bookLabel = `Book ${book}`;
            if (bookLabel.toLowerCase().includes(searchLower)) {
                filtered[book] = bookData;
                return;
            }

            // Check individual lessons and lists
            const filteredLessons = {};
            Object.entries(bookData.lessons).forEach(([lesson, lessonData]) => {
                const lessonLabel = `Lesson ${lesson}`;
                const matchingLists = lessonData.lists.filter((list) =>
                    list.label.toLowerCase().includes(searchLower)
                );

                if (
                    lessonLabel.toLowerCase().includes(searchLower) ||
                    matchingLists.length > 0
                ) {
                    filteredLessons[lesson] = {
                        ...lessonData,
                        lists:
                            matchingLists.length > 0
                                ? matchingLists
                                : lessonData.lists,
                    };
                }
            });

            if (Object.keys(filteredLessons).length > 0) {
                filtered[book] = {
                    ...bookData,
                    lessons: filteredLessons,
                    count: Object.values(filteredLessons).reduce(
                        (sum, lesson) => sum + lesson.count,
                        0
                    ),
                };
            }
        });

        return filtered;
    }, [groupedLists, searchTerm]);

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

    const handleListToggle = (listKey) => {
        if (selectedLists.includes(listKey)) {
            deselectList(listKey);
        } else {
            selectList(listKey);
        }
    };

    const selectAllInLesson = (book, lesson) => {
        const lessonData = groupedLists[book]?.lessons[lesson];
        if (!lessonData) return;

        lessonData.lists.forEach((list) => {
            if (!selectedLists.includes(list.key)) {
                selectList(list.key);
            }
        });
    };

    const deselectAllInLesson = (book, lesson) => {
        const lessonData = groupedLists[book]?.lessons[lesson];
        if (!lessonData) return;

        lessonData.lists.forEach((list) => {
            deselectList(list.key);
        });
    };

    const selectAllInBook = (book) => {
        const bookData = groupedLists[book];
        if (!bookData) return;

        Object.values(bookData.lessons).forEach((lessonData) => {
            lessonData.lists.forEach((list) => {
                if (!selectedLists.includes(list.key)) {
                    selectList(list.key);
                }
            });
        });
    };

    const deselectAllInBook = (book) => {
        const bookData = groupedLists[book];
        if (!bookData) return;

        Object.values(bookData.lessons).forEach((lessonData) => {
            lessonData.lists.forEach((list) => {
                deselectList(list.key);
            });
        });
    };

    // Expand all books and lessons
    const expandAll = () => {
        const newExpandedBooks = {};
        const newExpandedLessons = {};

        Object.keys(filteredGroups).forEach((book) => {
            newExpandedBooks[book] = true;
            Object.keys(filteredGroups[book].lessons).forEach((lesson) => {
                newExpandedLessons[`${book}-${lesson}`] = true;
            });
        });

        setExpandedBooks(newExpandedBooks);
        setExpandedLessons(newExpandedLessons);
    };

    // Collapse all books and lessons
    const collapseAll = () => {
        setExpandedBooks({});
        setExpandedLessons({});
    };

    // Select all visible lists
    const selectAllVisible = () => {
        Object.values(filteredGroups).forEach((bookData) => {
            Object.values(bookData.lessons).forEach((lessonData) => {
                lessonData.lists.forEach((list) => {
                    if (!selectedLists.includes(list.key)) {
                        selectList(list.key);
                    }
                });
            });
        });
    };

    return (
        <div className="mx-4 my-2 bg-white rounded-lg border border-gray-200">
            {/* Header - Always visible */}
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
                            Vocabulary Selection
                        </h2>
                        <p className="text-sm text-gray-600">
                            {selectedLists.length > 0
                                ? `${selectedLists.length} lists selected (${filteredVocabulary.length} items)`
                                : 'Select vocabulary lists to study'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-700">
                        {isExpanded ? '▲ Collapse' : '▼ Expand'}
                    </div>
                </div>
            </button>

            {/* Main content - Only visible when expanded */}
            {isExpanded && (
                <>
                    {/* Search */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search books, lessons, or lists..."
                                className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={expandAll}
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                                Expand All
                            </button>
                            <button
                                onClick={collapseAll}
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                                Collapse All
                            </button>
                        </div>
                    </div>

                    {/* Selection Summary */}
                    {selectedLists.length > 0 && (
                        <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-700">
                                    Selected Lists ({selectedLists.length})
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={selectAllVisible}
                                        className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                        Select all visible
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <button
                                        onClick={clearSelection}
                                        className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                {selectedLists.map((listKey) => {
                                    const list = availableLists.find(
                                        (l) => l.key === listKey
                                    );
                                    if (!list) return null;

                                    return (
                                        <span
                                            key={listKey}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            {list.label}
                                            <button
                                                onClick={() =>
                                                    deselectList(listKey)
                                                }
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Lists Tree */}
                    <div className="p-6">
                        {Object.keys(filteredGroups).length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {searchTerm
                                    ? 'No lists found matching your search'
                                    : 'No vocabulary lists available'}
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {Object.values(filteredGroups)
                                    .sort((a, b) => a.book - b.book)
                                    .map((bookData) => {
                                        const isBookExpanded =
                                            expandedBooks[bookData.book] ||
                                            searchTerm !== '';
                                        const bookSelectedLists = Object.values(
                                            bookData.lessons
                                        )
                                            .flatMap((lesson) => lesson.lists)
                                            .filter((list) =>
                                                selectedLists.includes(list.key)
                                            );
                                        const isBookPartiallySelected =
                                            bookSelectedLists.length > 0 &&
                                            bookSelectedLists.length <
                                                bookData.count;

                                        return (
                                            <div
                                                key={`book-${bookData.book}`}
                                                className="border border-gray-200 rounded-lg overflow-hidden"
                                            >
                                                {/* Book Header */}
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() =>
                                                                    toggleBookExpansion(
                                                                        bookData.book
                                                                    )
                                                                }
                                                                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                                                            >
                                                                {isBookExpanded
                                                                    ? '▼'
                                                                    : '▶'}
                                                            </button>
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        bookSelectedLists.length ===
                                                                        bookData.count
                                                                    }
                                                                    ref={(
                                                                        input
                                                                    ) => {
                                                                        if (
                                                                            input
                                                                        ) {
                                                                            input.indeterminate =
                                                                                isBookPartiallySelected;
                                                                        }
                                                                    }}
                                                                    onChange={() => {
                                                                        if (
                                                                            bookSelectedLists.length ===
                                                                            bookData.count
                                                                        ) {
                                                                            deselectAllInBook(
                                                                                bookData.book
                                                                            );
                                                                        } else {
                                                                            selectAllInBook(
                                                                                bookData.book
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="rounded"
                                                                />
                                                                <span className="font-medium text-gray-800">
                                                                    Book{' '}
                                                                    {
                                                                        bookData.book
                                                                    }{' '}
                                                                    (
                                                                    {
                                                                        bookData.count
                                                                    }{' '}
                                                                    items)
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    selectAllInBook(
                                                                        bookData.book
                                                                    )
                                                                }
                                                                className="text-xs text-blue-600 hover:text-blue-800"
                                                            >
                                                                Select all
                                                            </button>
                                                            <span className="text-gray-300">
                                                                |
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    deselectAllInBook(
                                                                        bookData.book
                                                                    )
                                                                }
                                                                className="text-xs text-gray-600 hover:text-gray-800"
                                                            >
                                                                Clear
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Lessons */}
                                                {isBookExpanded && (
                                                    <div className="bg-white">
                                                        {Object.values(
                                                            bookData.lessons
                                                        )
                                                            .sort(
                                                                (a, b) =>
                                                                    a.lesson -
                                                                    b.lesson
                                                            )
                                                            .map(
                                                                (
                                                                    lessonData
                                                                ) => {
                                                                    const lessonKey = `${bookData.book}-${lessonData.lesson}`;
                                                                    const isLessonExpanded =
                                                                        expandedLessons[
                                                                            lessonKey
                                                                        ] ||
                                                                        searchTerm !==
                                                                            '';
                                                                    const lessonSelectedLists =
                                                                        lessonData.lists.filter(
                                                                            (
                                                                                list
                                                                            ) =>
                                                                                selectedLists.includes(
                                                                                    list.key
                                                                                )
                                                                        );
                                                                    const isLessonPartiallySelected =
                                                                        lessonSelectedLists.length >
                                                                            0 &&
                                                                        lessonSelectedLists.length <
                                                                            lessonData
                                                                                .lists
                                                                                .length;

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                lessonKey
                                                                            }
                                                                            className="border-t border-gray-100"
                                                                        >
                                                                            {/* Lesson Header */}
                                                                            <div className="px-8 py-2 border-b border-gray-100 bg-gray-50">
                                                                                <div className="flex items-center justify-between">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                toggleLessonExpansion(
                                                                                                    bookData.book,
                                                                                                    lessonData.lesson
                                                                                                )
                                                                                            }
                                                                                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                                                                                        >
                                                                                            {isLessonExpanded
                                                                                                ? '▼'
                                                                                                : '▶'}
                                                                                        </button>
                                                                                        <div className="flex items-center gap-3">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={
                                                                                                    lessonSelectedLists.length ===
                                                                                                    lessonData
                                                                                                        .lists
                                                                                                        .length
                                                                                                }
                                                                                                ref={(
                                                                                                    input
                                                                                                ) => {
                                                                                                    if (
                                                                                                        input
                                                                                                    ) {
                                                                                                        input.indeterminate =
                                                                                                            isLessonPartiallySelected;
                                                                                                    }
                                                                                                }}
                                                                                                onChange={() => {
                                                                                                    if (
                                                                                                        lessonSelectedLists.length ===
                                                                                                        lessonData
                                                                                                            .lists
                                                                                                            .length
                                                                                                    ) {
                                                                                                        deselectAllInLesson(
                                                                                                            bookData.book,
                                                                                                            lessonData.lesson
                                                                                                        );
                                                                                                    } else {
                                                                                                        selectAllInLesson(
                                                                                                            bookData.book,
                                                                                                            lessonData.lesson
                                                                                                        );
                                                                                                    }
                                                                                                }}
                                                                                                className="rounded"
                                                                                            />
                                                                                            <span className="text-sm text-gray-700">
                                                                                                Lesson{' '}
                                                                                                {
                                                                                                    lessonData.lesson
                                                                                                }{' '}
                                                                                                (
                                                                                                {
                                                                                                    lessonData.count
                                                                                                }{' '}
                                                                                                items)
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                selectAllInLesson(
                                                                                                    bookData.book,
                                                                                                    lessonData.lesson
                                                                                                )
                                                                                            }
                                                                                            className="text-xs text-blue-600 hover:text-blue-800"
                                                                                        >
                                                                                            Select
                                                                                            all
                                                                                        </button>
                                                                                        <span className="text-gray-300">
                                                                                            |
                                                                                        </span>
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                deselectAllInLesson(
                                                                                                    bookData.book,
                                                                                                    lessonData.lesson
                                                                                                )
                                                                                            }
                                                                                            className="text-xs text-gray-600 hover:text-gray-800"
                                                                                        >
                                                                                            Clear
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Vocabulary Lists */}
                                                                            {isLessonExpanded && (
                                                                                <div className="px-12 py-3 space-y-2">
                                                                                    {lessonData.lists
                                                                                        .sort(
                                                                                            (
                                                                                                a,
                                                                                                b
                                                                                            ) =>
                                                                                                a.vocabulary.localeCompare(
                                                                                                    b.vocabulary
                                                                                                )
                                                                                        )
                                                                                        .map(
                                                                                            (
                                                                                                list
                                                                                            ) => (
                                                                                                <div
                                                                                                    key={
                                                                                                        list.key
                                                                                                    }
                                                                                                    className="flex items-center justify-between"
                                                                                                >
                                                                                                    <div className="flex items-center gap-3">
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            checked={selectedLists.includes(
                                                                                                                list.key
                                                                                                            )}
                                                                                                            onChange={() =>
                                                                                                                handleListToggle(
                                                                                                                    list.key
                                                                                                                )
                                                                                                            }
                                                                                                            className="rounded"
                                                                                                            id={`list-${list.key}`}
                                                                                                        />
                                                                                                        <label
                                                                                                            htmlFor={`list-${list.key}`}
                                                                                                            className="text-sm text-gray-600 cursor-pointer"
                                                                                                        >
                                                                                                            {
                                                                                                                list.vocabulary
                                                                                                            }{' '}
                                                                                                            (
                                                                                                            {
                                                                                                                list.count
                                                                                                            }{' '}
                                                                                                            items)
                                                                                                        </label>
                                                                                                    </div>
                                                                                                    <button
                                                                                                        onClick={() =>
                                                                                                            handleListToggle(
                                                                                                                list.key
                                                                                                            )
                                                                                                        }
                                                                                                        className={`px-2 py-1 text-xs rounded ${
                                                                                                            selectedLists.includes(
                                                                                                                list.key
                                                                                                            )
                                                                                                                ? 'bg-blue-100 text-blue-800'
                                                                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                                                        }`}
                                                                                                    >
                                                                                                        {selectedLists.includes(
                                                                                                            list.key
                                                                                                        )
                                                                                                            ? 'Selected'
                                                                                                            : 'Select'}
                                                                                                    </button>
                                                                                                </div>
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
                        )}

                        {/* Quick Actions */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={selectAllVisible}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                >
                                    Select all visible lists
                                </button>

                                <button
                                    onClick={() => {
                                        // Select first book
                                        const firstBook =
                                            Object.keys(filteredGroups)[0];
                                        if (firstBook) {
                                            selectAllInBook(
                                                parseInt(firstBook)
                                            );
                                        }
                                    }}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                >
                                    Select first book
                                </button>

                                <button
                                    onClick={clearSelection}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                >
                                    Clear all selections
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Footer - Always visible */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                        {selectedLists.length > 0 ? (
                            <span>
                                Showing{' '}
                                <span className="font-bold">
                                    {filteredVocabulary.length}
                                </span>{' '}
                                items from{' '}
                                <span className="font-bold">
                                    {selectedLists.length}
                                </span>{' '}
                                selected lists
                            </span>
                        ) : (
                            <span>Select lists to filter vocabulary</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={isExpanded ? collapseAll : expandAll}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            {isExpanded ? 'Collapse all' : 'Expand all'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VocabularySettings;
