import React, { useState, useMemo } from 'react';

const CharacterLibrary = ({ charStats, dialogueStats }) => {
    const [localSort, setLocalSort] = useState('dialogue'); // 'dialogue' | 'study'

    const processedChars = useMemo(() => {
        return [...charStats].sort((a, b) => {
            if (localSort === 'dialogue') {
                return (
                    (dialogueStats.charFreq[a.char] || 0) -
                    (dialogueStats.charFreq[b.char] || 0)
                );
            }
            return b.count - a.count;
        });
    }, [charStats, dialogueStats, localSort]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="font-black text-slate-800 uppercase tracking-tighter">
                    Character Mastery
                </h2>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setLocalSort('dialogue')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            localSort === 'dialogue'
                                ? 'bg-white shadow text-blue-600'
                                : 'text-slate-500'
                        }`}
                    >
                        Priority (Least Seen)
                    </button>
                    <button
                        onClick={() => setLocalSort('study')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            localSort === 'study'
                                ? 'bg-white shadow text-blue-600'
                                : 'text-slate-500'
                        }`}
                    >
                        Most Used in Words
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="max-h-[70vh] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-800 text-white text-[10px] uppercase font-black z-10">
                            <tr>
                                <th className="p-4">Character</th>
                                <th className="p-4">Dialogue Freq</th>
                                <th className="p-4">Used in Vocabulary</th>
                                <th className="p-4 text-right">Study Count</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {processedChars.map((stat) => {
                                const dFreq =
                                    dialogueStats.charFreq[stat.char] || 0;
                                return (
                                    <tr
                                        key={stat.char}
                                        className="hover:bg-blue-50/50 transition-colors"
                                    >
                                        <td className="p-4 text-4xl font-black text-slate-900">
                                            {stat.char}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-black ${
                                                    dFreq === 0
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-blue-600 text-white'
                                                }`}
                                            >
                                                {dFreq}x
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {stat.appearances.map(
                                                    (word, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-1 bg-white border border-slate-200 rounded text-sm text-slate-600 shadow-sm"
                                                        >
                                                            {word}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-mono text-slate-400 text-sm">
                                            {stat.count} words
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CharacterLibrary;
