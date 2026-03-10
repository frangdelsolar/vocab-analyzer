'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useMemo,
} from 'react';
import { useUser } from './UserContext';

// --- Interfaces ---
export interface AnkiCard {
    traditional: string;
    simplified: string;
    pinyin: string;
    meaning: string;
    location: {
        book: number;
        lesson: number;
        section: number;
        order: number;
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

export type SearchScope = 'all' | 'explorer' | 'user';

interface VocabSettings {
    scope: SearchScope;
    searchQuery: string;
    explorer: {
        b: number;
        l: number;
        p: number;
        cumulative: boolean;
    };
}

interface FilterOptions {
    book: number;
    lesson: number;
    section: number;
    cumulative: boolean;
}

// --- Context Definition ---
interface VocabContextType {
    cards: AnkiCard[];
    metadata: LocationTree | null;
    dialogueManifest: string[];
    isLoading: boolean;
    // Settings and Filtered Results
    settings: VocabSettings;
    setSettings: React.Dispatch<React.SetStateAction<VocabSettings>>;
    filteredList: AnkiCard[];
    getFilteredCards: (options: FilterOptions) => AnkiCard[];
}

const VocabContext = createContext<VocabContextType | undefined>(undefined);

export const VocabProvider = ({ children }: { children: React.ReactNode }) => {
    const { progress: userProgress, isHydrated } = useUser(); // Get live user progress

    const [cards, setCards] = useState<AnkiCard[]>([]);
    const [metadata, setMetadata] = useState<LocationTree | null>(null);
    const [dialogueManifest, setDialogueManifest] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Explorer/Search State
    const [settings, setSettings] = useState<VocabSettings>({
        scope: 'user', // Default to current user studies
        searchQuery: '',
        explorer: {
            b: 1,
            l: 1,
            p: 1,
            cumulative: true,
        },
    });

    useEffect(() => {
        const loadResources = async () => {
            try {
                const [cardsRes, treeRes, manifestRes] = await Promise.all([
                    fetch('/parsed-cards.json'),
                    fetch('/location-tree.json'),
                    fetch('/dialogues/manifest.json'),
                ]);

                const cardsData = await cardsRes.json();
                const treeData = await treeRes.json();
                const manifestData = await manifestRes.json();

                setCards(cardsData);
                setMetadata(treeData);
                setDialogueManifest(manifestData.files);
            } catch (err) {
                console.error('Resource loading error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadResources();
    }, []);

    const getFilteredCards = useCallback(
        ({ book, lesson, section, cumulative }: FilterOptions) => {
            if (cards.length === 0) return [];

            return cards.filter((card) => {
                const c = card.location;
                if (cumulative) {
                    if (c.book < book) return true;
                    if (c.book === book && c.lesson < lesson) return true;
                    if (
                        c.book === book &&
                        c.lesson === lesson &&
                        c.section <= section
                    )
                        return true;
                    return false;
                }
                return (
                    c.book === book &&
                    c.lesson === lesson &&
                    c.section === section
                );
            });
        },
        [cards],
    );

    // The logic to derive what the user sees in the Explorer page
    const filteredList = useMemo(() => {
        let baseCards = cards;

        if (settings.scope === 'user' && isHydrated) {
            baseCards = getFilteredCards({
                book: userProgress.book,
                lesson: userProgress.lesson,
                section: userProgress.section,
                cumulative: true,
            });
        } else if (settings.scope === 'explorer') {
            baseCards = getFilteredCards({
                book: settings.explorer.b,
                lesson: settings.explorer.l,
                section: settings.explorer.p,
                cumulative: settings.explorer.cumulative,
            });
        }

        if (settings.searchQuery) {
            const query = settings.searchQuery.toLowerCase();
            return baseCards.filter(
                (c) =>
                    c.traditional.includes(query) ||
                    c.pinyin.toLowerCase().includes(query) ||
                    c.meaning.toLowerCase().includes(query),
            );
        }

        return baseCards;
    }, [cards, settings, userProgress, isHydrated, getFilteredCards]);

    return (
        <VocabContext.Provider
            value={{
                cards,
                metadata,
                dialogueManifest,
                isLoading,
                settings,
                setSettings,
                filteredList,
                getFilteredCards,
            }}
        >
            {children}
        </VocabContext.Provider>
    );
};

export const useVocabulary = () => {
    const context = useContext(VocabContext);
    if (!context)
        throw new Error('useVocabulary must be used within a VocabProvider');
    return context;
};
