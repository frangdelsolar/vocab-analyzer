import React, { useEffect } from 'react';
import { useVocabulary } from '../contexts/VocabularyContext';

const VocabularyTable = () => {
    const {
        vocabulary,
        isLoading,
        error,
        selectedVocabulary,
        filteredVocabulary,
        totalCount,
    } = useVocabulary();

    // Log the available vocabulary data
    useEffect(() => {
        console.log('Vocabulary data loaded:', {
            vocabulary,
            selectedVocabulary,
            filteredVocabulary,
            totalCount,
            isLoading,
            error,
        });

        // Log first few items for inspection
        if (vocabulary.length > 0) {
            console.log('First 3 vocabulary items:', vocabulary.slice(0, 3));
        }
    }, [vocabulary, selectedVocabulary, filteredVocabulary, isLoading, error]);

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-lg text-gray-600">
                    Loading vocabulary data...
                </div>
                <div className="mt-2 text-sm text-gray-500">
                    This may take a moment
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg shadow p-8">
                <div className="text-lg font-semibold text-red-700">
                    Error Loading Data
                </div>
                <div className="mt-2 text-red-600">{error}</div>
                <div className="mt-4 text-sm text-gray-600">
                    Please make sure parsed-cards.json exists in the public
                    folder
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Vocabulary List
                    </h2>
                    <div className="text-sm text-gray-600">
                        Showing{' '}
                        <span className="font-bold">
                            {filteredVocabulary.length}
                        </span>{' '}
                        of{' '}
                        <span className="font-bold">{vocabulary.length}</span>{' '}
                        items
                    </div>
                </div>
            </div>

            {/* Empty table structure - we'll fill this later */}
            <div className="overflow-x-auto">
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
                        {filteredVocabulary.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    No vocabulary items found
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    Table rows will be populated here in the
                                    next step.
                                    <div className="mt-4 text-sm">
                                        Check the browser console for the
                                        vocabulary data.
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Data summary card - shows we have the data */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <span className="font-medium">Total Items:</span>{' '}
                            <span className="font-bold">
                                {vocabulary.length}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">Selected Items:</span>{' '}
                            <span className="font-bold">
                                {selectedVocabulary.length}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">Filtered Items:</span>{' '}
                            <span className="font-bold">
                                {filteredVocabulary.length}
                            </span>
                        </div>
                    </div>

                    {vocabulary.length > 0 && (
                        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-100">
                            <div className="font-medium text-blue-800 mb-2">
                                Sample Data from Context:
                            </div>
                            <div className="space-y-2">
                                {vocabulary.slice(0, 2).map((item, index) => (
                                    <div key={item.guid} className="text-sm">
                                        <div>
                                            <span className="font-chinese font-medium">
                                                {item.simplified}
                                            </span>{' '}
                                            ({item.traditional}) - {item.pinyin}
                                        </div>
                                        <div className="text-gray-700">
                                            {item.meaning}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VocabularyTable;
