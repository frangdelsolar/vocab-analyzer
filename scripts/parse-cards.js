import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the parser
const parserPath = path.join(__dirname, '../src/utils/ankiParser.js');
const { AnkiCSVParser } = await import(parserPath);

// Parse the dangdai.txt file
const filePath = path.join(__dirname, '../data/dangdai.txt');
const csvContent = fs.readFileSync(filePath, 'utf8');

console.log('🔍 Parsing Anki cards...\n');

const parser = new AnkiCSVParser(csvContent);
const cards = parser.parse();
const formattedCards = parser.getFormattedCards();

console.log('✅ Successfully parsed Anki cards!');
console.log(`📊 Total cards: ${cards.length}\n`);

// Display first 5 cards as a sample with nested location info
console.log('📝 Sample cards with nested location (first 5):\n');
formattedCards.slice(0, 5).forEach((card, index) => {
    console.log(`Card ${index + 1}:`);
    console.log(`  Traditional: ${card.traditional}`);
    console.log(`  Simplified: ${card.simplified}`);
    console.log(`  Pinyin: ${card.pinyin}`);
    console.log(`  Part of Speech: ${card.partOfSpeech || 'N/A'}`);
    console.log(`  Meaning: ${card.meaning}`);
    console.log(`  Location:`);
    console.log(`    Book: ${card.location?.book || 'N/A'}`);
    console.log(`    Lesson: ${card.location?.lesson || 'N/A'} (number)`);
    console.log(`    Vocabulary: ${card.location?.vocabulary || 'N/A'}`);
    console.log(`    Order: ${card.location?.order || 'N/A'}`);
    console.log(`    Full Lesson: ${card.location?.fullLesson || 'N/A'}`);
    console.log(`  Tags: ${card.tags || 'N/A'}`);
    console.log('---');
});

// Show some examples of different lesson IDs
console.log('\n🎯 Examples of parsed lesson IDs:');
const examples = formattedCards
    .filter(
        (card) =>
            card.lessonId &&
            (card.lessonId.includes('I-01') ||
                card.lessonId.includes('II-03') ||
                card.lessonId.includes('III-05'))
    )
    .slice(0, 3);

examples.forEach((card) => {
    const loc = card.location;
    console.log(
        `  ${card.lessonId} → Book ${loc?.book}, Lesson ${loc?.lesson}, Vocabulary ${loc?.vocabulary}, Order ${loc?.order}`
    );
});

// Show statistics by book
console.log('\n📈 Statistics by Book:');
const bookStats = parser.getBookStats();
Object.keys(bookStats)
    .sort()
    .forEach((book) => {
        const stats = bookStats[book];
        console.log(`  Book ${book}:`);
        console.log(`    Total cards: ${stats.totalCards}`);
        console.log(
            `    Lessons: ${stats.lessons.length} (${stats.lessons.join(', ')})`
        );
        console.log(
            `    Vocabulary sections: ${stats.vocabularies.join(', ')}`
        );
    });

// Show detailed stats for Book 1
console.log('\n📘 Detailed Statistics for Book 1:');
const book1Stats = parser.getLessonStats(1);
Object.keys(book1Stats)
    .sort()
    .forEach((lesson) => {
        const stats = book1Stats[lesson];
        console.log(`  Lesson ${lesson}:`);
        console.log(`    Total cards: ${stats.totalCards}`);
        console.log(
            `    Vocabulary sections: ${stats.vocabularies.join(', ')}`
        );
    });

// Count cards with location info
const cardsWithLocation = formattedCards.filter(
    (card) =>
        card.location &&
        card.location.book &&
        card.location.lesson &&
        card.location.vocabulary &&
        card.location.order
).length;
console.log(
    `\n📍 Cards with complete location data: ${cardsWithLocation}/${formattedCards.length}`
);

// Count by vocabulary type
const vocabularyCount = {};
formattedCards.forEach((card) => {
    const vocab = card.location?.vocabulary;
    if (vocab) {
        vocabularyCount[vocab] = (vocabularyCount[vocab] || 0) + 1;
    }
});

console.log('\n📚 Cards by Vocabulary Section:');
Object.keys(vocabularyCount)
    .sort()
    .forEach((vocab) => {
        console.log(`  ${vocab}: ${vocabularyCount[vocab]}`);
    });

// Save to JSON file for reference
const outputPath = path.join(__dirname, '../public/parsed-cards.json');
fs.writeFileSync(outputPath, JSON.stringify(formattedCards, null, 2));
console.log(`\n💾 Full data saved to: ${outputPath}`);
