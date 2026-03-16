// @/context/UserContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ADJECTIVES = ['Happy', 'Bright', 'Quiet', 'Clever', 'Swift', 'Golden'];
const NOUNS = ['Scholar', 'Panda', 'Mountain', 'River', 'Dragon', 'Student'];

const generateReadableId = () => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(100 + Math.random() * 900); // 3-digit number
    return `${adj}${noun}${num}`; // e.g., SwiftPanda412
};

interface UserContextType {
    userId: string;
    setUserId: (id: string) => void;
    isHydrated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userId, setUserIdState] = useState<string>('');
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const savedId = localStorage.getItem('dangdai_user_id');
        if (savedId) {
            setUserIdState(savedId);
        } else {
            const newId = generateReadableId();
            setUserIdState(newId);
            localStorage.setItem('dangdai_user_id', newId);
        }
        setIsHydrated(true);
    }, []);

    const setUserId = (id: string) => {
        const cleanId = id.trim();
        if (cleanId) {
            setUserIdState(cleanId);
            localStorage.setItem('dangdai_user_id', cleanId);
        }
    };

    return (
        <UserContext.Provider value={{ userId, setUserId, isHydrated }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
};
