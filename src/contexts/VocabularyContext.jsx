import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
} from 'react';

export const VocabularyContext = createContext({
    vocabulary: [],
    filteredVocabulary: [],
    isLoading: true,
    error: null,
    selectedLists: [],
    selectList: () => {},
    deselectList: () => {},
    clearSelection: () => {},
});

export const useVocabulary = () => {
    const context = useContext(VocabularyContext);
    if (!context) {
        throw new Error(
            'useVocabulary must be used within a VocabularyProvider'
        );
    }
    return context;
};

// Helper to extract unique lists from vocabulary
const extractVocabularyLists = (vocabulary) => {
    const lists = {};

    vocabulary.forEach((item) => {
        const { location } = item;
        if (!location) return;

        const { book, lesson, vocabulary: vocabSection } = location;
        const key = `${book}-${lesson}-${vocabSection}`;

        if (!lists[key]) {
            lists[key] = {
                book,
                lesson,
                vocabulary: vocabSection,
                count: 0,
                label: `B${book} L${lesson} ${vocabSection}`,
                key,
            };
        }
        lists[key].count++;
    });

    return Object.values(lists);
};

export const VocabularyProvider = ({ children }) => {
    const [vocabulary, setVocabulary] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLists, setSelectedLists] = useState([]);

    useEffect(() => {
        const loadVocabulary = async () => {
            try {
                const response = await fetch('/parsed-cards.json');
                const data = await response.json();
                setVocabulary(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadVocabulary();
    }, []);

    // Get all available lists
    const availableLists = useMemo(() => {
        return extractVocabularyLists(vocabulary);
    }, [vocabulary]);

    // Filter vocabulary based on selected lists
    const filteredVocabulary = useMemo(() => {
        if (selectedLists.length === 0) {
            return vocabulary;
        }

        return vocabulary.filter((item) => {
            const { location } = item;
            if (!location) return false;

            const { book, lesson, vocabulary: vocabSection } = location;

            return selectedLists.some((listKey) => {
                const [listBook, listLesson, listVocab] = listKey.split('-');
                return (
                    parseInt(listBook) === book &&
                    parseInt(listLesson) === lesson &&
                    listVocab === vocabSection
                );
            });
        });
    }, [vocabulary, selectedLists]);

    const selectList = (listKey) => {
        setSelectedLists((prev) => {
            if (!prev.includes(listKey)) {
                return [...prev, listKey];
            }
            return prev;
        });
    };

    const deselectList = (listKey) => {
        setSelectedLists((prev) => prev.filter((key) => key !== listKey));
    };

    const clearSelection = () => {
        setSelectedLists([]);
    };

    const value = {
        vocabulary,
        filteredVocabulary,
        isLoading,
        error,
        selectedLists,
        availableLists,
        selectList,
        deselectList,
        clearSelection,
    };

    return (
        <VocabularyContext.Provider value={value}>
            {children}
        </VocabularyContext.Provider>
    );
};
