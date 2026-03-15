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
    guid: string;
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

// Added 'none' to SearchScope
export type SearchScope = 'all' | 'explorer' | 'user' | 'none';
// New type for granular explorer filtering
export type ExplorerMode = 'chapter' | 'section' | 'cumulative';

interface VocabSettings {
    scope: SearchScope;
    searchQuery: string;
    explorer: {
        b: number;
        l: number;
        p: number;
        mode: ExplorerMode; // Changed from 'cumulative: boolean'
    };
}

interface FilterOptions {
    book: number;
    lesson: number;
    section: number;
    mode: ExplorerMode; // Updated to use the new mode
}

// --- Context Definition ---
interface VocabContextType {
    cards: AnkiCard[];
    metadata: LocationTree | null;
    dialogueManifest: string[];
    isLoading: boolean;
    settings: VocabSettings;
    setSettings: React.Dispatch<React.SetStateAction<VocabSettings>>;
    filteredList: AnkiCard[];
    filteredMap: Map<string, AnkiCard>; // Optimization for text highlighting
    getFilteredCards: (options: FilterOptions) => AnkiCard[];
}

const VocabContext = createContext<VocabContextType | undefined>(undefined);

export const VocabProvider = ({ children }: { children: React.ReactNode }) => {
    const { progress: userProgress, isHydrated } = useUser();

    const [cards, setCards] = useState<AnkiCard[]>([]);
    const [metadata, setMetadata] = useState<LocationTree | null>(null);
    const [dialogueManifest, setDialogueManifest] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [settings, setSettings] = useState<VocabSettings>({
        scope: 'user',
        searchQuery: '',
        explorer: {
            b: 1,
            l: 1,
            p: 1,
            mode: 'cumulative',
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
        ({ book, lesson, section, mode }: FilterOptions) => {
            if (cards.length === 0) return [];

            return cards.filter((card) => {
                const c = card.location;
                if (!c || !c.book) return false;

                // 1. Cumulative: All words up to this specific part
                if (mode === 'cumulative') {
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

                // 2. Chapter: All words in the lesson (Part I and Part II)
                if (mode === 'chapter') {
                    return c.book === book && c.lesson === lesson;
                }

                // 3. Section: Only words from this specific part
                if (mode === 'section') {
                    return (
                        c.book === book &&
                        c.lesson === lesson &&
                        c.section === section
                    );
                }

                return false;
            });
        },
        [cards],
    );

    const filteredList = useMemo(() => {
        // Handle "None" scope immediately
        if (settings.scope === 'none') return [];

        let baseCards = cards;

        if (settings.scope === 'user' && isHydrated) {
            baseCards = getFilteredCards({
                book: userProgress.book,
                lesson: userProgress.lesson,
                section: userProgress.section,
                mode: 'cumulative',
            });
        } else if (settings.scope === 'explorer') {
            baseCards = getFilteredCards({
                book: settings.explorer.b,
                lesson: settings.explorer.l,
                section: settings.explorer.p,
                mode: settings.explorer.mode,
            });
        }

        if (settings.searchQuery) {
            const query = settings.searchQuery.toLowerCase();
            return baseCards.filter(
                (c) =>
                    c.traditional.includes(query) ||
                    c.simplified.includes(query) ||
                    c.pinyin.toLowerCase().includes(query) ||
                    c.meaning.toLowerCase().includes(query),
            );
        }

        return baseCards;
    }, [cards, settings, userProgress, isHydrated, getFilteredCards]);

    // High-performance map for SmartText lookup
    const filteredMap = useMemo(() => {
        const map = new Map<string, AnkiCard>();
        filteredList.forEach((card) => {
            map.set(card.traditional, card);
        });
        return map;
    }, [filteredList]);

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
                filteredMap,
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
