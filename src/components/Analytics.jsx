import React from 'react';

const Analytics = ({
    charStats,
    totalWords,
    totalUniqueChars,
    dialogueStats,
}) => {
    // Sort by Dialogue Frequency (Low to High) for the "Review Priority" logic
    const priorityList = [...charStats].sort((a, b) => {
        const freqA = dialogueStats.charFreq[a.char] || 0;
        const freqB = dialogueStats.charFreq[b.char] || 0;
        return freqA - freqB;
    });

    return (
        <div className="space-y-6">
            {/* ... Summary Cards (Total Words, etc.) ... */}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-800 border-b flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm uppercase tracking-widest">
                        Character Review Priority
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono italic">
                        Showing Study List usage vs. Dialogue usage
                    </span>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-100 shadow-sm text-[10px] text-slate-500 uppercase font-black">
                            <tr>
                                <th className="p-4">Char</th>
                                <th className="p-4">Dialogue Freq</th>
                                <th className="p-4">
                                    Words Involved (Study List)
                                </th>
                                <th className="p-4 text-center">
                                    Total Study Apperance
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {priorityList.map((stat) => {
                                const dFreq =
                                    dialogueStats.charFreq[stat.char] || 0;
                                return (
                                    <tr
                                        key={stat.char}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="p-4 text-4xl font-bold text-slate-900">
                                            {stat.char}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-black min-w-[32px] inline-block text-center ${
                                                    dFreq === 0
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-blue-600 text-white'
                                                }`}
                                            >
                                                {dFreq}x
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {stat.appearances.map(
                                                    (word, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200"
                                                        >
                                                            {word}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-sm font-mono text-slate-400">
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

export default Analytics;
