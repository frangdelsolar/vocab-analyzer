import React, { useState, useMemo } from 'react';
import { useVocabulary } from '../contexts/VocabularyContext';
import Pagination from './Pagination';

const VocabularyTable = () => {
    const { vocabulary, isLoading, error } = useVocabulary();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Visibility states for study mode
    const [showSimplified, setShowSimplified] = useState(false);
    const [showDeck, setShowDeck] = useState(false);
    const [blurMeaning, setBlurMeaning] = useState(false);
    const [blurPinyin, setBlurPinyin] = useState(false);
    const [blurTraditional, setBlurTraditional] = useState(false);
    const [blurSimplified, setBlurSimplified] = useState(false);
    const [showControls, setShowControls] = useState(false);

    // Sorting state
    const [sortConfig, setSortConfig] = useState({
        key: 'lessonId',
        direction: 'asc',
    });

    if (isLoading) {
        return (
            <div className="text-center py-8 text-gray-600">
                Loading vocabulary...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600">Error: {error}</div>
        );
    }

    // Sort vocabulary
    const sortedVocabulary = useMemo(() => {
        const sortableItems = [...vocabulary];

        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                // Get values for comparison
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle nested properties
                if (sortConfig.key === 'lesson') {
                    aValue = a.location?.lessonNumber;
                    bValue = b.location?.lessonNumber;
                } else if (sortConfig.key === 'book') {
                    aValue = a.location?.book;
                    bValue = b.location?.book;
                } else if (sortConfig.key === 'order') {
                    aValue = a.location?.order;
                    bValue = b.location?.order;
                }

                // Handle null/undefined values
                if (aValue == null) aValue = '';
                if (bValue == null) bValue = '';

                // String comparison
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                // Compare
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableItems;
    }, [vocabulary, sortConfig]);

    // Calculate pagination
    const totalPages = Math.ceil(sortedVocabulary.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sortedVocabulary.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    // Handle sorting
    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction:
                prevConfig.key === key && prevConfig.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
    };

    // Get sort indicator
    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="p-4">
            {/* Controls */}
            <div className="mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                    onClick={() => setShowControls(!showControls)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <svg
                            className={`w-5 h-5 text-gray-500 transition-transform ${
                                showControls ? 'rotate-90' : ''
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
                                Vocabulary ({vocabulary.length} items)
                            </h2>
                            <p className="text-sm text-gray-600">
                                {showControls
                                    ? 'Hide settings'
                                    : 'Show settings'}
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        {showControls ? '▲' : '▼'}
                    </div>
                </button>

                {showControls && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Column visibility */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3 border-b pb-2">
                                    Show/Hide Columns
                                </h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={showSimplified}
                                            onChange={(e) =>
                                                setShowSimplified(
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded"
                                        />
                                        Simplified column
                                    </label>

                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={showDeck}
                                            onChange={(e) =>
                                                setShowDeck(e.target.checked)
                                            }
                                            className="rounded"
                                        />
                                        Deck column
                                    </label>
                                </div>
                            </div>

                            {/* Blur controls */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3 border-b pb-2">
                                    Blur for Study
                                </h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={blurMeaning}
                                            onChange={(e) =>
                                                setBlurMeaning(e.target.checked)
                                            }
                                            className="rounded"
                                        />
                                        Meaning
                                    </label>

                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={blurPinyin}
                                            onChange={(e) =>
                                                setBlurPinyin(e.target.checked)
                                            }
                                            className="rounded"
                                        />
                                        Pinyin
                                    </label>

                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={blurTraditional}
                                            onChange={(e) =>
                                                setBlurTraditional(
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded"
                                        />
                                        Traditional
                                    </label>

                                    {showSimplified && (
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={blurSimplified}
                                                onChange={(e) =>
                                                    setBlurSimplified(
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded"
                                            />
                                            Simplified
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('order')}
                            >
                                <div className="flex items-center gap-1">
                                    #
                                    <span className="text-gray-400">
                                        {getSortIndicator('order')}
                                    </span>
                                </div>
                            </th>

                            {showSimplified && (
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('simplified')}
                                >
                                    <div className="flex items-center gap-1">
                                        Simplified
                                        <span className="text-gray-400">
                                            {getSortIndicator('simplified')}
                                        </span>
                                    </div>
                                </th>
                            )}

                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('traditional')}
                            >
                                <div className="flex items-center gap-1">
                                    Traditional
                                    <span className="text-gray-400">
                                        {getSortIndicator('traditional')}
                                    </span>
                                </div>
                            </th>

                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('pinyin')}
                            >
                                <div className="flex items-center gap-1">
                                    Pinyin
                                    <span className="text-gray-400">
                                        {getSortIndicator('pinyin')}
                                    </span>
                                </div>
                            </th>

                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('meaning')}
                            >
                                <div className="flex items-center gap-1">
                                    Meaning
                                    <span className="text-gray-400">
                                        {getSortIndicator('meaning')}
                                    </span>
                                </div>
                            </th>

                            {showDeck && (
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('deck')}
                                >
                                    <div className="flex items-center gap-1">
                                        Deck
                                        <span className="text-gray-400">
                                            {getSortIndicator('deck')}
                                        </span>
                                    </div>
                                </th>
                            )}

                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('lesson')}
                            >
                                <div className="flex items-center gap-1">
                                    Lesson
                                    <span className="text-gray-400">
                                        {getSortIndicator('lesson')}
                                    </span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item, index) => (
                            <tr key={item.guid} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    {startIndex + index + 1}
                                </td>

                                {showSimplified && (
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div
                                            className={`font-chinese text-lg font-medium ${
                                                blurSimplified
                                                    ? 'blur-sm hover:blur-none transition-all'
                                                    : 'text-gray-900'
                                            }`}
                                        >
                                            {item.simplified}
                                            {blurSimplified && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Hover to reveal
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                )}

                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div
                                        className={`font-chinese text-lg ${
                                            blurTraditional
                                                ? 'blur-sm hover:blur-none transition-all'
                                                : 'text-gray-900'
                                        }`}
                                    >
                                        {item.traditional}
                                        {blurTraditional && (
                                            <div className="text-xs text-gray-400 mt-1">
                                                Hover to reveal
                                            </div>
                                        )}
                                    </div>
                                </td>

                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div
                                        className={`text-gray-900 ${
                                            blurPinyin
                                                ? 'blur-sm hover:blur-none transition-all'
                                                : ''
                                        }`}
                                    >
                                        {item.pinyin}
                                        {blurPinyin && (
                                            <div className="text-xs text-gray-400 mt-1">
                                                Hover to reveal
                                            </div>
                                        )}
                                    </div>
                                </td>

                                <td className="px-4 py-4">
                                    <div
                                        className={`text-gray-700 ${
                                            blurMeaning
                                                ? 'blur-sm hover:blur-none transition-all'
                                                : ''
                                        }`}
                                    >
                                        {item.meaning}
                                        {blurMeaning && (
                                            <div className="text-xs text-gray-400 mt-1">
                                                Hover to reveal
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {showDeck && (
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {item.deck}
                                        </span>
                                    </td>
                                )}

                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex flex-col space-y-1">
                                        {/* Check if location data exists */}
                                        {item.location?.book &&
                                        item.location?.lesson &&
                                        item.location?.vocabulary &&
                                        item.location?.order ? (
                                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                                                <div className="flex items-center">
                                                    <svg
                                                        className="w-3 h-3 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                        />
                                                    </svg>
                                                    <span>
                                                        B{item.location.book}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg
                                                        className="w-3 h-3 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                        />
                                                    </svg>
                                                    <span>
                                                        L{item.location.lesson}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg
                                                        className="w-3 h-3 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                    <span>
                                                        {
                                                            item.location
                                                                .vocabulary
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg
                                                        className="w-3 h-3 mr-1"
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
                                                    <span>
                                                        #{item.location.order}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Fallback to lessonId if location data is incomplete */
                                            <div className="text-sm text-gray-700 font-medium">
                                                {item.lessonId ||
                                                    'No lesson info'}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                totalItems={sortedVocabulary.length}
            />
        </div>
    );
};

export default VocabularyTable;
