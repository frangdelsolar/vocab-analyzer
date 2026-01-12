import React from 'react';

const VocabTable = ({ data, studyMode, onSort, sortConfig }) => {
    // Helper to render the sort arrow
    const getSortIcon = (columnName) => {
        if (sortConfig.key !== columnName) return '↕️';
        return sortConfig.direction === 'asc' ? '🔼' : '🔽';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-800 text-white uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                        <th
                            onClick={() => onSort('hanzi')}
                            className="p-4 cursor-pointer hover:bg-slate-700 transition-colors"
                        >
                            Hanzi {getSortIcon('hanzi')}
                        </th>
                        <th
                            onClick={() => onSort('pinyin')}
                            className="p-4 cursor-pointer hover:bg-slate-700 transition-colors"
                        >
                            Pinyin {getSortIcon('pinyin')}
                        </th>
                        <th className="p-4 text-center">POS</th>
                        <th
                            onClick={() => onSort('translation')}
                            className="p-4 cursor-pointer hover:bg-slate-700 transition-colors"
                        >
                            Translation {getSortIcon('translation')}
                        </th>
                        <th
                            onClick={() => onSort('lesson')}
                            className="p-4 text-center cursor-pointer hover:bg-slate-700 transition-colors"
                        >
                            Location {getSortIcon('lesson')}
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.length > 0 ? (
                        data.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-slate-50 transition-colors group"
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
                                        <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200 shadow-sm">
                                            Book {item.book}
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-slate-500">
                                            L{item.lesson} · V{item.list}
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
                                No matches.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VocabTable;
