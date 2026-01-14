// components/VocabularyInsights.jsx
import React, { useMemo, useState, useRef } from 'react';
import { useVocabulary } from '../contexts/VocabularyContext';
import { ChevronDown, ChevronRight } from 'lucide-react';

const VocabularyInsights = () => {
    const { filteredVocabulary } = useVocabulary();
    const [hoveredChar, setHoveredChar] = useState(null);
    const [hoveredWordsChar, setHoveredWordsChar] = useState(null);
    const [tooltipTimeout, setTooltipTimeout] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        summary: true,
        wordLength: true,
        mostCommonChar: true,
        charFrequency: true,
    });
    const tooltipRef = useRef(null);

    const insights = useMemo(() => {
        if (!filteredVocabulary.length) return null;

        // 1. Count unique words (use traditional as primary identifier)
        const uniqueWords = new Set();
        const wordDetails = new Map();

        filteredVocabulary.forEach((vocab) => {
            // Use traditional as primary identifier if it exists
            const primaryKey = vocab.traditional || vocab.simplified;
            uniqueWords.add(primaryKey);

            if (!wordDetails.has(primaryKey)) {
                wordDetails.set(primaryKey, {
                    primary: primaryKey, // Traditional if available
                    simplified: vocab.simplified,
                    traditional: vocab.traditional,
                    pinyin: vocab.pinyin,
                    meaning: vocab.meaning,
                    count: 0,
                });
            }
            wordDetails.get(primaryKey).count++;
        });

        // 2. Analyze characters - focus on traditional characters
        const characterFrequency = new Map();
        const characterInWords = new Map();

        filteredVocabulary.forEach((vocab) => {
            // Use traditional characters when available, otherwise simplified
            const word = vocab.traditional || vocab.simplified;

            // Split Chinese characters
            for (const char of word) {
                // Update frequency
                characterFrequency.set(
                    char,
                    (characterFrequency.get(char) || 0) + 1
                );

                // Update character->words mapping
                if (!characterInWords.has(char)) {
                    characterInWords.set(char, new Set());
                }
                characterInWords.get(char).add({
                    word,
                    simplified: vocab.simplified,
                    traditional: vocab.traditional,
                    pinyin: vocab.pinyin,
                    meaning: vocab.meaning,
                });
            }
        });

        // 3. Get top characters by frequency
        const sortedCharacters = Array.from(characterFrequency.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([char, freq]) => ({
                character: char,
                frequency: freq,
                words: Array.from(characterInWords.get(char) || []),
            }));

        // 4. Get multi-character vs single-character word counts
        const wordLengthStats = {};
        filteredVocabulary.forEach((vocab) => {
            const word = vocab.traditional || vocab.simplified;
            const length = word.length;
            wordLengthStats[length] = (wordLengthStats[length] || 0) + 1;
        });

        return {
            totalWords: filteredVocabulary.length,
            uniqueWordCount: uniqueWords.size,
            uniqueCharacterCount: characterFrequency.size,
            characterFrequency: sortedCharacters,
            wordDetails: Array.from(wordDetails.values()).sort(
                (a, b) => b.count - a.count
            ),
            wordLengthStats,
            mostCommonCharacter: sortedCharacters[0],
            mostCommonWord: Array.from(wordDetails.values()).sort(
                (a, b) => b.count - a.count
            )[0],
        };
    }, [filteredVocabulary]);

    // Helper function to handle mouse enter with delay
    const handleMouseEnter = (charData, setter) => {
        if (tooltipTimeout) {
            clearTimeout(tooltipTimeout);
        }
        setter(charData);
    };

    // Helper function to handle mouse leave with delay
    const handleMouseLeave = (setter) => {
        const timeout = setTimeout(() => {
            setter(null);
        }, 300); // 300ms delay before hiding
        setTooltipTimeout(timeout);
    };

    // Toggle section expansion
    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // Collapse all sections
    const collapseAll = () => {
        setExpandedSections({
            summary: false,
            wordLength: false,
            mostCommonChar: false,
            charFrequency: false,
        });
    };

    // Expand all sections
    const expandAll = () => {
        setExpandedSections({
            summary: true,
            wordLength: true,
            mostCommonChar: true,
            charFrequency: true,
        });
    };

    // Clear timeout when component unmounts
    React.useEffect(() => {
        return () => {
            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
            }
        };
    }, [tooltipTimeout]);

    if (!filteredVocabulary.length) {
        return (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">
                    Vocabulary Insights
                </h3>
                <p className="text-sm text-gray-500">
                    Select vocabulary lists to see insights
                </p>
            </div>
        );
    }

    if (!insights) return null;

    return (
        <div className="space-y-4">
            {/* Header with expand/collapse controls */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                    Vocabulary Insights
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={expandAll}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        Expand All
                    </button>
                    <button
                        onClick={collapseAll}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        Collapse All
                    </button>
                </div>
            </div>

            {/* Summary Cards - Always visible but collapsible container */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <button
                    onClick={() => toggleSection('summary')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-t-lg"
                >
                    <h3 className="font-medium text-gray-800">Overview</h3>
                    {expandedSections.summary ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                </button>

                {expandedSections.summary && (
                    <div className="p-4 pt-0 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {insights.totalWords}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Vocabulary Items
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {insights.uniqueWordCount}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Unique Words
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                    {insights.uniqueCharacterCount}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Unique Characters
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Word Length Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <button
                    onClick={() => toggleSection('wordLength')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-t-lg"
                >
                    <h3 className="font-medium text-gray-800">
                        Word Length Distribution
                    </h3>
                    {expandedSections.wordLength ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                </button>

                {expandedSections.wordLength && (
                    <div className="p-4 pt-0 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(insights.wordLengthStats).map(
                                ([length, count]) => (
                                    <div
                                        key={length}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                                    >
                                        <span className="font-medium">
                                            {length} characters
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            ({count} words)
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {Math.round(
                                                (count / insights.totalWords) *
                                                    100
                                            )}
                                            %
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Most Common Character */}
            {insights.mostCommonCharacter && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <button
                        onClick={() => toggleSection('mostCommonChar')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-t-lg"
                    >
                        <h3 className="font-medium text-gray-800">
                            Most Common Character
                        </h3>
                        {expandedSections.mostCommonChar ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                    </button>

                    {expandedSections.mostCommonChar && (
                        <div className="p-4 pt-0 border-t border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-chinese font-bold">
                                    {insights.mostCommonCharacter.character}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="text-lg font-medium">
                                                Appears{' '}
                                                {
                                                    insights.mostCommonCharacter
                                                        .frequency
                                                }{' '}
                                                times
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                In{' '}
                                                {
                                                    insights.mostCommonCharacter
                                                        .words.length
                                                }{' '}
                                                different words
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-600 mb-1">
                                            Words containing this character:
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {insights.mostCommonCharacter.words
                                                .slice(0, 8)
                                                .map((wordObj, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
                                                        title={`${wordObj.pinyin}: ${wordObj.meaning}`}
                                                    >
                                                        {wordObj.word}
                                                    </span>
                                                ))}
                                            {insights.mostCommonCharacter.words
                                                .length > 8 && (
                                                <div className="relative inline-block">
                                                    <span
                                                        className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                                                        onMouseEnter={() =>
                                                            handleMouseEnter(
                                                                insights.mostCommonCharacter,
                                                                setHoveredChar
                                                            )
                                                        }
                                                        onMouseLeave={() =>
                                                            handleMouseLeave(
                                                                setHoveredChar
                                                            )
                                                        }
                                                    >
                                                        +
                                                        {insights
                                                            .mostCommonCharacter
                                                            .words.length -
                                                            8}{' '}
                                                        more
                                                    </span>
                                                    {hoveredChar?.character ===
                                                        insights
                                                            .mostCommonCharacter
                                                            .character && (
                                                        <div
                                                            className="absolute z-50 left-0 top-full mt-1 w-80 p-4 bg-white rounded-lg shadow-xl border border-gray-200"
                                                            onMouseEnter={() => {
                                                                if (
                                                                    tooltipTimeout
                                                                ) {
                                                                    clearTimeout(
                                                                        tooltipTimeout
                                                                    );
                                                                }
                                                            }}
                                                            onMouseLeave={() =>
                                                                handleMouseLeave(
                                                                    setHoveredChar
                                                                )
                                                            }
                                                            ref={tooltipRef}
                                                        >
                                                            <div className="flex justify-between items-center mb-3">
                                                                <div className="text-sm font-medium text-gray-800">
                                                                    All words
                                                                    containing "
                                                                    {
                                                                        insights
                                                                            .mostCommonCharacter
                                                                            .character
                                                                    }
                                                                    ":
                                                                </div>
                                                                <button
                                                                    className="text-xs text-gray-400 hover:text-gray-600"
                                                                    onClick={() =>
                                                                        setHoveredChar(
                                                                            null
                                                                        )
                                                                    }
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                                                {insights.mostCommonCharacter.words.map(
                                                                    (
                                                                        wordObj,
                                                                        idx
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="p-2 hover:bg-gray-50 rounded border border-gray-100"
                                                                        >
                                                                            <div className="flex items-start justify-between">
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center gap-2 mb-1">
                                                                                        <span className="font-chinese text-lg font-bold">
                                                                                            {
                                                                                                wordObj.word
                                                                                            }
                                                                                        </span>
                                                                                        {wordObj.simplified !==
                                                                                            wordObj.word && (
                                                                                            <span className="font-chinese text-sm text-gray-500">
                                                                                                (
                                                                                                {
                                                                                                    wordObj.simplified
                                                                                                }

                                                                                                )
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="text-blue-600 text-sm">
                                                                                        {
                                                                                            wordObj.pinyin
                                                                                        }
                                                                                    </div>
                                                                                    <div className="text-gray-700 text-sm">
                                                                                        {
                                                                                            wordObj.meaning
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                            <div className="absolute left-1/2 transform -translate-x-1/2 top-full -mt-2">
                                                                <div className="w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Character Frequency Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <button
                    onClick={() => toggleSection('charFrequency')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-t-lg"
                >
                    <h3 className="font-medium text-gray-800">
                        Character Frequency Analysis
                    </h3>
                    {expandedSections.charFrequency ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                </button>

                {expandedSections.charFrequency && (
                    <div className="p-4 pt-0 border-t border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 font-medium text-gray-700">
                                            Character
                                        </th>
                                        <th className="text-left py-2 font-medium text-gray-700">
                                            Frequency
                                        </th>
                                        <th className="text-left py-2 font-medium text-gray-700">
                                            Words Containing
                                        </th>
                                        <th className="text-left py-2 font-medium text-gray-700">
                                            % of Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {insights.characterFrequency
                                        .slice(0, 20)
                                        .map((charData, index) => (
                                            <tr
                                                key={charData.character}
                                                className="border-b border-gray-100 hover:bg-gray-50"
                                            >
                                                <td className="py-2">
                                                    <div className="font-chinese text-xl font-bold">
                                                        {charData.character}
                                                    </div>
                                                </td>
                                                <td className="py-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            {charData.frequency}
                                                        </span>
                                                        <div className="flex-1 w-24 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-500 h-2 rounded-full"
                                                                style={{
                                                                    width: `${
                                                                        (charData.frequency /
                                                                            insights
                                                                                .mostCommonCharacter
                                                                                .frequency) *
                                                                        100
                                                                    }%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2">
                                                    <div className="relative">
                                                        <div className="flex flex-wrap gap-1">
                                                            {charData.words
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        wordObj,
                                                                        idx
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="text-xs px-1.5 py-0.5 bg-gray-100 rounded"
                                                                            title={`${wordObj.pinyin}: ${wordObj.meaning}`}
                                                                        >
                                                                            {
                                                                                wordObj.word
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                            {charData.words
                                                                .length > 3 && (
                                                                <div className="relative inline-block">
                                                                    <span
                                                                        className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded cursor-pointer hover:bg-gray-200"
                                                                        onMouseEnter={() =>
                                                                            handleMouseEnter(
                                                                                charData,
                                                                                setHoveredWordsChar
                                                                            )
                                                                        }
                                                                        onMouseLeave={() =>
                                                                            handleMouseLeave(
                                                                                setHoveredWordsChar
                                                                            )
                                                                        }
                                                                    >
                                                                        +
                                                                        {charData
                                                                            .words
                                                                            .length -
                                                                            3}
                                                                    </span>
                                                                    {hoveredWordsChar?.character ===
                                                                        charData.character && (
                                                                        <div
                                                                            className="absolute z-50 left-0 top-full mt-1 w-80 p-4 bg-white rounded-lg shadow-xl border border-gray-200"
                                                                            onMouseEnter={() => {
                                                                                if (
                                                                                    tooltipTimeout
                                                                                ) {
                                                                                    clearTimeout(
                                                                                        tooltipTimeout
                                                                                    );
                                                                                }
                                                                            }}
                                                                            onMouseLeave={() =>
                                                                                handleMouseLeave(
                                                                                    setHoveredWordsChar
                                                                                )
                                                                            }
                                                                        >
                                                                            <div className="flex justify-between items-center mb-3">
                                                                                <div className="text-sm font-medium text-gray-800">
                                                                                    All
                                                                                    words
                                                                                    containing
                                                                                    "
                                                                                    {
                                                                                        charData.character
                                                                                    }
                                                                                    ":
                                                                                </div>
                                                                                <button
                                                                                    className="text-xs text-gray-400 hover:text-gray-600"
                                                                                    onClick={() =>
                                                                                        setHoveredWordsChar(
                                                                                            null
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    ×
                                                                                </button>
                                                                            </div>
                                                                            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                                                                {charData.words.map(
                                                                                    (
                                                                                        wordObj,
                                                                                        idx
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                idx
                                                                                            }
                                                                                            className="p-2 hover:bg-gray-50 rounded border border-gray-100"
                                                                                        >
                                                                                            <div className="flex items-start justify-between">
                                                                                                <div className="flex-1">
                                                                                                    <div className="flex items-center gap-2 mb-1">
                                                                                                        <span className="font-chinese text-lg font-bold">
                                                                                                            {
                                                                                                                wordObj.word
                                                                                                            }
                                                                                                        </span>
                                                                                                        {wordObj.simplified !==
                                                                                                            wordObj.word && (
                                                                                                            <span className="font-chinese text-sm text-gray-500">
                                                                                                                (
                                                                                                                {
                                                                                                                    wordObj.simplified
                                                                                                                }

                                                                                                                )
                                                                                                            </span>
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <div className="text-blue-600 text-sm">
                                                                                                        {
                                                                                                            wordObj.pinyin
                                                                                                        }
                                                                                                    </div>
                                                                                                    <div className="text-gray-700 text-sm">
                                                                                                        {
                                                                                                            wordObj.meaning
                                                                                                        }
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                            <div className="absolute left-1/2 transform -translate-x-1/2 top-full -mt-2">
                                                                                <div className="w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2 text-gray-600">
                                                    {Math.round(
                                                        (charData.frequency /
                                                            insights.totalWords) *
                                                            100
                                                    )}
                                                    %
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {insights.characterFrequency.length > 20 && (
                                <div className="text-center py-3 text-sm text-gray-500">
                                    Showing top 20 characters out of{' '}
                                    {insights.characterFrequency.length}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VocabularyInsights;
