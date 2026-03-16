// @/context/FSRSContext.tsx
'use client';

import React, {
    createContext,
    useContext,
    useMemo,
    useState,
    useEffect,
} from 'react';
import { useStorage } from './StorageContext';
import { useUser } from './UserContext';
import {
    fsrs,
    Card,
    Rating,
    generatorParameters,
    createEmptyCard,
} from 'ts-fsrs';

interface FSRSContextType {
    gradeCard: (guid: string, rating: 1 | 2 | 3 | 4) => Promise<void>;
    getCardState: (guid: string) => Card;
    isLoading: boolean;
}

const FSRSContext = createContext<FSRSContextType | undefined>(undefined);

export const FSRSProvider = ({ children }: { children: React.ReactNode }) => {
    const { saveData, loadData } = useStorage();
    const { userId, isHydrated: userHydrated } = useUser();

    // Local state to keep UI snappy
    const [studyData, setStudyData] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);

    // 1. Load data from Supabase when user is ready
    useEffect(() => {
        const initFSRS = async () => {
            setIsLoading(true);
            const data = await loadData('fsrs_progress');
            if (data) setStudyData(data);
            setIsLoading(false);
        };

        if (userHydrated && userId) {
            initFSRS();
        }
    }, [userId, userHydrated, loadData]);

    const f = useMemo(
        () => fsrs(generatorParameters({ enable_fuzz: true })),
        [],
    );

    const getCardState = (guid: string): Card => {
        const data = studyData[guid];
        if (!data) return createEmptyCard(new Date());

        return {
            ...createEmptyCard(),
            stability: data.stability || 0,
            difficulty: data.difficulty || 0,
            reps: data.reps || 0,
            state: data.state || 0,
            last_review: data.last_review
                ? new Date(data.last_review)
                : undefined,
            elapsed_days: data.elapsed_days || 0,
            scheduled_days: data.scheduled_days || 0,
            due: new Date(data.due || Date.now()),
        };
    };

    const gradeCard = async (guid: string, rating: 1 | 2 | 3 | 4) => {
        const currentCard = getCardState(guid);
        const now = new Date();

        const schedulingCards = f.repeat(currentCard, now);
        const chosenRating = rating as Exclude<Rating, Rating.Manual>;
        const { card } = schedulingCards[chosenRating];

        // 2. Update local state and sync to Supabase
        const updatedProgress = {
            ...studyData,
            [guid]: {
                stability: card.stability,
                difficulty: card.difficulty,
                reps: card.reps,
                state: card.state,
                last_review: card.last_review?.getTime(),
                due: card.due.getTime(),
                scheduled_days: card.scheduled_days,
                elapsed_days: card.elapsed_days,
            },
        };

        setStudyData(updatedProgress);
        await saveData('fsrs_progress', updatedProgress);
    };

    return (
        <FSRSContext.Provider value={{ gradeCard, getCardState, isLoading }}>
            {children}
        </FSRSContext.Provider>
    );
};

export const useFSRS = () => {
    const context = useContext(FSRSContext);
    if (!context) throw new Error('useFSRS must be used within FSRSProvider');
    return context;
};
