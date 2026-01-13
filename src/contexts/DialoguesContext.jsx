import React, { createContext, useContext, useState, useEffect } from 'react';

export const DialoguesContext = createContext({
    dialogues: [],
    isLoading: true,
    error: null,
    loadDialogueContent: () => Promise.resolve(null),
});

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

    useEffect(() => {
        const loadDialogues = async () => {
            try {
                // Define the pattern of dialogue files
                // Assuming files are named: B1L01-D1.json, B1L01-D2.json, etc.
                // Or: 010101.json, 010102.json, etc.

                // Generate all possible dialogue file names for books 1-2
                // Format: XXYYZZ.json where:
                // XX = book (01-02)
                // YY = lesson (01-06)
                // ZZ = dialogue (01-02) - each lesson has 2 dialogues

                const dialogueFiles = [
                    '010101.json', // Book 1, Lesson 1, Dialogue 1
                    '010102.json', // Book 1, Lesson 1, Dialogue 2
                    '010201.json', // Book 1, Lesson 2, Dialogue 1
                    '010202.json', // Book 1, Lesson 2, Dialogue 2
                    '010301.json', // Book 1, Lesson 3, Dialogue 1
                    '010302.json', // Book 1, Lesson 3, Dialogue 2
                    '010401.json', // Book 1, Lesson 4, Dialogue 1
                    '010402.json', // Book 1, Lesson 4, Dialogue 2
                    '010501.json', // Book 1, Lesson 5, Dialogue 1
                    '010502.json', // Book 1, Lesson 5, Dialogue 2
                    '010601.json', // Book 1, Lesson 6, Dialogue 1
                    '010602.json', // Book 1, Lesson 6, Dialogue 2
                    '010701.json', // Book 1, Lesson 7, Dialogue 1
                    '010702.json', // Book 1, Lesson 7, Dialogue 2
                    '010801.json', // Book 1, Lesson 8, Dialogue 1
                    '010802.json', // Book 1, Lesson 8, Dialogue 2
                    '010901.json', // Book 1, Lesson 9, Dialogue 1
                    '010902.json', // Book 1, Lesson 9, Dialogue 2
                    '011001.json', // Book 1, Lesson 10, Dialogue 1
                    '011002.json', // Book 1, Lesson 10, Dialogue 2
                    '011101.json', // Book 1, Lesson 11, Dialogue 1
                    '011102.json', // Book 1, Lesson 11, Dialogue 2
                    '011201.json', // Book 1, Lesson 12, Dialogue 1
                    '011202.json', // Book 1, Lesson 12, Dialogue 2
                    '011301.json', // Book 1, Lesson 13, Dialogue 1
                    '011302.json', // Book 1, Lesson 13, Dialogue 2
                    '011401.json', // Book 1, Lesson 14, Dialogue 1
                    '011402.json', // Book 1, Lesson 14, Dialogue 2
                    '011501.json', // Book 1, Lesson 15, Dialogue 1
                    '011502.json', // Book 1, Lesson 15, Dialogue 2
                    '020101.json', // Book 2, Lesson 1, Dialogue 1
                    '020102.json', // Book 2, Lesson 1, Dialogue 2
                    '020201.json', // Book 2, Lesson 2, Dialogue 1
                    '020202.json', // Book 2, Lesson 2, Dialogue 2
                    '020301.json', // Book 2, Lesson 3, Dialogue 1
                    '020302.json', // Book 2, Lesson 3, Dialogue 2
                    '020401.json', // Book 2, Lesson 4, Dialogue 1
                    '020402.json', // Book 2, Lesson 4, Dialogue 2
                    '020501.json', // Book 2, Lesson 5, Dialogue 1
                    '020502.json', // Book 2, Lesson 5, Dialogue 2
                    '020601.json', // Book 2, Lesson 6, Dialogue 1
                    '020602.json', // Book 2, Lesson 6, Dialogue 2
                ];

                // Now try to load each file
                const loadedDialogues = [];

                // Try to load each file
                for (const filename of dialogueFiles) {
                    try {
                        const response = await fetch(
                            `/data/dialogues/${filename}`
                        );
                        if (response.ok) {
                            const data = await response.json();

                            // Extract metadata from filename (e.g., 010101.json)
                            const match = filename.match(
                                /^(\d{2})(\d{2})(\d{2})\.json$/
                            );
                            let book, lesson, dialogue;

                            if (match) {
                                book = parseInt(match[1], 10);
                                lesson = parseInt(match[2], 10);
                                dialogue = parseInt(match[3], 10);
                            } else {
                                // Try alternative pattern like B1L01-D1.json
                                const altMatch = filename.match(
                                    /^B(\d+)L(\d+)-D(\d+)\.json$/i
                                );
                                if (altMatch) {
                                    book = parseInt(altMatch[1], 10);
                                    lesson = parseInt(altMatch[2], 10);
                                    dialogue = parseInt(altMatch[3], 10);
                                } else {
                                    // Default values if pattern doesn't match
                                    book = 1;
                                    lesson = 1;
                                    dialogue = 1;
                                }
                            }

                            loadedDialogues.push({
                                id: filename.replace('.json', ''),
                                book,
                                lesson,
                                dialogue,
                                filename,
                                title:
                                    data.title ||
                                    data.dialogue_title ||
                                    `Dialogue ${dialogue}`,
                                participants: data.participants || [],
                                type: data.content?.[0]?.speaker
                                    ? 'dialogue'
                                    : 'reading',
                                metadata: data,
                            });
                        }
                    } catch (fileErr) {
                        // File doesn't exist or has error - skip it
                        console.warn(
                            `Could not load dialogue file: ${filename}`,
                            fileErr
                        );
                    }
                }

                // If no files loaded, use sample data as fallback
                if (loadedDialogues.length === 0) {
                    console.warn('No dialogue files found, using sample data');
                    loadedDialogues.push(
                        {
                            id: '010101',
                            book: 1,
                            lesson: 1,
                            dialogue: 1,
                            filename: '010101.json',
                            title: '歡迎你們來臺灣 (Welcome to Taiwan)',
                            participants: [
                                '明華 (Mínghuá)',
                                '月美 (Yuèměi)',
                                '開文 (Kāiwén)',
                            ],
                            type: 'dialogue',
                            metadata: null,
                        },
                        {
                            id: '060102',
                            book: 6,
                            lesson: 1,
                            dialogue: 2,
                            filename: '060102.json',
                            title: '短文 Reading',
                            participants: [],
                            type: 'reading',
                            metadata: null,
                        }
                    );
                }

                setDialogues(loadedDialogues);
            } catch (err) {
                setError(err.message);
                console.error('Error loading dialogues:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDialogues();
    }, []);

    // Function to load full dialogue content
    const loadDialogueContent = async (filename) => {
        try {
            const response = await fetch(`/data/dialogues/${filename}`);
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (err) {
            console.error(
                `Error loading dialogue content for ${filename}:`,
                err
            );
            return null;
        }
    };

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
