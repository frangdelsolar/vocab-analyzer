export class AnkiCSVParser {
    constructor(csvText) {
        this.csvText = csvText;
        this.parsedData = [];
    }

    parse() {
        const lines = this.csvText.split('\n');
        const dataLines = [];

        // Process metadata and data lines separately
        for (const line of lines) {
            if (line.startsWith('#')) {
                continue;
            }
            if (line.trim() === '') {
                continue;
            }
            dataLines.push(line);
        }

        // Parse data lines
        for (let i = 0; i < dataLines.length; i++) {
            const fields = this.splitTabSeparated(dataLines[i]);
            if (fields.length >= 12) {
                const lessonId = fields[3];
                const location = this.parseLessonId(lessonId);

                const card = {
                    guid: fields[0],
                    notetype: fields[1],
                    deck: fields[2],
                    lessonId: lessonId,
                    traditional: fields[4],
                    simplified: fields[5],
                    pinyin: fields[6],
                    pos: fields[7],
                    meaning: fields[8],
                    sound: this.extractSound(fields[9]),
                    additionalInfo: fields[10],
                    jsonInfo: this.parseJsonInfo(fields[10]),
                    tags: fields[11],
                    // Add location as a nested object
                    location: location,
                };
                this.parsedData.push(card);
            }
        }

        return this.parsedData;
    }

    splitTabSeparated(line) {
        const result = [];
        let currentField = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === '\t' && !inQuotes) {
                result.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }

        result.push(currentField);
        return result;
    }

    extractSound(field) {
        if (!field) return null;
        const match = field.match(/\[sound:(.*?)\]/);
        return match ? match[1] : null;
    }

    parseJsonInfo(field) {
        if (!field || field.trim() === '' || field === '""') return null;

        try {
            let jsonString = field;
            // Remove surrounding quotes if present
            if (jsonString.startsWith('"') && jsonString.endsWith('"')) {
                jsonString = jsonString.slice(1, -1);
            }

            // If the string starts with [{ and ends with }], it's likely JSON array
            if (jsonString.startsWith('[{') && jsonString.endsWith('}]')) {
                // Fix the JSON by properly quoting property names
                jsonString = jsonString.replace(
                    /([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)/g,
                    '$1"$2"$3'
                );

                // Also ensure string values are quoted (they often aren't for Chinese characters)
                jsonString = jsonString.replace(
                    /("[A-Za-z_][A-Za-z0-9_]*"\s*:\s*)([^",{}\[\]\s]+)(?=[,}\]])/g,
                    '$1"$2"'
                );

                return JSON.parse(jsonString);
            }

            return null;
        } catch (e) {
            // Silently fail for JSON parsing errors
            return null;
        }
    }

    parseLessonId(lessonId) {
        // Parse lessonId like "B1L01-I-01" or "B1L01-II-03"
        const defaultLocation = {
            book: null,
            lesson: null, // This should be a number (1, 2, 3, etc.)
            vocabulary: null,
            order: null,
            section: null,
            fullLesson: null,
            lessonNumber: null, // Keep the numeric lesson for easy access
            lessonString: null, // Keep the full string like "B1L01"
        };

        if (!lessonId) return defaultLocation;

        try {
            // Pattern: B{book}L{lesson}-{section}-{order}
            const pattern = /B(\d+)L(\d+)-([IVX]+)-(\d+)/i;
            const match = lessonId.match(pattern);

            if (match) {
                const book = parseInt(match[1], 10);
                const lessonNumber = parseInt(match[2], 10); // This is the numeric lesson
                const section = match[3]; // I, II, III, etc.
                const order = parseInt(match[4], 10);
                const lessonString = `B${book}L${lessonNumber
                    .toString()
                    .padStart(2, '0')}`;

                // Convert Roman numeral to vocabulary type
                const vocabulary = this.romanToVocabulary(section);

                return {
                    book,
                    lesson: lessonNumber, // Use the numeric lesson here
                    vocabulary,
                    order,
                    section,
                    fullLesson: lessonString,
                    lessonNumber, // Alias for consistency
                    lessonString, // Keep the full string
                };
            }

            return defaultLocation;
        } catch (error) {
            console.warn(`Failed to parse lessonId: ${lessonId}`, error);
            return defaultLocation;
        }
    }

    romanToVocabulary(romanNumeral) {
        // Convert Roman numeral to vocabulary type
        const romanMap = {
            I: 'I',
            II: 'II',
            III: 'III',
            IV: 'IV',
            V: 'V',
            VI: 'VI',
            VII: 'VII',
            VIII: 'VIII',
            IX: 'IX',
            X: 'X',
        };

        return romanMap[romanNumeral] || romanNumeral;
    }

    getFormattedCards() {
        return this.parsedData.map((card) => {
            // Get location info - it's already parsed and nested
            const location = card.location || {};

            return {
                guid: card.guid,
                lessonId: card.lessonId,
                traditional: card.traditional,
                simplified: card.simplified,
                pinyin: card.pinyin,
                meaning: card.meaning,
                partOfSpeech: card.pos,
                deck: card.deck,
                tags: card.tags,
                variants: card.jsonInfo || null,
                // Add location as a nested object
                location: {
                    book: location.book,
                    lesson: location.lesson, // This will be number like 1, 2, 3
                    vocabulary: location.vocabulary,
                    order: location.order,
                    section: location.section,
                    fullLesson: location.fullLesson,
                    lessonNumber: location.lessonNumber,
                    lessonString: location.lessonString,
                },
            };
        });
    }

    // Helper methods to access location properties easily
    getLocation(card) {
        return card.location || {};
    }

    getBook(card) {
        return this.getLocation(card).book;
    }

    getLesson(card) {
        return this.getLocation(card).lesson;
    }

    getVocabulary(card) {
        return this.getLocation(card).vocabulary;
    }

    getOrder(card) {
        return this.getLocation(card).order;
    }

    // Filter methods using nested location
    filterByBook(bookNumber) {
        return this.getFormattedCards().filter(
            (card) => card.location && card.location.book === bookNumber
        );
    }

    filterByLesson(bookNumber, lessonNumber) {
        return this.getFormattedCards().filter(
            (card) =>
                card.location &&
                card.location.book === bookNumber &&
                card.location.lesson === lessonNumber
        );
    }

    filterByVocabulary(bookNumber, lessonNumber, vocabulary) {
        return this.getFormattedCards().filter(
            (card) =>
                card.location &&
                card.location.book === bookNumber &&
                card.location.lesson === lessonNumber &&
                card.location.vocabulary === vocabulary
        );
    }

    // Statistics methods
    getBookStats() {
        const cards = this.getFormattedCards();
        const stats = {};

        cards.forEach((card) => {
            const location = card.location;
            if (location && location.book) {
                if (!stats[location.book]) {
                    stats[location.book] = {
                        totalCards: 0,
                        lessons: new Set(),
                        vocabularies: new Set(),
                    };
                }
                stats[location.book].totalCards++;
                if (location.lesson)
                    stats[location.book].lessons.add(location.lesson);
                if (location.vocabulary)
                    stats[location.book].vocabularies.add(location.vocabulary);
            }
        });

        // Convert Sets to arrays
        Object.keys(stats).forEach((book) => {
            stats[book].lessons = Array.from(stats[book].lessons).sort(
                (a, b) => a - b
            );
            stats[book].vocabularies = Array.from(
                stats[book].vocabularies
            ).sort();
        });

        return stats;
    }

    getLessonStats(bookNumber) {
        const cards = this.getFormattedCards();
        const stats = {};

        cards.forEach((card) => {
            const location = card.location;
            if (location && location.book === bookNumber && location.lesson) {
                const key = `${location.lesson}`;
                if (!stats[key]) {
                    stats[key] = {
                        lesson: location.lesson,
                        totalCards: 0,
                        vocabularies: new Set(),
                    };
                }
                stats[key].totalCards++;
                if (location.vocabulary)
                    stats[key].vocabularies.add(location.vocabulary);
            }
        });

        // Convert Sets to arrays
        Object.keys(stats).forEach((lesson) => {
            stats[lesson].vocabularies = Array.from(
                stats[lesson].vocabularies
            ).sort();
        });

        return stats;
    }
}
