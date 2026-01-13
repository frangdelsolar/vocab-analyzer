import React from 'react';

const DialoguePreview = ({ dialogue, content, isLoading }) => {
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
                                            {/* Chinese text */}
                                            <div className="text-lg font-chinese">
                                                {item.text}
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
                    // Reading content - simplified without paragraph numbers
                    <div className="space-y-6">
                        {content.content.map((item, index) => (
                            <div
                                key={index}
                                className="text-gray-800 leading-relaxed font-chinese text-lg"
                            >
                                {item.text}
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
        </div>
    );
};

export default DialoguePreview;
