export class VocabularyManager {
    constructor(cards) {
        this.cards = Array.isArray(cards) ? cards : [];
        this.originalCards = [...this.cards]; // Keep original for resetting
        this.searchIndices = this.buildSearchIndices();
    }

    // Build search indices for fast searching
    buildSearchIndices() {
        const indices = {
            simplified: new Map(),
            traditional: new Map(),
            pinyin: new Map(),
            meaning: new Map(),
            partOfSpeech: new Map(),
            tags: new Map(),
        };

        this.cards.forEach((card, index) => {
            // Index by simplified characters (split by character for partial matches)
            if (card.simplified) {
                card.simplified.split('').forEach((char) => {
                    if (!indices.simplified.has(char)) {
                        indices.simplified.set(char, new Set());
                    }
                    indices.simplified.get(char).add(index);
                });

                // Also index the full word
                if (!indices.simplified.has(card.simplified)) {
                    indices.simplified.set(card.simplified, new Set());
                }
                indices.simplified.get(card.simplified).add(index);
            }

            // Index by traditional characters
            if (card.traditional) {
                card.traditional.split('').forEach((char) => {
                    if (!indices.traditional.has(char)) {
                        indices.traditional.set(char, new Set());
                    }
                    indices.traditional.get(char).add(index);
                });

                // Also index the full word
                if (!indices.traditional.has(card.traditional)) {
                    indices.traditional.set(card.traditional, new Set());
                }
                indices.traditional.get(card.traditional).add(index);
            }

            // Index by pinyin (case-insensitive)
            if (card.pinyin) {
                const pinyinLower = card.pinyin.toLowerCase();
                if (!indices.pinyin.has(pinyinLower)) {
                    indices.pinyin.set(pinyinLower, new Set());
                }
                indices.pinyin.get(pinyinLower).add(index);

                // Also index individual pinyin syllables
                pinyinLower.split(' ').forEach((syllable) => {
                    if (!indices.pinyin.has(syllable)) {
                        indices.pinyin.set(syllable, new Set());
                    }
                    indices.pinyin.get(syllable).add(index);
                });
            }

            // Index by meaning (English)
            if (card.meaning) {
                card.meaning
                    .toLowerCase()
                    .split(' ')
                    .forEach((word) => {
                        if (word.length > 2) {
                            // Only index words longer than 2 chars
                            if (!indices.meaning.has(word)) {
                                indices.meaning.set(word, new Set());
                            }
                            indices.meaning.get(word).add(index);
                        }
                    });
            }

            // Index by part of speech
            if (card.partOfSpeech) {
                const pos = card.partOfSpeech.trim();
                if (!indices.partOfSpeech.has(pos)) {
                    indices.partOfSpeech.set(pos, new Set());
                }
                indices.partOfSpeech.get(pos).add(index);
            }

            // Index by tags
            if (card.tags) {
                card.tags.split(/\s+/).forEach((tag) => {
                    if (tag) {
                        if (!indices.tags.has(tag)) {
                            indices.tags.set(tag, new Set());
                        }
                        indices.tags.get(tag).add(index);
                    }
                });
            }
        });

        return indices;
    }

    // Get all unique values for filtering
    getUniqueValues(field, subfield = null) {
        const values = new Set();

        this.cards.forEach((card) => {
            let value;

            if (subfield && card[field]) {
                value = card[field][subfield];
            } else {
                value = card[field];
            }

            if (value !== null && value !== undefined && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach((v) => values.add(v));
                } else {
                    values.add(value);
                }
            }
        });

