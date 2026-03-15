'use client';

import React, { createContext, useContext } from 'react';
import { useStorage } from './StorageContext';

interface FSRSContextType {
    gradeCard: (guid: string, rating: 1 | 2 | 3 | 4) => void; // 1: Again, 2: Hard, 3: Good, 4: Easy
    getNextReviewDate: (guid: string) => Date | null;
}

const FSRSContext = createContext<FSRSContextType | undefined>(undefined);

export const FSRSProvider = ({ children }: { children: React.ReactNode }) => {
    const { studyData, updateCardProgress } = useStorage();

    const gradeCard = (guid: string, rating: 1 | 2 | 3 | 4) => {
        const currentMetadata = studyData[guid] || {
            stability: 0,
            difficulty: 0,
            reps: 0,
            state: 0, // New
            last_review: Date.now(),
        };

        console.log(
            `Grading card ${guid} with rating ${rating}. Algorithm implementation pending...`,
        );

        // This is where the FSRS math will go.
        // For now, we just save the fact that it was seen.
        updateCardProgress(guid, {
            ...currentMetadata,
            reps: currentMetadata.reps + 1,
            last_review: Date.now(),
        });
    };

    const getNextReviewDate = (guid: string) => {
        if (!studyData[guid]) return null;
        // Logic to return date based on stability
        return new Date();
    };

    return (
        <FSRSContext.Provider value={{ gradeCard, getNextReviewDate }}>
            {children}
        </FSRSContext.Provider>
    );
};

export const useFSRS = () => {
    const context = useContext(FSRSContext);
    if (!context) throw new Error('useFSRS must be used within FSRSProvider');
    return context;
};
