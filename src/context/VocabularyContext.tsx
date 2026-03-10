'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react';

// 1. Interfaces
export interface AnkiCard {
    traditional: string;
    simplified: string;
    pinyin: string;
    meaning: string;
    location: {
        book: number;
        lesson: number;
        section: number;
    };
}

export interface LocationTree {
    books: {
        [bookId: string]: {
            lessons: {
                [lessonId: string]: {
                    sections: number[];
                };
            };
        };
    };
}

interface FilterOptions {
    book: number;
    lesson: number;
    section: number;
    cumulative: boolean;
}

// 2. Provider Implementation
interface VocabContextType {
    cards: AnkiCard[];
    metadata: LocationTree | null;
    dialogueManifest: string[];
    isLoading: boolean;
    getFilteredCards: (options: FilterOptions) => AnkiCard[];
}
const VocabContext = createContext<VocabContextType | undefined>(undefined);

export const VocabProvider = ({ children }: { children: React.ReactNode }) => {
    const [cards, setCards] = useState<AnkiCard[]>([]);
    const [metadata, setMetadata] = useState<LocationTree | null>(null);
    const [dialogueManifest, setDialogueManifest] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadResources = async () => {
            try {
                const [cardsRes, treeRes, manifestRes] = await Promise.all([
                    fetch('/parsed-cards.json'),
                    fetch('/location-tree.json'),
                    fetch('/dialogues/manifest.json'), // Fetch the manifest
                ]);

                const cardsData = await cardsRes.json();
                const treeData = await treeRes.json();
                const manifestData = await manifestRes.json();

                setCards(cardsData);
                setMetadata(treeData);
                setDialogueManifest(manifestData.files); // Store the filenames
            } catch (err) {
                console.error('Resource loading error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadResources();
    }, []);

    /**
     * The Filter Function
     * Optimized to filter the preloaded cards based on user progress.
     */
    const getFilteredCards = useCallback(
        ({ book, lesson, section, cumulative }: FilterOptions) => {
            if (cards.length === 0) return [];

            return cards.filter((card) => {
                const c = card.location;

                if (cumulative) {
                    // Logic:
                    // 1. Any book previous to current
                    // 2. Current book, any lesson previous to current
                    // 3. Current book, current lesson, any section up to current
                    if (c.book < book) return true;
                    if (c.book === book && c.lesson < lesson) return true;
                    if (
                        c.book === book &&
                        c.lesson === lesson &&
                        c.section <= section
                    )
                        return true;
                    return false;
                } else {
                    // Strict match for a specific dialogue part
                    return (
                        c.book === book &&
                        c.lesson === lesson &&
                        c.section === section
                    );
                }
            });
        },
        [cards],
    );

    return (
        <VocabContext.Provider
            value={{
                cards,
                metadata,
                dialogueManifest,
                isLoading,
                getFilteredCards,
            }}
        >
            {children}
        </VocabContext.Provider>
    );
};
// 3. Hook
export const useVocabulary = () => {
    const context = useContext(VocabContext);
    if (!context) {
        throw new Error('useVocabulary must be used within a VocabProvider');
    }
    return context;
};
