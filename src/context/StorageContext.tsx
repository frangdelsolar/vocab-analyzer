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

/**
 * Agnostic Minifier
 * Converts { "id": { "a": 1, "b": 2 } }
 * into { k: ["a", "b"], d: { "id": [1, 2] } }
 */
const minifyAgnostic = (data: Record<string, any>) => {
    const guids = Object.keys(data);
    if (guids.length === 0) return { k: [], d: {} };

    // Get keys from the first available record
    const schema = Object.keys(data[guids[0]]);
    const minified: Record<string, any[]> = {};

    for (const guid of guids) {
        // Map values in the exact order of the schema
        minified[guid] = schema.map((key) => data[guid][key]);
    }

    return { k: schema, d: minified };
};

/**
 * Agnostic Expander
 * Reverses the minification using the provided key schema
 */
const expandAgnostic = (payload: { k: string[]; d: Record<string, any[]> }) => {
    const { k: schema, d: data } = payload;
    const expanded: Record<string, any> = {};

    for (const [guid, values] of Object.entries(data)) {
        expanded[guid] = schema.reduce(
            (obj, key, index) => {
                obj[key] = values[index];
                return obj;
            },
            {} as Record<string, any>,
        );
    }

    return expanded;
};

export const StorageProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [studyData, setStudyData] = useState<Record<string, any>>({});

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
        if (Object.keys(studyData).length === 0) return '';

        const payload = {
            v: 2, // Incremented version for agnostic schema
            ...minifyAgnostic(studyData),
            ts: Date.now(),
        };
        return LZString.compressToEncodedURIComponent(JSON.stringify(payload));
    };

    const importSyncCode = (code: string) => {
        try {
            const decompressed =
                LZString.decompressFromEncodedURIComponent(code);
            if (!decompressed) return false;

            const parsed = JSON.parse(decompressed);

            // Handle V2 (Agnostic) format
            if (parsed.k && parsed.d) {
                setStudyData(expandAgnostic(parsed));
                return true;
            }

            // Fallback for V1 (if you had old codes floating around)
            if (parsed.d && !parsed.k) {
                setStudyData(parsed.d);
                return true;
            }

            return false;
        } catch (e) {
            console.error('Import failed', e);
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
