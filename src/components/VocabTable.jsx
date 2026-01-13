import React from 'react';

const VocabTable = ({ data, onSort, sortConfig }) => {
    // Helper to render the sort arrow
    const getSortIcon = (columnName) => {
        if (sortConfig.key !== columnName) return '↕️';
        return sortConfig.direction === 'asc' ? '🔼' : '🔽';
    };

    // Helper to render location badge
    const getLocationBadge = (item) => {
        const romanNumerals = [
            '',
            'I',
            'II',
            'III',
            'IV',
            'V',
            'VI',
            'VII',
            'VIII',
            'IX',
            'X',
        ];
        const listRoman = romanNumerals[item.list] || item.list;
        return `B${item.book}L${item.lesson}-${listRoman}`;
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
                        <th
                            onClick={() => onSort('pos')}
                            className="p-4 cursor-pointer hover:bg-slate-700 transition-colors text-center"
                        >
                            POS {getSortIcon('pos')}
                        </th>
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
                                <td className="p-4">
                                    <div className="text-3xl font-bold text-slate-900">
                                        {item.hanzi}
                                    </div>
                                    {item.traditional &&
                                        item.traditional !== item.hanzi && (
                                            <div className="text-sm text-slate-500 mt-1">
                                                {item.traditional}
                                            </div>
                                        )}
                                </td>
                                <td className="p-4">
                                    <div className="text-slate-600 font-medium italic">
                                        {item.pinyin}
                                    </div>
                                    {item.tags && (
                                        <div className="text-xs text-slate-400 mt-1">
                                            {item.tags
                                                .split(' ')
                                                .map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="mr-2"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 uppercase font-semibold">
                                        {item.pos || 'N/A'}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-800">
                                    <div className="line-clamp-2">
                                        {item.translation}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200 shadow-sm">
                                            Book {item.book}
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-slate-500">
                                            {getLocationBadge(item)}
                                        </span>
                                        <span className="text-[9px] text-slate-400">
                                            ID: {item.id}
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
                                No vocabulary found matching your search. Try
                                different keywords.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VocabTable;