        return Array.from(values).sort();
    }

    // Get unique books
    getUniqueBooks() {
        const books = new Set();
        this.cards.forEach((card) => {
            if (card.location && card.location.book) {
                books.add(card.location.book);
            }
        });
        return Array.from(books).sort((a, b) => a - b);
    }

    // Get unique lessons for a specific book
    getUniqueLessons(book) {
        const lessons = new Set();
        this.cards.forEach((card) => {
            if (
                card.location &&
                card.location.book === book &&
                card.location.lesson
            ) {
                lessons.add(card.location.lesson);
            }
        });
        return Array.from(lessons).sort((a, b) => a - b);
    }

    // Get unique vocabulary sections for a specific book and lesson
    getUniqueVocabularies(book, lesson) {
        const vocabularies = new Set();
        this.cards.forEach((card) => {
            if (
                card.location &&
                card.location.book === book &&
                card.location.lesson === lesson &&
                card.location.vocabulary
            ) {
                vocabularies.add(card.location.vocabulary);
            }
        });
        return Array.from(vocabularies).sort();
    }

    // Search cards by multiple criteria
    search(
        searchTerm,
        fields = ['simplified', 'traditional', 'pinyin', 'meaning']
    ) {
        if (!searchTerm || searchTerm.trim() === '') {
            return [...this.cards];
        }

        const searchTermLower = searchTerm.toLowerCase();
        const matchedIndices = new Set();
        const termWords = searchTermLower
            .split(/\s+/)
            .filter((word) => word.length > 0);

        termWords.forEach((word) => {
            fields.forEach((field) => {
                if (this.searchIndices[field]) {
                    // Find exact matches
                    if (this.searchIndices[field].has(word)) {
                        this.searchIndices[field]
                            .get(word)
                            .forEach((index) => matchedIndices.add(index));
                    }

                    // Find partial matches
                    for (const [key, indices] of this.searchIndices[field]) {
                        if (key.includes(word)) {
                            indices.forEach((index) =>
                                matchedIndices.add(index)
                            );
                        }
                    }
                }
            });
        });

        return Array.from(matchedIndices).map((index) => this.cards[index]);
    }

    // Advanced search with multiple criteria
    advancedSearch(criteria) {
        let results = [...this.cards];

        // Apply each criteria
        if (criteria.searchTerm && criteria.searchTerm.trim() !== '') {
            results = this.search(
                criteria.searchTerm,
                criteria.searchFields || [
                    'simplified',
                    'traditional',
                    'pinyin',
                    'meaning',
                ]
            );
        }

        // Filter by book
        if (
            criteria.book !== undefined &&
            criteria.book !== null &&
            criteria.book !== ''
        ) {
            results = results.filter(
                (card) =>
                    card.location &&
                    card.location.book === parseInt(criteria.book)
            );
        }

        // Filter by lesson
        if (
            criteria.lesson !== undefined &&
            criteria.lesson !== null &&
            criteria.lesson !== ''
        ) {
            results = results.filter(
                (card) =>
                    card.location &&
                    card.location.lesson === parseInt(criteria.lesson)
            );
        }

        // Filter by vocabulary
        if (criteria.vocabulary && criteria.vocabulary !== '') {
            results = results.filter(
                (card) =>
                    card.location &&
                    card.location.vocabulary === criteria.vocabulary
            );
        }

        // Filter by part of speech
        if (criteria.partOfSpeech && criteria.partOfSpeech !== '') {
            results = results.filter(
                (card) => card.partOfSpeech === criteria.partOfSpeech
            );
        }

        // Filter by tags
        if (criteria.tags && criteria.tags.length > 0) {
            results = results.filter((card) => {
                if (!card.tags) return false;
                const cardTags = card.tags.split(/\s+/);
                return criteria.tags.some((tag) => cardTags.includes(tag));
            });
        }

        // Filter by minimum/maximum order
        if (criteria.minOrder !== undefined) {
            results = results.filter(
                (card) =>
                    card.location && card.location.order >= criteria.minOrder
            );
        }

        if (criteria.maxOrder !== undefined) {
            results = results.filter(
                (card) =>
                    card.location && card.location.order <= criteria.maxOrder
            );
        }

        return results;
    }

    // Sort cards
    sort(cards, sortBy = 'location', direction = 'asc') {
        const sorted = [...cards];

        sorted.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'simplified':
                    aValue = a.simplified || '';
                    bValue = b.simplified || '';
                    break;

                case 'traditional':
                    aValue = a.traditional || '';
                    bValue = b.traditional || '';
                    break;

                case 'pinyin':
                    aValue = a.pinyin || '';
                    bValue = b.pinyin || '';
                    break;

                case 'meaning':
                    aValue = a.meaning || '';
                    bValue = b.meaning || '';
                    break;

                case 'partOfSpeech':
                    aValue = a.partOfSpeech || '';
                    bValue = b.partOfSpeech || '';
                    break;

                case 'location':
                    // Sort by book -> lesson -> vocabulary -> order
                    const aLoc = a.location || {};
                    const bLoc = b.location || {};

                    // Compare book
                    if (aLoc.book !== bLoc.book) {
                        aValue = aLoc.book || 0;
                        bValue = bLoc.book || 0;
                    }
                    // Compare lesson
                    else if (aLoc.lesson !== bLoc.lesson) {
                        aValue = aLoc.lesson || 0;
                        bValue = bLoc.lesson || 0;
                    }
                    // Compare vocabulary (Roman numerals)
                    else if (aLoc.vocabulary !== bLoc.vocabulary) {
                        aValue = this.romanToNumber(aLoc.vocabulary || '');
                        bValue = this.romanToNumber(bLoc.vocabulary || '');
                    }
                    // Compare order
                    else {
                        aValue = aLoc.order || 0;
                        bValue = bLoc.order || 0;
                    }
                    break;

                case 'book':
                    aValue = (a.location && a.location.book) || 0;
                    bValue = (b.location && b.location.book) || 0;
                    break;

                case 'lesson':
                    aValue = (a.location && a.location.lesson) || 0;
                    bValue = (b.location && b.location.lesson) || 0;
                    break;

                case 'vocabulary':
                    aValue = this.romanToNumber(
                        (a.location && a.location.vocabulary) || ''
                    );
                    bValue = this.romanToNumber(
                        (b.location && b.location.vocabulary) || ''
                    );
                    break;

                case 'order':
                    aValue = (a.location && a.location.order) || 0;
                    bValue = (b.location && b.location.order) || 0;
                    break;

                default:
                    aValue = a[sortBy] || '';
                    bValue = b[sortBy] || '';
            }

            // Handle string comparison
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            // Handle number comparison
            return direction === 'asc' ? aValue - bValue : bValue - aValue;
        });

        return sorted;
    }

    // Helper to convert Roman numerals to numbers for sorting
    romanToNumber(roman) {
        if (!roman) return 0;

        const romanMap = {
            I: 1,
            II: 2,
            III: 3,
            IV: 4,
            V: 5,
            VI: 6,
            VII: 7,
            VIII: 8,
            IX: 9,
            X: 10,
        };

        return romanMap[roman] || 0;
    }

    // Get statistics
    getStatistics() {
        const stats = {
            totalCards: this.cards.length,
            byBook: {},
            byPartOfSpeech: {},
            byVocabulary: {},
            characters: {
                simplified: new Set(),
                traditional: new Set(),
            },
        };

        this.cards.forEach((card) => {
            // Count by book
            if (card.location && card.location.book) {
                const book = card.location.book;
                if (!stats.byBook[book]) {
                    stats.byBook[book] = { total: 0, lessons: new Set() };
                }
                stats.byBook[book].total++;
                if (card.location.lesson) {
                    stats.byBook[book].lessons.add(card.location.lesson);
                }
            }

            // Count by part of speech
            if (card.partOfSpeech) {
                const pos = card.partOfSpeech.trim();
                stats.byPartOfSpeech[pos] =
                    (stats.byPartOfSpeech[pos] || 0) + 1;
            }

            // Count by vocabulary section
            if (card.location && card.location.vocabulary) {
                const vocab = card.location.vocabulary;
                stats.byVocabulary[vocab] =
                    (stats.byVocabulary[vocab] || 0) + 1;
            }

            // Track unique characters
            if (card.simplified) {
                card.simplified
                    .split('')
                    .forEach((char) => stats.characters.simplified.add(char));
            }
            if (card.traditional) {
                card.traditional
                    .split('')
                    .forEach((char) => stats.characters.traditional.add(char));
            }
        });

        // Convert Sets to arrays
        Object.keys(stats.byBook).forEach((book) => {
            stats.byBook[book].lessons = Array.from(
                stats.byBook[book].lessons
            ).sort();
        });

        stats.characters.simplified = Array.from(stats.characters.simplified);
        stats.characters.traditional = Array.from(stats.characters.traditional);

        return stats;
    }

    // Get cards by location range
    getCardsByLocationRange(start, end) {
        return this.cards.filter((card) => {
            if (!card.location) return false;

            const { book, lesson, vocabulary, order } = card.location;
            const cardRoman = this.romanToNumber(vocabulary);
            const startRoman = this.romanToNumber(start.vocabulary);
            const endRoman = this.romanToNumber(end.vocabulary);

            // Check if card is within range
            if (book < start.book || book > end.book) return false;
            if (book === start.book && lesson < start.lesson) return false;
            if (book === end.book && lesson > end.lesson) return false;
            if (
                book === start.book &&
                lesson === start.lesson &&
                cardRoman < startRoman
            )
                return false;
            if (
                book === end.book &&
                lesson === end.lesson &&
                cardRoman > endRoman
            )
                return false;
            if (
                book === start.book &&
                lesson === start.lesson &&
                cardRoman === startRoman &&
                order < start.order
            )
                return false;
            if (
                book === end.book &&
                lesson === end.lesson &&
                cardRoman === endRoman &&
                order > end.order
            )
                return false;

            return true;
        });
    }

    // Get cards grouped by book and lesson
    getCardsGroupedByLocation() {
        const groups = {};

        this.cards.forEach((card) => {
            if (card.location) {
                const { book, lesson, vocabulary } = card.location;
                const bookKey = `Book ${book}`;
                const lessonKey = `Lesson ${lesson}`;
                const vocabKey = `Vocabulary ${vocabulary}`;

                if (!groups[bookKey]) groups[bookKey] = {};
                if (!groups[bookKey][lessonKey])
                    groups[bookKey][lessonKey] = {};
                if (!groups[bookKey][lessonKey][vocabKey]) {
                    groups[bookKey][lessonKey][vocabKey] = [];
                }

                groups[bookKey][lessonKey][vocabKey].push(card);
            }
        });

        return groups;
    }

    // Export to CSV
    exportToCSV(cards = this.cards, includeLocation = true) {
        if (cards.length === 0) return '';

        const headers = [
            'Simplified',
            'Traditional',
            'Pinyin',
            'Meaning',
            'Part of Speech',
            'Tags',
        ];

        if (includeLocation) {
            headers.push('Book', 'Lesson', 'Vocabulary', 'Order');
        }

        const rows = cards.map((card) => {
            const row = [
                `"${card.simplified || ''}"`,
                `"${card.traditional || ''}"`,
                `"${card.pinyin || ''}"`,
                `"${card.meaning || ''}"`,
                `"${card.partOfSpeech || ''}"`,
                `"${card.tags || ''}"`,
            ];

            if (includeLocation && card.location) {
                row.push(
                    card.location.book || '',
                    card.location.lesson || '',
                    `"${card.location.vocabulary || ''}"`,
                    card.location.order || ''
                );
            }

            return row.join(',');
        });

        return [headers.join(','), ...rows].join('\n');
    }

    // Reset to original cards
    reset() {
        this.cards = [...this.originalCards];
        this.searchIndices = this.buildSearchIndices();
        return this.cards;
    }

    // Update cards
    updateCards(newCards) {
        this.cards = Array.isArray(newCards) ? newCards : [];
        this.originalCards = [...this.cards];
        this.searchIndices = this.buildSearchIndices();
        return this.cards;
    }

    // Get random cards for review
    getRandomCards(count = 10) {
        const shuffled = [...this.cards].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    // Get cards by character frequency
    getCardsByCharacterFrequency(limit = 100) {
        const characterCount = new Map();

        // Count character frequency
        this.cards.forEach((card) => {
            if (card.simplified) {
                card.simplified.split('').forEach((char) => {
                    characterCount.set(
                        char,
                        (characterCount.get(char) || 0) + 1
                    );
                });
            }
        });

        // Sort cards by character frequency
        return [...this.cards]
            .sort((a, b) => {
                const aChars = a.simplified ? a.simplified.split('') : [];
                const bChars = b.simplified ? b.simplified.split('') : [];

                const aScore = aChars.reduce(
                    (sum, char) => sum + (characterCount.get(char) || 0),
                    0
                );
                const bScore = bChars.reduce(
                    (sum, char) => sum + (characterCount.get(char) || 0),
                    0
                );

                return bScore - aScore; // Higher frequency first
            })
            .slice(0, limit);
    }
}

// Create a convenience function to load from JSON
export function loadVocabularyManager(jsonData) {
    const cards = Array.isArray(jsonData) ? jsonData : [];
    return new VocabularyManager(cards);
}
