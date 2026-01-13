import React, { createContext, useContext, useState, useEffect } from 'react';

export const VocabularyContext = createContext({
    vocabulary: [],
    isLoading: true,
    error: null,
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

export const VocabularyProvider = ({ children }) => {
    const [vocabulary, setVocabulary] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const value = {
        vocabulary,
        isLoading,
        error,
    };

    return (
        <VocabularyContext.Provider value={value}>
            {children}
        </VocabularyContext.Provider>
    );
};
