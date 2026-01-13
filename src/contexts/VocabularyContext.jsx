import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of a vocabulary item based on your JSON structure
export const VocabularyItem = {
    guid: '',
    lessonId: '',
    traditional: '',
    simplified: '',
    pinyin: '',
    meaning: '',
    partOfSpeech: '',
    deck: '',
    tags: '',
    variants: null,
    location: {
        book: 1,
        lesson: 1,
        vocabulary: 'I',
        order: 1,
        section: 'I',
        fullLesson: '',
        lessonNumber: 1,
        lessonString: '',
    },
};

// Define the context type
export const VocabularyContext = createContext({
    vocabulary: [],
    isLoading: true,
    error: null,
    selectedVocabulary: [],
    filters: {},
    setFilters: () => {},
    filteredVocabulary: [],
    getVocabularyByLesson: () => [],
    getVocabularyByDeck: () => [],
    refreshVocabulary: () => {},
});

// Custom hook to use the vocabulary context
export const useVocabulary = () => {
    const context = useContext(VocabularyContext);
    if (!context) {
        throw new Error(
            'useVocabulary must be used within a VocabularyProvider'
        );
    }
    return context;
};

// Provider component
export const VocabularyProvider = ({ children }) => {
    const [vocabulary, setVocabulary] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});

    // Load vocabulary data on component mount
    useEffect(() => {
        const loadVocabulary = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/parsed-cards.json');

                if (!response.ok) {
                    throw new Error(
                        `Failed to load vocabulary data: ${response.status}`
                    );
                }

                const data = await response.json();
                setVocabulary(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error loading vocabulary:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadVocabulary();
    }, []);

    // Function to refresh vocabulary data
    const refreshVocabulary = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/parsed-cards.json');

            if (!response.ok) {
                throw new Error(
                    `Failed to refresh vocabulary data: ${response.status}`
                );
            }

            const data = await response.json();
            setVocabulary(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error refreshing vocabulary:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Get filtered vocabulary based on current filters
    const filteredVocabulary = React.useMemo(() => {
        if (!filters || Object.keys(filters).length === 0) {
            return vocabulary;
        }

        return vocabulary.filter((item) => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value || value === '') return true;

                switch (key) {
                    case 'lesson':
                        return (
                            item.location.lessonNumber === value ||
                            item.fullLesson === value ||
                            item.lessonString === value
                        );

                    case 'deck':
                        return item.deck === value;

                    case 'search':
                        const searchTerm = value.toLowerCase();
                        return (
                            item.traditional
                                .toLowerCase()
                                .includes(searchTerm) ||
                            item.simplified
                                .toLowerCase()
                                .includes(searchTerm) ||
                            item.pinyin.toLowerCase().includes(searchTerm) ||
                            item.meaning.toLowerCase().includes(searchTerm)
                        );

                    case 'tags':
                        return item.tags && item.tags.includes(value);

                    default:
                        return true;
                }
            });
        });
    }, [vocabulary, filters]);

    // Get vocabulary by lesson
    const getVocabularyByLesson = (lesson) => {
        return vocabulary.filter(
            (item) =>
                item.location.lessonNumber === lesson ||
                item.fullLesson === lesson ||
                item.lessonString === lesson
        );
    };

    // Get vocabulary by deck
    const getVocabularyByDeck = (deck) => {
        return vocabulary.filter((item) => item.deck === deck);
    };

    // For now, selectedVocabulary is the same as filteredVocabulary
    // but we can add selection logic later
    const selectedVocabulary = filteredVocabulary;

    const value = {
        vocabulary,
        isLoading,
        error,
        selectedVocabulary,
        filters,
        setFilters,
        filteredVocabulary,
        getVocabularyByLesson,
        getVocabularyByDeck,
        refreshVocabulary,
    };

    return (
        <VocabularyContext.Provider value={value}>
            {children}
        </VocabularyContext.Provider>
    );
};

// Utility hook for table usage
export const useVocabularyTable = () => {
    const { selectedVocabulary, isLoading, error, filters, setFilters } =
        useVocabulary();

    const tableColumns = React.useMemo(
        () => [
            { key: 'simplified', label: 'Simplified', sortable: true },
            { key: 'traditional', label: 'Traditional', sortable: true },
            { key: 'pinyin', label: 'Pinyin', sortable: true },
            { key: 'meaning', label: 'Meaning', sortable: true },
            { key: 'deck', label: 'Deck', sortable: true },
            { key: 'fullLesson', label: 'Lesson', sortable: true },
        ],
        []
    );

    return {
        vocabulary: selectedVocabulary,
        isLoading,
        error,
        columns: tableColumns,
        filters,
        setFilters,
        totalCount: selectedVocabulary.length,
    };
};
