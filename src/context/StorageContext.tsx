'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import LZString from 'lz-string';

interface StorageContextType {
    studyData: Record<string, any>;
    updateCardProgress: (guid: string, fsrsMetadata: any) => void;
    generateSyncCode: () => string;
    importSyncCode: (code: string) => boolean;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    // State stores the FSRS metadata for all learned cards
    const [studyData, setStudyData] = useState<Record<string, any>>({});

    // Load from LocalStorage on mount
    useEffect(() => {
        const local = localStorage.getItem('dangdai_progress');
        if (local) {
            try {
                setStudyData(JSON.parse(local));
            } catch (e) {
                console.error('Failed to parse local progress');
            }
        }
    }, []);

    // Save to LocalStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('dangdai_progress', JSON.stringify(studyData));
    }, [studyData]);

    const updateCardProgress = (guid: string, fsrsMetadata: any) => {
        setStudyData((prev) => ({
            ...prev,
            [guid]: fsrsMetadata,
        }));
    };

    const generateSyncCode = () => {
        const payload = { v: 1, d: studyData, ts: Date.now() };
        return LZString.compressToEncodedURIComponent(JSON.stringify(payload));
    };

    const importSyncCode = (code: string) => {
        try {
            const decompressed =
                LZString.decompressFromEncodedURIComponent(code);
            if (!decompressed) return false;
            const parsed = JSON.parse(decompressed);
            if (parsed.d) {
                setStudyData(parsed.d);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    };

    return (
        <StorageContext.Provider
            value={{
                studyData,
                updateCardProgress,
                generateSyncCode,
                importSyncCode,
            }}
        >
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = () => {
    const context = useContext(StorageContext);
    if (!context)
        throw new Error('useStorage must be used within StorageProvider');
    return context;
};
