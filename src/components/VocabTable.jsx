import React from 'react';

const VocabTable = ({ data, studyMode }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-800 text-white uppercase text-xs font-bold tracking-wider">
                    <tr>
                        <th className="p-4">Hanzi</th>
                        <th className="p-4">Pinyin</th>
                        <th className="p-4 text-center">POS</th>
                        <th className="p-4">Translation</th>
                        <th className="p-4 text-center">Location</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.length > 0 ? (
                        data.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                <td className="p-4 text-3xl font-bold text-slate-900">
                                    {item.hanzi}
                                </td>
                                <td className="p-4 text-slate-600 font-medium italic">
                                    {item.pinyin}
                                </td>
                                <td className="p-4 text-center">
                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 uppercase font-semibold">
                                        {item.pos || 'N/A'}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-800">
                                    <span
                                        className={
                                            studyMode
                                                ? 'blur-md select-none bg-slate-100 rounded px-1'
                                                : ''
                                        }
                                    >
                                        {item.translation}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200 shadow-sm whitespace-nowrap">
                                            Book {item.book}
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-slate-500">
                                            L{item.lesson} · List {item.list}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="5"
                                className="p-10 text-center text-slate-400 italic"
                            >
                                No vocabulary found matching your filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VocabTable;
