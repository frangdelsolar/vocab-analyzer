'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
} from 'react';
import LZString from 'lz-string';

interface StorageContextType {
    studyData: Record<string, any>;
    updateCardProgress: (guid: string, fsrsMetadata: any) => void;
    generateSyncCode: () => string;
    importSyncCode: (code: string) => boolean;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

/**
 * Agnostic Minifier: Converts object keys to a schema array to save space in sync codes
 */
const minifyAgnostic = (data: Record<string, any>) => {
    const guids = Object.keys(data);
    if (guids.length === 0) return { k: [], d: {} };
    const schema = Object.keys(data[guids[0]]);
    const minified: Record<string, any[]> = {};
    for (const guid of guids) {
        minified[guid] = schema.map((key) => data[guid][key]);
    }
    return { k: schema, d: minified };
};

/**
 * Agnostic Expander: Rebuilds human-readable objects from a schema array
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
    // 1. Initialize state LAZILY. This runs synchronously on the client mount.
    const [studyData, setStudyData] = useState<Record<string, any>>(() => {
        if (typeof window === 'undefined') return {}; // SSR safety
        try {
            const local = localStorage.getItem('dangdai_progress');
            return local ? JSON.parse(local) : {};
        } catch (e) {
            console.error('Initial load failed', e);
            return {};
        }
    });

    // 2. Persistent Save: Pure and simple.
    // Since state starts with actual data, we don't need complex guards.
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
            v: 2,
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
            if (parsed.k && parsed.d) {
                setStudyData(expandAgnostic(parsed));
                return true;
            }
            if (parsed.d && !parsed.k) {
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
