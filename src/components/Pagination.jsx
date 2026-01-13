import React from 'react';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems,
}) => {
    const pageOptions = [5, 10, 20, 50];

    return (
        <div
            style={{
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
            }}
        >
            {/* Items per page selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <label>Show:</label>
                <select
                    value={itemsPerPage}
                    onChange={(e) =>
                        onItemsPerPageChange(Number(e.target.value))
                    }
                    style={{ padding: '4px 8px' }}
                >
                    {pageOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <span>per page</span>
            </div>

            {/* Page info */}
            <div>
                Page {currentPage} of {totalPages} ({totalItems} total items)
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: '5px' }}>
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    style={{ padding: '4px 8px' }}
                >
                    First
                </button>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ padding: '4px 8px' }}
                >
                    Previous
                </button>

                {/* Page numbers */}
                <div style={{ display: 'flex', gap: '2px' }}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                style={{
                                    padding: '4px 8px',
                                    fontWeight:
                                        currentPage === pageNum
                                            ? 'bold'
                                            : 'normal',
                                    backgroundColor:
                                        currentPage === pageNum
                                            ? '#007bff'
                                            : 'white',
                                    color:
                                        currentPage === pageNum
                                            ? 'white'
                                            : 'black',
                                    border: '1px solid #ccc',
                                }}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ padding: '4px 8px' }}
                >
                    Next
                </button>

                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    style={{ padding: '4px 8px' }}
                >
                    Last
                </button>
            </div>

            {/* Page input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <label>Go to page:</label>
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                        const page = Math.max(
                            1,
                            Math.min(totalPages, Number(e.target.value) || 1)
                        );
                        onPageChange(page);
                    }}
                    style={{ width: '60px', padding: '4px' }}
                />
            </div>
        </div>
    );
};

export default Pagination;
