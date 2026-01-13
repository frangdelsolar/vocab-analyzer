import React, { useState } from 'react';
import { useVocabulary } from '../contexts/VocabularyContext';
import Pagination from './Pagination';

const VocabularyTable = () => {
    const { vocabulary, isLoading, error } = useVocabulary();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
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
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    return (
        <div>
            <table
                border="1"
                cellPadding="8"
                style={{ width: '100%', borderCollapse: 'collapse' }}
            >
                <thead>
                    <tr>
                        <th>Simplified</th>
                        <th>Traditional</th>
                        <th>Pinyin</th>
                        <th>Meaning</th>
                        <th>Deck</th>
                        <th>Lesson</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => (
                        <tr key={item.guid}>
                            <td style={{ padding: '8px' }}>
                                {item.simplified}
                            </td>
                            <td style={{ padding: '8px' }}>
                                {item.traditional}
                            </td>
                            <td style={{ padding: '8px' }}>{item.pinyin}</td>
                            <td style={{ padding: '8px' }}>{item.meaning}</td>
                            <td style={{ padding: '8px' }}>{item.deck}</td>
                            <td style={{ padding: '8px' }}>
                                {item.location?.lessonNumber}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Log vocabulary */}
            {console.log('Vocabulary loaded:', vocabulary)}

            {/* Pagination component */}
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
