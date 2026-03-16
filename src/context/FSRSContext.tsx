// @/context/FSRSContext.tsx
'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo,
} from 'react';
import {
    fsrs,
    Rating,
    RecordLog,
    Card,
    generatorParameters,
    createEmptyCard,
} from 'ts-fsrs';
import { useStorage } from './StorageContext';
import { useUser } from './UserContext';
import { AnkiCard } from './VocabularyContext';

// The data structure we persist for each card
interface SRSData {
    [guid: string]: Card;
}

interface FSRSContextType {
    srsMap: SRSData;
    isLoading: boolean;
    gradeCard: (guid: string, rating: Rating) => Promise<void>;
    getSessionQueue: (eligibleCards: AnkiCard[]) => {
        due: AnkiCard[];
        new: AnkiCard[];
    };
}

const FSRSContext = createContext<FSRSContextType | undefined>(undefined);

export const FSRSProvider = ({ children }: { children: React.ReactNode }) => {
    const { loadData, saveData } = useStorage();
    const { userId, isHydrated } = useUser();

    const [srsMap, setSrsMap] = useState<SRSData>({});
    const [isLoading, setIsLoading] = useState(true);

    // Standard FSRS parameters
    const params = generatorParameters({ enable_fuzz: true });
    const f = fsrs(params);

    // Load SRS data from storage
    useEffect(() => {
        const fetchSRS = async () => {
            setIsLoading(true);
            const data = await loadData('srs_stats');
            if (data) setSrsMap(data);
            setIsLoading(false);
        };

        if (isHydrated && userId) fetchSRS();
    }, [userId, isHydrated, loadData]);

    /**
     * Grades a card and updates its future intervals
     */
    const gradeCard = async (guid: string, rating: Rating) => {
        const now = new Date();
        const currentCard = srsMap[guid] || createEmptyCard(now);

        // Calculate next states for all 4 possible ratings
        const schedulingCards = f.repeat(currentCard, now);

        // FIX: Use type assertion to help TypeScript find the specific card
        // Or access the Record directly if you're using the newer version of the lib
        const updatedCard = (schedulingCards as any)[rating].card;

        const nextMap = {
            ...srsMap,
            [guid]: updatedCard,
        };

        setSrsMap(nextMap);
        await saveData('srs_stats', nextMap);
    };

    /**
     * Takes the filtered list from VocabContext and splits it into
     * Due (Review) and New (Learning) queues.
     */
    const getSessionQueue = (eligibleCards: AnkiCard[]) => {
        const now = new Date();

        const due: AnkiCard[] = [];
        const newCards: AnkiCard[] = [];

        eligibleCards.forEach((card) => {
            const stats = srsMap[card.guid];

            if (!stats) {
                newCards.push(card);
            } else if (new Date(stats.due) <= now) {
                due.push(card);
            }
        });

        // Sort Due cards by lapse or urgency if needed
        return { due, new: newCards };
    };

    return (
        <FSRSContext.Provider
            value={{ srsMap, isLoading, gradeCard, getSessionQueue }}
        >
            {children}
        </FSRSContext.Provider>
    );
};

export const useFSRS = () => {
    const context = useContext(FSRSContext);
    if (!context) throw new Error('useFSRS must be used within FSRSProvider');
    return context;
};
