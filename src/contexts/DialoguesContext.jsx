import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';

export const DialoguesContext = createContext(null);

export const useDialogues = () => {
    const context = useContext(DialoguesContext);
    if (!context) {
        throw new Error('useDialogues must be used within a DialoguesProvider');
    }
    return context;
};

export const DialoguesProvider = ({ children }) => {
    const [dialogues, setDialogues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // FIXED: Variable name 'response' now matches throughout the function
    const loadDialogueContent = useCallback(async (filename) => {
        try {
            const baseUrl = import.meta.env.BASE_URL || '/';
            const response = await fetch(
                `${baseUrl}data/dialogues/${filename}`
            );

            if (response.ok) {
                return await response.json();
            }

            console.error(
                `Failed to load ${filename}: ${response.status} ${response.statusText}`
            );
            return null;
        } catch (err) {
            console.error(`Error fetching dialogue content:`, err);
            return null;
        }
    }, []);

    useEffect(() => {
        const initDialogues = async () => {
            setIsLoading(true);
            const baseUrl = import.meta.env.BASE_URL || '/';

            try {
                // 1. Load the manifest
                const manifestRes = await fetch(
                    `${baseUrl}data/dialogues/manifest.json`
                );
                if (!manifestRes.ok)
                    throw new Error('Failed to load dialogue manifest');

                const { files } = await manifestRes.json();

                // 2. Fetch basic metadata for each file in parallel
                const loadedData = await Promise.all(
                    files.map(async (filename) => {
                        try {
                            const res = await fetch(
                                `${baseUrl}data/dialogues/${filename}`
                            );
                            if (!res.ok) return null;
                            const data = await res.json();

                            const match = filename.match(
                                /^(\d{2})(\d{2})(\d{2})\.json$/
                            );
                            const book = match ? parseInt(match[1], 10) : 1;
                            const lesson = match ? parseInt(match[2], 10) : 1;
                            const dialNum = match ? parseInt(match[3], 10) : 1;

                            return {
                                id: filename.replace('.json', ''),
                                book,
                                lesson,
                                dialogue: dialNum,
                                filename,
                                title:
                                    data.title ||
                                    data.dialogue_title ||
                                    `Dialogue ${dialNum}`,
                                participants: data.participants || [],
                                type: data.content?.[0]?.speaker
                                    ? 'dialogue'
                                    : 'reading',
                                metadata: data,
                            };
                        } catch (e) {
                            return null;
                        }
                    })
                );

                setDialogues(loadedData.filter((d) => d !== null));
            } catch (err) {
                setError(err.message);
                console.error('Dialogue Init Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initDialogues();
    }, []);

    const value = {
        dialogues,
        isLoading,
        error,
        loadDialogueContent,
    };

    return (
        <DialoguesContext.Provider value={value}>
            {children}
        </DialoguesContext.Provider>
    );
};
