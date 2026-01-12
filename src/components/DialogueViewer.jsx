import React, { useState, useMemo } from 'react';

const DialogueViewer = ({ dialogues, vocabData }) => {
    const [selectedId, setSelectedId] = useState(null);

    const activeDialogue = useMemo(
        () => dialogues.find((d) => d.dialogue_id === selectedId),
        [selectedId, dialogues]
    );

    const analysis = useMemo(() => {
        if (!activeDialogue || !vocabData) return null;

        const allChars = activeDialogue.content
            .map((item) => item.text)
            .join('');
        const uniqueChars = [
            ...new Set(allChars.replace(/[，。？！、：]/g, '')),
        ];
        const knownChars = vocabData.map((item) => item.hanzi).join('');

        const coverage = uniqueChars.filter((char) =>
            knownChars.includes(char)
        );
        const missing = uniqueChars.filter(
            (char) => !knownChars.includes(char)
        );

        return {
            totalUnique: uniqueChars.length,
            percentKnown: (
                (coverage.length / uniqueChars.length) *
                100
            ).toFixed(0),
            missing,
        };
    }, [activeDialogue, vocabData]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-3">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest px-2">
                    Available Texts
                </h3>
                {dialogues.map((d) => (
                    <button
                        key={d.dialogue_id}
                        onClick={() => setSelectedId(d.dialogue_id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                            selectedId === d.dialogue_id
                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] opacity-80 font-mono">
                                {d.dialogue_id}
                            </span>
                            <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded">
                                {d.participants ? 'Dialogue' : 'Reading'}
                            </span>
                        </div>
                        <div className="font-bold mt-1 truncate">{d.title}</div>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
                {activeDialogue ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-800 p-6 text-white">
                            <h2 className="text-2xl font-black">
                                {activeDialogue.title}
                            </h2>
                            <div className="flex gap-4 mt-4">
                                <div className="text-center">
                                    <div className="text-blue-400 text-xl font-bold">
                                        {analysis.percentKnown}%
                                    </div>
                                    <div className="text-[10px] uppercase opacity-60">
                                        Known Chars
                                    </div>
                                </div>
                                <div className="h-10 w-[1px] bg-white/10"></div>
                                <div>
                                    <div className="text-[10px] uppercase opacity-60 mb-1">
                                        New Characters:
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {analysis.missing.length > 0 ? (
                                            analysis.missing.map((c) => (
                                                <span
                                                    key={c}
                                                    className="bg-orange-500/20 text-orange-300 px-1 rounded text-xs"
                                                >
                                                    {c}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-green-400 text-xs">
                                                All characters known!
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto bg-slate-50/50">
                            {activeDialogue.content.map((item, idx) => {
                                const isDialogue = !!item.speaker;

                                return (
                                    <div
                                        key={idx}
                                        className={`flex flex-col ${
                                            isDialogue ? 'gap-1' : 'gap-3'
                                        }`}
                                    >
                                        {isDialogue && (
                                            <span className="text-[10px] font-black text-blue-600 uppercase">
                                                {item.speaker}
                                            </span>
                                        )}
                                        <div className="group">
                                            {item.pinyin && (
                                                <p className="text-slate-400 text-sm font-serif italic mb-1 group-hover:text-slate-600 transition-colors">
                                                    {item.pinyin}
                                                </p>
                                            )}
                                            <p
                                                className={`${
                                                    isDialogue
                                                        ? 'text-3xl'
                                                        : 'text-xl leading-relaxed text-justify'
                                                } font-medium text-slate-900`}
                                            >
                                                {isDialogue
                                                    ? item.text
                                                    : `　　${item.text}`}
                                            </p>
                                        </div>
                                        {!isDialogue && <div className="h-2" />}{' '}
                                        {/* Extra space between paragraphs */}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 italic">
                        Select a dialogue or reading from the list to start
                    </div>
                )}
            </div>
        </div>
    );
};

export default DialogueViewer;
