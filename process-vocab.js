import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data/vocabulary');
const outputFile = path.join(process.cwd(), 'src/vocabData.json');

const processFiles = () => {
    const files = fs
        .readdirSync(dataDir)
        .filter((file) => file.endsWith('.csv'));
    const allData = [];

    files.forEach((file) => {
        // Parse filename: XX (Book), YY (Lesson), ZZ (List)
        const match = file.match(/(\d{2})(\d{2})(\d{2})\.csv/);
        if (!match) return;

        const [_, book, lesson, list] = match;
        const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');

        // Split by lines and skip the header
        const lines = content.split('\n').filter((line) => line.trim() !== '');
        const headers = lines[0].split(',');

        lines.slice(1).forEach((line, index) => {
            // Handle commas inside quotes in CSV (e.g., "to feel, to think")
            const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

            if (parts && parts.length >= 4) {
                allData.push({
                    id: `${book}-${lesson}-${list}-${index}`,
                    book: parseInt(book),
                    lesson: parseInt(lesson),
                    list: parseInt(list),
                    hanzi: parts[0].replace(/"/g, ''),
                    pinyin: parts[1].replace(/"/g, ''),
                    pos: parts[2].replace(/"/g, ''),
                    translation: parts[3].replace(/"/g, ''),
                });
            }
        });
    });

    fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2));
    console.log(`✅ Processed ${allData.length} items into src/vocabData.json`);
};

processFiles();
