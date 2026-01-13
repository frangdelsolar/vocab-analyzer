import React, { useMemo, useState } from 'react';
import { useVocabulary } from '../contexts/VocabularyContext';

const DialoguePreview = ({ dialogue, content, isLoading }) => {
    const { vocabulary } = useVocabulary();
    const [hoveredWord, setHoveredWord] = useState(null);
    const [hoveredOccurrenceId, setHoveredOccurrenceId] = useState(null);
    const [highlightVocabulary, setHighlightVocabulary] = useState(true);
    const [showVocabularyList, setShowVocabularyList] = useState(false);

    // Helper to map Dialogue index (Arabic) to Vocabulary section (Roman)
    const dialogueToRoman = (num) => {
        const map = {
            1: 'I',
            2: 'II',
            3: 'III',
            4: 'IV',
            5: 'V',
        };
        return map[num] || num.toString();
    };

    // Filter vocabulary that matches the current dialogue's Book, Lesson, and Part
    const matchingVocabulary = useMemo(() => {
        if (!dialogue || !vocabulary.length) return [];

        const targetRomanPart = dialogueToRoman(dialogue.dialogue);

        return vocabulary.filter((item) => {
            const { location } = item;
            if (!location) return false;

            return (
                location.book === dialogue.book &&
                location.lesson === dialogue.lesson &&
                location.vocabulary === targetRomanPart
            );
        });
    }, [dialogue, vocabulary]);

    // Function to highlight vocabulary in text
    const highlightText = (text, contextId = '') => {
        if (!highlightVocabulary || matchingVocabulary.length === 0) {
            return <span>{text}</span>;
        }

        // Sort vocabulary by length (longer first) to avoid partial matches
        const sortedVocabulary = [...matchingVocabulary].sort(
            (a, b) => b.simplified.length - a.simplified.length
        );

        let result = [];
        let remainingText = text;
        let occurrenceIndex = 0;

        while (remainingText.length > 0) {
            let matched = false;

            for (const vocab of sortedVocabulary) {
                if (remainingText.startsWith(vocab.simplified)) {
                    // Create a unique ID for this specific occurrence
                    const occurrenceId = `${contextId}-${vocab.guid}-${occurrenceIndex}`;
                    occurrenceIndex++;

                    result.push(
                        <span
                            key={occurrenceId}
                            className="relative inline-block group cursor-pointer"
                            onMouseEnter={() => {
                                setHoveredWord(vocab);
                                setHoveredOccurrenceId(occurrenceId);
                            }}
                            onMouseLeave={() => {
                                setHoveredWord(null);
                                setHoveredOccurrenceId(null);
                            }}
                        >
                            <span className="bg-yellow-100 text-yellow-800 px-1 rounded border border-yellow-200 hover:bg-yellow-200 transition-colors">
                                {vocab.simplified}
                            </span>

                            {/* Tooltip - only show for this specific occurrence */}
                            {hoveredWord?.guid === vocab.guid &&
                                hoveredOccurrenceId === occurrenceId && (
                                    <div className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-80 p-4 bg-white rounded-lg shadow-xl border border-gray-200">
                                        <div className="space-y-3">
                                            {/* Header with Chinese characters */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-chinese text-2xl font-bold">
                                                        {vocab.simplified}
                                                    </div>
                                                    {vocab.traditional &&
                                                        vocab.traditional !==
                                                            vocab.simplified && (
                                                            <div className="font-chinese text-xl text-gray-600">
                                                                (
                                                                {
                                                                    vocab.traditional
                                                                }
                                                                )
                                                            </div>
                                                        )}
                                                </div>
                                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                                    B{vocab.location.book} L
                                                    {vocab.location.lesson}
                                                </span>
                                            </div>

                                            {/* Pinyin */}
                                            <div className="text-lg font-medium text-blue-700">
                                                {vocab.pinyin}
                                            </div>

                                            {/* Meaning */}
                                            <div className="text-gray-800 leading-relaxed">
                                                {vocab.meaning}
                                            </div>

                                            {/* Part of speech and other details */}
                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                                {vocab.partOfSpeech && (
                                                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                                                        {vocab.partOfSpeech}
                                                    </span>
                                                )}
                                                {vocab.notes && (
                                                    <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded">
                                                        Note: {vocab.notes}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Tooltip arrow */}
                                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full -mt-1">
                                            <div className="w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
                                        </div>
                                    </div>
                                )}
                        </span>
                    );
                    remainingText = remainingText.substring(
                        vocab.simplified.length
                    );
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                // No match found, add the character as plain text
                result.push(
                    <span key={`plain-${contextId}-${result.length}`}>
                        {remainingText.charAt(0)}
                    </span>
                );
                remainingText = remainingText.substring(1);
            }
        }

        return result;
    };

    // Get unique speakers for color coding
    const getSpeakerColor = (speaker, index) => {
        const colors = [
            'bg-blue-50 text-blue-800 border-blue-200',
            'bg-green-50 text-green-800 border-green-200',
            'bg-purple-50 text-purple-800 border-purple-200',
            'bg-yellow-50 text-yellow-800 border-yellow-200',
            'bg-pink-50 text-pink-800 border-pink-200',
            'bg-indigo-50 text-indigo-800 border-indigo-200',
        ];
        return colors[index % colors.length];
    };

    // Extract all unique speakers
    const speakers =
        dialogue.type === 'dialogue' && content.content
            ? [...new Set(content.content.map((item) => item.speaker))]
            : [];

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">
                    Loading dialogue...
                </p>
            </div>
        );
    }

    if (!dialogue) {
        return (
            <div className="text-center py-8 text-gray-500">
                <div className="mb-2">👈</div>
                <p>Select a dialogue from the list to preview it here</p>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="text-center py-8 text-gray-500">
                <div className="mb-2">⚠️</div>
                <p>Could not load dialogue content</p>
                <p className="text-sm mt-2">File: {dialogue.filename}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="pb-3 border-b border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {content.title || dialogue.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                        Book {dialogue.book}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                        Lesson {dialogue.lesson}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                        Part {dialogue.dialogue}
                    </span>

                    {/* Participants/Speakers */}
                    {speakers.length > 0 && (
                        <div className="ml-2">
                            <span className="text-gray-500">•</span>
                            <span className="ml-2">
                                {speakers.map((speaker, index) => (
                                    <span
                                        key={speaker}
                                        className="inline-flex items-center"
                                    >
                                        {index > 0 && (
                                            <span className="mx-1 text-gray-400">
                                                •
                                            </span>
                                        )}
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs ${getSpeakerColor(
                                                speaker,
                                                index
                                            )}`}
                                        >
                                            {speaker}
                                        </span>
                                    </span>
                                ))}
                            </span>
                        </div>
                    )}
                </div>

                {/* Vocabulary controls */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {matchingVocabulary.length} new vocabulary words in
                            this dialogue
                        </div>
                        <button
                            onClick={() =>
                                setHighlightVocabulary(!highlightVocabulary)
                            }
                            className={`px-3 py-1 text-sm rounded transition-colors ${
                                highlightVocabulary
                                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {highlightVocabulary
                                ? '✓ Vocabulary Highlighted'
                                : 'Highlight Vocabulary'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div>
                {dialogue.type === 'dialogue' && content.content ? (
                    <div className="space-y-2">
                        {content.content.map((item, index) => {
                            const speakerIndex = speakers.indexOf(item.speaker);
                            const colorClass = getSpeakerColor(
                                item.speaker,
                                speakerIndex
                            );

                            return (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg ${
                                        colorClass.split(' ')[0]
                                    } border-l-4 ${colorClass
                                        .split(' ')[2]
                                        .replace('border-', 'border-l-')}`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Speaker */}
                                        <div className="font-medium text-gray-800 min-w-[60px]">
                                            {item.speaker}:
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            {/* Chinese text with vocabulary highlighting */}
                                            <div className="text-lg font-chinese leading-relaxed">
                                                {highlightText(
                                                    item.text,
                                                    `speaker-${index}`
                                                )}
                                            </div>

                                            {/* Pinyin (if available) */}
                                            {item.pinyin && (
                                                <div className="text-sm text-gray-600 mt-1">
                                                    {item.pinyin}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : content.content ? (
                    // Reading content
                    <div className="space-y-6">
                        {content.content.map((item, index) => (
                            <div
                                key={index}
                                className="text-gray-800 leading-relaxed font-chinese text-lg"
                            >
                                {highlightText(item.text, `reading-${index}`)}
                                {item.pinyin && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        {item.pinyin}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 italic text-center py-8">
                        No content available
                    </div>
                )}
            </div>

            {/* Vocabulary summary */}
            {highlightVocabulary && matchingVocabulary.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800 flex items-center">
                            <span className="mr-2">📚</span>
                            Vocabulary ({matchingVocabulary.length})
                        </h5>
                        <button
                            onClick={() =>
                                setShowVocabularyList(!showVocabularyList)
                            }
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            {showVocabularyList ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    {showVocabularyList && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 font-medium text-gray-700 w-16">
                                            Chinese
                                        </th>
                                        <th className="text-left py-2 font-medium text-gray-700 w-24">
                                            Pinyin
                                        </th>
                                        <th className="text-left py-2 font-medium text-gray-700">
                                            Meaning
                                        </th>
                                        <th className="text-left py-2 font-medium text-gray-700 w-20">
                                            Type
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matchingVocabulary.map((vocab) => (
                                        <tr
                                            key={vocab.guid}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-2">
                                                <div className="flex flex-col">
                                                    <span className="font-chinese text-lg">
                                                        {vocab.simplified}
                                                    </span>
                                                    {vocab.traditional &&
                                                        vocab.traditional !==
                                                            vocab.simplified && (
                                                            <span className="font-chinese text-sm text-gray-500">
                                                                {
                                                                    vocab.traditional
                                                                }
                                                            </span>
                                                        )}
                                                </div>
                                            </td>
                                            <td className="py-2 text-blue-700">
                                                {vocab.pinyin}
                                            </td>
                                            <td className="py-2 text-gray-700">
                                                {vocab.meaning}
                                            </td>
                                            <td className="py-2">
                                                {vocab.partOfSpeech && (
                                                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded whitespace-nowrap">
                                                        {vocab.partOfSpeech}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DialoguePreview;
