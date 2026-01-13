import React from 'react';
import { useVocabulary } from '../contexts/VocabularyContext';

const VocabularyTable = () => {
    const { vocabulary, isLoading, error } = useVocabulary();
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

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

    return (
        <div>
            <table border="1" cellPadding="8">
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
                            <td>{item.simplified}</td>
                            <td>{item.traditional}</td>
                            <td>{item.pinyin}</td>
                            <td>{item.meaning}</td>
                            <td>{item.deck}</td>
                            <td>{item.location?.lessonNumber}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Simple pagination */}
            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <span style={{ margin: '0 10px' }}>
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {/* Log vocabulary */}
            {console.log('Vocabulary loaded:', vocabulary)}
        </div>
    );
};

export default VocabularyTable;
