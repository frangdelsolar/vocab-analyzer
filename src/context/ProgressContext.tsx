// @/context/ProgressContext.tsx
'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react';
import { useStorage } from './StorageContext';
import { useUser } from './UserContext';

interface UserProgress {
    book: number;
    lesson: number;
    section: number;
}

interface ProgressContextType {
    progress: UserProgress;
    updateProgress: (updates: Partial<UserProgress>) => Promise<void>;
    isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(
    undefined,
);

export const ProgressProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { loadData, saveData } = useStorage();
    const { userId, isHydrated: userHydrated } = useUser();

    const [progress, setProgress] = useState<UserProgress>({
        book: 1,
        lesson: 1,
        section: 1,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Load progress from Storage whenever the User is ready or changes
    useEffect(() => {
        const fetchProgress = async () => {
            setIsLoading(true);
            const cloudData = await loadData('progress');
            if (cloudData) {
                setProgress(cloudData);
            }
            setIsLoading(false);
        };

        if (userHydrated && userId) {
            fetchProgress();
        }
    }, [userId, userHydrated, loadData]);

    const updateProgress = useCallback(
        async (updates: Partial<UserProgress>) => {
            setProgress((prev) => {
                const next = { ...prev, ...updates };

                // Persist to Supabase via StorageContext
                // We don't await this to keep the UI snappy (optimistic update)
                saveData('progress', next);

                return next;
            });
        },
        [saveData],
    );

    return (
        <ProgressContext.Provider
            value={{ progress, updateProgress, isLoading }}
        >
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
};
