import React from 'react';

const ReviewPriority = ({ charStats, dialogueStats }) => {
    // Merge dialogue frequency into the existing character stats
    const priorityList = charStats
        .map((stat) => ({
            ...stat,
            dialogueCount: dialogueStats.charFreq[stat.char] || 0,
        }))
        .sort((a, b) => a.dialogueCount - b.dialogueCount); // Sort by LEAST frequent

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
            <div className="p-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
                <h3 className="font-bold text-orange-800 text-sm uppercase">
                    Systematic Review Targets (Low Frequency)
                </h3>
                <span className="text-[10px] bg-orange-200 text-orange-800 px-2 py-1 rounded">
                    FOCUS ON THESE
                </span>
            </div>
            <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black">
                        <tr>
                            <th className="p-4">Char</th>
                            <th className="p-4">Total Appereances</th>
                            <th className="p-4">Dialogue Frequency</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {priorityList.slice(0, 20).map((item) => (
                            <tr
                                key={item.char}
                                className="hover:bg-orange-50/30"
                            >
                                <td className="p-4 text-3xl font-bold">
                                    {item.char}
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    {item.count} words
                                </td>
                                <td className="p-4">
                                    <span
                                        className={`font-mono font-bold ${
                                            item.dialogueCount === 0
                                                ? 'text-red-500'
                                                : 'text-slate-700'
                                        }`}
                                    >
                                        {item.dialogueCount}x in dialogues
                                    </span>
                                </td>
                                <td className="p-4">
                                    {item.dialogueCount === 0 ? (
                                        <span className="text-[9px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold uppercase">
                                            At Risk of Forgetting
                                        </span>
                                    ) : (
                                        <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold uppercase">
                                            Low Exposure
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReviewPriority;
