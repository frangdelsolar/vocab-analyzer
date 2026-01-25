import React, { useMemo, useState } from 'react';
import { useVocabulary } from '../contexts/VocabularyContext';

const DialoguePreview = ({ dialogue, content, isLoading }) => {
    const { vocabulary } = useVocabulary();
    const [hoveredWord, setHoveredWord] = useState(null);
    const [hoveredOccurrenceId, setHoveredOccurrenceId] = useState(null);
    const [highlightVocabulary, setHighlightVocabulary] = useState(true);
    const [showVocabularyList, setShowVocabularyList] = useState(false);
    const [showPinyin, setShowPinyin] = useState(false); // New state for Pinyin visibility

    const dialogueToRoman = (num) => {
        const map = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V' };
        return map[num] || num.toString();
    };

    const matchingVocabulary = useMemo(() => {
        if (!content || !vocabulary.length) return [];
        const part = content.part || dialogue?.dialogue;
        const targetRomanPart = dialogueToRoman(part);

        return vocabulary.filter((item) => {
            const { location } = item;
            return (
                location?.book === (content.book_number || dialogue?.book) &&
                location?.lesson ===
                    (content.lesson_number || dialogue?.lesson) &&
                location?.vocabulary === targetRomanPart
            );
        });
    }, [dialogue, content, vocabulary]);

    const highlightText = (text, contextId = '') => {
        if (!highlightVocabulary || matchingVocabulary.length === 0)
            return <span>{text}</span>;

        const vocabMap = new Map();
        matchingVocabulary.forEach((v) => {
            vocabMap.set(v.traditional, v);
            vocabMap.set(v.simplified, v);
        });

        const vocabStrings = Array.from(vocabMap.keys()).sort(
            (a, b) => b.length - a.length,
        );
        let result = [];
        let i = 0;
        let occurrenceIndex = 0;

        while (i < text.length) {
            let matchedStr = vocabStrings.find(
                (s) => text.substring(i, i + s.length) === s,
            );

            if (matchedStr) {
                const vocab = vocabMap.get(matchedStr);
                const occurrenceId = `${contextId}-${vocab.guid}-${occurrenceIndex++}`;
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
                        <span className="bg-yellow-100 text-yellow-800 px-1 rounded border border-yellow-200 hover:bg-yellow-200">
                            {matchedStr}
                        </span>
                        {hoveredWord?.guid === vocab.guid &&
                            hoveredOccurrenceId === occurrenceId && (
                                <div className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-72 p-4 bg-white rounded-lg shadow-xl border border-gray-200 text-left">
                                    <div className="font-chinese text-2xl font-bold">
                                        {vocab.traditional}
                                    </div>
                                    <div className="text-blue-700 font-medium">
                                        {vocab.pinyin}
                                    </div>
                                    <div className="text-gray-800 text-sm mt-1">
                                        {vocab.meaning}
                                    </div>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full -mt-1 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45"></div>
                                </div>
                            )}
                    </span>,
                );
                i += matchedStr.length;
            } else {
                result.push(<span key={i}>{text[i]}</span>);
                i++;
            }
        }
        return result;
    };

    const getSpeakerColor = (speaker, index) => {
        const colors = [
            'bg-blue-50 text-blue-800 border-blue-200',
            'bg-green-50 text-green-800 border-green-200',
            'bg-purple-50 text-purple-800 border-purple-200',
        ];
        return colors[index % colors.length];
    };

    const getEmbedUrl = (url) => {
        if (!url) return null;
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11
            ? `https://www.youtube.com/embed/${match[2]}`
            : null;
    };

    if (isLoading)
        return (
            <div className="text-center py-8 italic text-gray-500">
                Loading content...
            </div>
        );
    if (!dialogue || !content)
        return (
            <div className="text-center py-8 text-gray-500 italic">
                Select a lesson to preview
            </div>
        );

    const isDialogue = content.dialogue_id === 'dialogue';
    const speakers = isDialogue ? content.participants || [] : [];
    const videoEmbed = getEmbedUrl(content.youtube_url);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="pb-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-xl font-bold text-gray-900">
                            {content.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                            Book {content.book_number || dialogue.book} • Lesson{' '}
                            {content.lesson_number} •{' '}
                            {isDialogue ? 'Dialogue' : 'Reading'}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowPinyin(!showPinyin)}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors ${showPinyin ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                    >
                        {showPinyin ? 'Hide Pinyin' : 'Show Pinyin'}
                    </button>
                </div>
            </div>

            {/* Video Player */}
            {videoEmbed && (
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-sm border border-gray-200">
                    <iframe
                        width="100%"
                        height="100%"
                        src={videoEmbed}
                        title="Lesson Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}

            {/* Main Content */}
            <div className="space-y-4">
                {isDialogue ? (
                    content.content.map((item, index) => {
                        const speakerIndex = speakers.indexOf(item.speaker);
                        const colorClass = getSpeakerColor(
                            item.speaker,
                            speakerIndex,
                        );
                        return (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border-l-4 ${colorClass}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="font-bold min-w-[70px]">
                                        {item.speaker}:
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-lg font-chinese leading-relaxed">
                                            {highlightText(
                                                item.text,
                                                `d-${index}`,
                                            )}
                                        </div>
                                        {showPinyin && item.pinyin && (
                                            <div className="text-sm opacity-80 mt-1 font-sans">
                                                {item.pinyin}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="space-y-6">
                        {content.content.map((item, index) => (
                            <div key={index}>
                                <p className="text-lg font-chinese leading-loose text-justify indent-8">
                                    {highlightText(item.text, `r-${index}`)}
                                </p>
                                {showPinyin && item.pinyin && (
                                    <p className="text-sm text-gray-500 mt-2 italic font-sans">
                                        {item.pinyin}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Vocabulary Footer */}
            <div className="pt-6 border-t border-gray-100">
                <button
                    onClick={() => setShowVocabularyList(!showVocabularyList)}
                    className="text-sm font-medium text-gray-500 hover:text-gray-800 flex items-center gap-2"
                >
                    {showVocabularyList
                        ? '▼ Hide Word List'
                        : '▶ Show Word List'}{' '}
                    ({matchingVocabulary.length})
                </button>
                {showVocabularyList && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {matchingVocabulary.map((v) => (
                            <div
                                key={v.guid}
                                className="p-3 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-100"
                            >
                                <div>
                                    <div className="font-chinese font-bold text-gray-900">
                                        {v.traditional}
                                    </div>
                                    <div className="text-xs text-blue-600">
                                        {v.pinyin}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 text-right max-w-[50%]">
                                    {v.meaning}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DialoguePreview;
