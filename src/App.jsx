import React, { useState, useMemo } from 'react';
import vocabData from './vocabData.json';
import VocabTable from './components/VocabTable';
import CharacterLibrary from './components/CharacterLibrary'; // Renamed Analytics
import DialogueViewer from './components/DialogueViewer';

const dialogueFiles = import.meta.glob('../data/dialogues/*.json', {
    eager: true,
});

const dialoguesData = Object.values(dialogueFiles)
    .map((file) => file.default || file)
    // Filter out any files that don't have the required ID property
    .filter((d) => d && d.dialogue_id)
    .sort((a, b) => {
        // Robust sort that handles potential missing IDs
        const idA = a.dialogue_id || '';
        const idB = b.dialogue_id || '';
        return idA.localeCompare(idB);
    });

function App() {
    const [search, setSearch] = useState('');
    const [selectedLesson, setSelectedLesson] = useState('all');
    const [view, setView] = useState('dialogues'); // Default to Dialogues
    const [sortConfig, setSortConfig] = useState({
        key: 'lesson',
        direction: 'asc',
    });

    // --- LOGIC: Filtering & Sorting for "Words" View ---
    const sortedWords = useMemo(() => {
        let items = vocabData.filter((item) => {
            const matchesSearch =
                item.hanzi.includes(search) ||
                item.pinyin.toLowerCase().includes(search.toLowerCase()) ||
                item.translation.toLowerCase().includes(search.toLowerCase());
            const matchesLesson =
                selectedLesson === 'all' ||
                item.lesson === parseInt(selectedLesson);
            return matchesSearch && matchesLesson;
        });

        if (sortConfig.key) {
            items.sort((a, b) => {
                let aVal = a[sortConfig.key],
                    bVal = b[sortConfig.key];
                if (typeof aVal === 'number')
                    return sortConfig.direction === 'asc'
                        ? aVal - bVal
                        : bVal - aVal;
                return sortConfig.direction === 'asc'
                    ? String(aVal).localeCompare(String(bVal))
                    : String(bVal).localeCompare(String(aVal));
            });
        }
        return items;
    }, [search, selectedLesson, sortConfig]);

    // --- LOGIC: Character Stats for "Characters" View ---
    const dialogueStats = useMemo(() => {
        const charFreq = {};
        dialoguesData.forEach((d) => {
            d.content.forEach((line) => {
                line.text.split('').forEach((c) => {
                    if (/\p{P}/u.test(c)) return;
                    charFreq[c] = (charFreq[c] || 0) + 1;
                });
            });
        });
        return { charFreq };
    }, [dialoguesData]);

    const charStats = useMemo(() => {
        const stats = {};
        vocabData.forEach((item) => {
            item.hanzi.split('').forEach((char) => {
                if (/\p{P}/u.test(char)) return;
                if (!stats[char]) stats[char] = { count: 0, appearances: [] };
                stats[char].count += 1;
                if (!stats[char].appearances.includes(item.hanzi))
                    stats[char].appearances.push(item.hanzi);
            });
        });
        return Object.entries(stats).map(([char, info]) => ({ char, ...info }));
    }, [vocabData]);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            {/* Top Navigation */}
            <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit shadow-sm">
                {[
                    { id: 'dialogues', label: '📖 Dialogues' },
                    { id: 'words', label: '🔤 Words' },
                    { id: 'chars', label: '🎨 Characters' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setView(tab.id)}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                            view === tab.id
                                ? 'bg-slate-800 text-white shadow-lg'
                                : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Views */}
            <main>
                {view === 'dialogues' && (
                    <DialogueViewer
                        dialogues={dialoguesData}
                        vocabData={vocabData}
                    />
                )}

                {view === 'words' && (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                className="flex-grow p-4 rounded-2xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Search vocabulary..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <select
                                className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedLesson}
                                onChange={(e) =>
                                    setSelectedLesson(e.target.value)
                                }
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
                        <VocabTable
                            data={sortedWords}
                            onSort={(key) => {
                                const direction =
                                    sortConfig.key === key &&
                                    sortConfig.direction === 'asc'
                                        ? 'desc'
                                        : 'asc';
                                setSortConfig({ key, direction });
                            }}
                            sortConfig={sortConfig}
                        />
                    </div>
                )}

                {view === 'chars' && (
                    <CharacterLibrary
                        charStats={charStats}
                        dialogueStats={dialogueStats}
                    />
                )}
            </main>
        </div>
    );
}

export default App;
