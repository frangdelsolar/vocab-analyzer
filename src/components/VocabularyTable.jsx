import React, { useState } from 'react';
import { useVocabulary } from '../contexts/VocabularyContext';
import Pagination from './Pagination';

const VocabularyTable = () => {
    const { vocabulary, isLoading, error } = useVocabulary();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    if (isLoading) {
        return (
            <div className="text-center py-8 text-gray-600">
                Loading vocabulary...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600">Error: {error}</div>
        );
    }

    // Calculate pagination
    const totalPages = Math.ceil(vocabulary.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = vocabulary.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Vocabulary
                </h2>
                <p className="text-gray-600">{vocabulary.length} items total</p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Simplified
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Traditional
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pinyin
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Meaning
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Deck
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lesson
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item) => (
                            <tr key={item.guid} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap font-chinese text-lg font-medium text-gray-900">
                                    {item.simplified}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-chinese text-lg text-gray-700">
                                    {item.traditional}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                    {item.pinyin}
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                    {item.meaning}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                        {item.deck}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {item.location?.lessonNumber}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                totalItems={vocabulary.length}
            />
        </div>
    );
};

export default VocabularyTable;
