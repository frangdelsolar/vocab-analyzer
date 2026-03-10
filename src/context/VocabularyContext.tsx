'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo,
    useCallback,
} from 'react';

// 1. Interfaces & Types
export interface AnkiCard {
    traditional: string;
    simplified: string;
    pinyin: string;
    meaning: string;
    location: {
        book: number;
        lesson: number;
        section: string;
    };
}

export type HighlightScope =
    | 'all'
    | 'chapter'
    | 'cumulative'
    | 'section'
    | 'manual'
    | 'none'
    | 'explorer';

export interface StudySettings {
    scope: HighlightScope;
    book: number;
    lesson: number;
    section: string;
    searchQuery: string; // New field for search
    manualLessons: number[];
    explorer: {
        b: number;
        l: number;
        p: string;
        cumulative: boolean;
    };
}

interface VocabContextType {
    cards: AnkiCard[];
    filteredMap: Map<string, AnkiCard>;
    settings: StudySettings;
    setSettings: (settings: Partial<StudySettings>) => void;
    isLoading: boolean;
}

const VocabContext = createContext<VocabContextType | undefined>(undefined);

// 2. Provider Implementation
export const VocabProvider = ({ children }: { children: React.ReactNode }) => {
    const [cards, setCards] = useState<AnkiCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);
    const [settings, setSettingsState] = useState<StudySettings>({
        scope: 'all',
        book: 1,
        lesson: 1,
        section: 'I',
        searchQuery: '',
        manualLessons: [],
        explorer: {
            b: 1,
            l: 1,
            p: 'I',
            cumulative: false,
        },
    });

    // 1. Load from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('dangdai_study_context');
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load session', e);
            }
        }
        setIsHydrated(true);
    }, []);

    // 2. Save to LocalStorage whenever settings change
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem(
                'dangdai_study_context',
                JSON.stringify(settings),
            );
        }
    }, [settings, isHydrated]);

    const setSettings = useCallback((newSettings: Partial<StudySettings>) => {
        setSettingsState((prev) => ({ ...prev, ...newSettings }));
    }, []);

    useEffect(() => {
        fetch('/parsed-cards.json')
            .then((res) => res.json())
            .then((data: AnkiCard[]) => {
                setCards(data);
                setIsLoading(false);
            })
            .catch((err) => console.error('Failed to load vocab:', err));
    }, []);

    // 3. The Filter Engine
    const filteredMap = useMemo(() => {
        const map = new Map<string, AnkiCard>();
        if (cards.length === 0) return map;

        const getSectionScore = (section: string): number => {
            const s = section?.toUpperCase().trim();
            if (s === 'I' || s === '1' || s === 'PART-1') return 1;
            if (s === 'II' || s === '2' || s === 'PART-2') return 2;
            if (s === 'III' || s === '3') return 3;
            if (s === 'READING' || s === '4') return 4;
            return 0;
        };

        cards.forEach((card) => {
            const { book, lesson, section: cardSection } = card.location;
            const cardSectionScore = getSectionScore(cardSection);
            let include = false;

            // --- FILTERING LOGIC (STRICTLY PRESERVED) ---
            if (settings.scope === 'explorer') {
                const { b, l, p, cumulative } = settings.explorer;
                const targetScore = getSectionScore(p);

                if (cumulative) {
                    if (book < b) include = true;
                    else if (book === b && lesson < l) include = true;
                    else if (
                        book === b &&
                        lesson === l &&
                        cardSectionScore <= targetScore
                    )
                        include = true;
                } else {
                    if (
                        book === b &&
                        lesson === l &&
                        cardSectionScore === targetScore
                    )
                        include = true;
                }
            } else {
                const targetSectionScore = getSectionScore(settings.section);
                switch (settings.scope) {
                    case 'none':
                        include = false;
                        break;
                    case 'all':
                        include = true;
                        break;
                    case 'chapter':
                        if (
                            book === settings.book &&
                            lesson === settings.lesson
                        )
                            include = true;
                        break;
                    case 'section':
                        if (
                            book === settings.book &&
                            lesson === settings.lesson &&
                            cardSectionScore === targetSectionScore
                        )
                            include = true;
                        break;
                    case 'cumulative':
                        if (book < settings.book) include = true;
                        else if (
                            book === settings.book &&
                            lesson < settings.lesson
                        )
                            include = true;
                        else if (
                            book === settings.book &&
                            lesson === settings.lesson &&
                            cardSectionScore <= targetSectionScore
                        )
                            include = true;
                        break;
                    case 'manual':
                        if (settings.manualLessons.includes(lesson))
                            include = true;
                        break;
                }
            }

            // --- SEARCH LOGIC (SECONDARY PASS) ---
            // If the card survived the location filter, check if it matches the search query
            if (include && settings.searchQuery.trim() !== '') {
                const query = settings.searchQuery.toLowerCase();
                const matchesSearch =
                    card.traditional.includes(query) ||
                    card.simplified?.includes(query) || // Added optional simplified check
                    card.pinyin.toLowerCase().includes(query) ||
                    card.meaning.toLowerCase().includes(query);

                if (!matchesSearch) include = false;
            }

            if (include) map.set(card.traditional, card);
        });
        return map;
    }, [cards, settings]);

    return (
        <VocabContext.Provider
            value={{ cards, filteredMap, settings, setSettings, isLoading }}
        >
            {children}
        </VocabContext.Provider>
    );
};

export const useVocabulary = () => {
    const context = useContext(VocabContext);
    if (!context)
        throw new Error('useVocabulary must be used within VocabProvider');
    return context;
};
