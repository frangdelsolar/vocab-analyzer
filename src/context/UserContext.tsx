'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserProgress {
    book: number;
    lesson: number;
    section: number;
}

interface UserContextType {
    progress: UserProgress;
    updateProgress: (updates: Partial<UserProgress>) => void;
    isHydrated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [progress, setProgress] = useState<UserProgress>({
        book: 1,
        lesson: 1,
        section: 1,
    });
    const [isHydrated, setIsHydrated] = useState(false);

    // Hydrate from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('dangdai_user_progress');
        if (saved) {
            try {
                setProgress(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load progress');
            }
        }
        setIsHydrated(true);
    }, []);

    const updateProgress = (updates: Partial<UserProgress>) => {
        setProgress((prev) => {
            const next = { ...prev, ...updates };
            localStorage.setItem('dangdai_user_progress', JSON.stringify(next));
            return next;
        });
    };

    return (
        <UserContext.Provider value={{ progress, updateProgress, isHydrated }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
};
