// @/context/StorageContext.tsx
'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from './UserContext';

interface StorageContextType {
    saveData: (key: string, data: any) => Promise<boolean>;
    loadData: (key: string) => Promise<any | null>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { userId } = useUser();

    const saveData = useCallback(
        async (key: string, data: any) => {
            if (!userId) return false;

            const { error } = await supabase.from('user_storage').upsert(
                {
                    username: userId,
                    key: key,
                    data: data,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: 'username,key',
                },
            );

            if (error) {
                console.error(`Save failed for ${key}:`, error.message);
                return false;
            }
            return true;
        },
        [userId],
    );

    const loadData = useCallback(
        async (key: string) => {
            if (!userId) return null;

            const { data, error } = await supabase
                .from('user_storage')
                .select('data')
                .eq('username', userId)
                .eq('key', key)
                .maybeSingle();

            if (error) {
                console.error(`Load failed for ${key}:`, error.message);
                return null;
            }

            return data ? data.data : null;
        },
        [userId],
    );

    return (
        <StorageContext.Provider value={{ saveData, loadData }}>
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = () => {
    const context = useContext(StorageContext);
    if (!context)
        throw new Error('useStorage must be used within a StorageProvider');
    return context;
};
