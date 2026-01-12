import React, { useState, useMemo } from 'react';

const DialogueViewer = ({ dialogues, vocabData }) => {
    const [selectedId, setSelectedId] = useState(null);

    const activeDialogue = useMemo(
        () => dialogues.find((d) => d.dialogue_id === selectedId),
        [selectedId, dialogues]
    );

    // Analyze the dialogue against your vocabulary list
    const analysis = useMemo(() => {
        if (!activeDialogue || !vocabData) return null;

        const allChars = activeDialogue.content
            .map((line) => line.text)
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
            {/* Sidebar: List of Dialogues */}
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
                                ID: {d.dialogue_id}
                            </span>
                            <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded">
                                L{d.lesson}
                            </span>
                        </div>
                        <div className="font-bold mt-1 truncate">{d.title}</div>
                    </button>
                ))}
            </div>

            {/* Main View: Dialogue Reader */}
            <div className="lg:col-span-2">
                {activeDialogue ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Analysis Header */}
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
                                        New Characters to Study:
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {analysis.missing.map((c) => (
                                            <span
                                                key={c}
                                                className="bg-orange-500/20 text-orange-300 px-1 rounded text-xs"
                                            >
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Script Body */}
                        <div className="p-6 space-y-8 max-h-[600px] overflow-y-auto bg-slate-50/50">
                            {activeDialogue.content.map((line, idx) => (
                                <div key={idx} className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                                        {line.speaker}
                                    </span>
                                    <div className="group">
                                        <p className="text-slate-400 text-sm font-serif italic mb-1 group-hover:text-slate-600 transition-colors">
                                            {line.pinyin}
                                        </p>
                                        <p className="text-3xl font-medium text-slate-900 leading-relaxed">
                                            {line.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 italic">
                        Select a dialogue from the list to start reading
                    </div>
                )}
            </div>
        </div>
    );
};

export default DialogueViewer;
