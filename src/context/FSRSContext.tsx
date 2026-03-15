'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useStorage } from './StorageContext';
import {
    fsrs,
    Card,
    Rating,
    generatorParameters,
    createEmptyCard,
    RecordLogItem, // Useful if you ever want to store history
} from 'ts-fsrs';

interface FSRSContextType {
    gradeCard: (guid: string, rating: 1 | 2 | 3 | 4) => void;
    getCardState: (guid: string) => Card;
}

const FSRSContext = createContext<FSRSContextType | undefined>(undefined);

export const FSRSProvider = ({ children }: { children: React.ReactNode }) => {
    const { studyData, updateCardProgress } = useStorage();

    // Configuration: adjust weights here if needed
    const f = useMemo(
        () => fsrs(generatorParameters({ enable_fuzz: true })),
        [],
    );

    const getCardState = (guid: string): Card => {
        const data = studyData[guid];
        if (!data) return createEmptyCard(new Date());

        // Reconstruct the Card object for the engine
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

    const gradeCard = (guid: string, rating: 1 | 2 | 3 | 4) => {
        const currentCard = getCardState(guid);
        const now = new Date();

        // Generate the 4 possible future states
        const schedulingCards = f.repeat(currentCard, now);

        /**
         * FIX: Explicitly cast to exclude 'Manual'.
         * Rating.Again = 1, Rating.Hard = 2, Rating.Good = 3, Rating.Easy = 4.
         */
        const chosenRating = rating as Exclude<Rating, Rating.Manual>;
        const { card } = schedulingCards[chosenRating];

        // Save back to storage
        updateCardProgress(guid, {
            stability: card.stability,
            difficulty: card.difficulty,
            reps: card.reps,
            state: card.state,
            last_review: card.last_review?.getTime(),
            due: card.due.getTime(),
            scheduled_days: card.scheduled_days,
            elapsed_days: card.elapsed_days,
        });
    };

    return (
        <FSRSContext.Provider value={{ gradeCard, getCardState }}>
            {children}
        </FSRSContext.Provider>
    );
};

export const useFSRS = () => {
    const context = useContext(FSRSContext);
    if (!context) throw new Error('useFSRS must be used within FSRSProvider');
    return context;
};
