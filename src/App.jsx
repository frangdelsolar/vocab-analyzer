import React, { useState, useMemo } from 'react';
import vocabData from './vocabData.json';
import VocabTable from './components/VocabTable';
import Analytics from './components/Analytics';
import DialogueViewer from './components/DialogueViewer';

const dialogueFiles = import.meta.glob('../data/dialogues/*.json', {
    eager: true,
});

const dialoguesData = Object.values(dialogueFiles).map(
    (file) => file.default || file
);

function App() {
    const [search, setSearch] = useState('');
    const [selectedLesson, setSelectedLesson] = useState('all');
    const [studyMode, setStudyMode] = useState(false);
    const [view, setView] = useState('list'); // 'list' | 'stats' | 'dialogues'

    // Use useMemo for performance as the list grows
    const filteredData = useMemo(() => {
        return vocabData.filter((item) => {
            const matchesSearch =
                item.hanzi.includes(search) ||
                item.pinyin.toLowerCase().includes(search.toLowerCase()) ||
                item.translation.toLowerCase().includes(search.toLowerCase());

            const matchesLesson =
                selectedLesson === 'all' ||
                item.lesson === parseInt(selectedLesson);

            return matchesSearch && matchesLesson;
        });
    }, [search, selectedLesson]);

    const dialogueStats = useMemo(() => {
        const wordFreq = {};
        const charFreq = {};

        dialoguesData.forEach((d) => {
            d.content.forEach((line) => {
                // 1. Character Frequency in Dialogues
                const chars = line.text.split('');
                chars.forEach((c) => {
                    if (/\p{P}/u.test(c)) return; // Skip punctuation
                    charFreq[c] = (charFreq[c] || 0) + 1;
                });

                // 2. Simple Word Segmentation (fallback for browser)
                // Note: For advanced segmentation in Vite, we usually use a regex-based
                // scanner or a dictionary-based match since require('hanzi-tools') fails in browser.
                vocabData.forEach((v) => {
                    if (line.text.includes(v.hanzi)) {
                        wordFreq[v.hanzi] = (wordFreq[v.hanzi] || 0) + 1;
                    }
                });
            });
        });

        return { wordFreq, charFreq };
    }, [dialoguesData, vocabData]);

    const charStats = useMemo(() => {
        const stats = {};

        vocabData.forEach((item) => {
            // Split the Hanzi string into individual characters
            const chars = item.hanzi.split('');
            chars.forEach((char) => {
                // Ignore punctuation if any
                if (/\p{P}/u.test(char)) return;

                if (!stats[char]) {
                    stats[char] = { count: 0, appearances: [] };
                }
                stats[char].count += 1;
                // Track which words contain this character
                if (!stats[char].appearances.includes(item.hanzi)) {
                    stats[char].appearances.push(item.hanzi);
                }
            });
        });

        // Convert to sorted array (most frequent first)
        return Object.entries(stats)
            .map(([char, info]) => ({ char, ...info }))
            .sort((a, b) => b.count - a.count);
    }, [vocabData]);

    const totalUniqueChars = charStats.length;
    const totalWords = vocabData.length;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-8 bg-white p-2 rounded-xl border border-slate-200 w-fit">
                <button
                    onClick={() => setView('list')}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${
                        view === 'list'
                            ? 'bg-slate-800 text-white shadow-md'
                            : 'text-slate-400 hover:bg-slate-50'
                    }`}
                >
                    Vocabulary
                </button>
                <button
                    onClick={() => setView('stats')}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${
                        view === 'stats'
                            ? 'bg-slate-800 text-white shadow-md'
                            : 'text-slate-400 hover:bg-slate-50'
                    }`}
                >
                    Analytics
                </button>
                <button
                    onClick={() => setView('dialogues')}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${
                        view === 'dialogues'
                            ? 'bg-slate-800 text-white shadow-md'
                            : 'text-slate-400 hover:bg-slate-50'
                    }`}
                >
                    Dialogues
                </button>
            </div>

            {/* Main Content Areas */}
            {view === 'list' && (
                <>
                    {/* Search & Filter Bar - Make sure this exists so filteredData works! */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <input
                            className="flex-grow p-3 rounded-xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search Hanzi, Pinyin, or English..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="p-3 rounded-xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedLesson}
                            onChange={(e) => setSelectedLesson(e.target.value)}
                        >
                            <option value="all">All Lessons</option>
                            {[...new Set(vocabData.map((d) => d.lesson))]
                                .sort((a, b) => a - b)
                                .map((l) => (
                                    <option key={l} value={l}>
                                        Lesson {l}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* PASS FILTERED DATA HERE */}
                    <VocabTable data={filteredData} studyMode={studyMode} />
                </>
            )}
            {view === 'stats' && (
                <Analytics
                    vocabData={vocabData}
                    charStats={charStats}
                    totalWords={totalWords}
                    totalUniqueChars={totalUniqueChars}
                    dialogueStats={dialogueStats}
                />
            )}
            {view === 'dialogues' && (
                <DialogueViewer
                    dialogues={dialoguesData}
                    vocabData={vocabData}
                />
            )}
        </div>
    );
}

export default App;
