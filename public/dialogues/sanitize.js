const fs = require('fs');
const path = require('path');

const TARGET_DIR = __dirname;
const MANIFEST_PATH = path.join(TARGET_DIR, 'manifest.json');

// Define the desired key order
const KEY_ORDER = [
    'lesson',
    'dialogue_id',
    'title',
    'participants',
    'video_url',
    'vocabulary_video_url',
    'content',
];

async function sanitizeDialogues() {
    try {
        if (!fs.existsSync(MANIFEST_PATH)) {
            console.error('Error: manifest.json not found in ' + TARGET_DIR);
            return;
        }

        const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
        const files = manifest.files;

        console.log(
            `Processing ${files.length} files with strict key ordering...`,
        );

        files.forEach((fileName) => {
            const filePath = path.join(TARGET_DIR, fileName);

            if (!fs.existsSync(filePath)) {
                console.warn(`Skipping: ${fileName} (File not found)`);
                return;
            }

            let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // 1. Sanitize Participants (Remove Pinyin in parentheses)
            if (data.participants && Array.isArray(data.participants)) {
                data.participants = data.participants.map((name) =>
                    name.replace(/\s*\(.*?\)\s*/g, '').trim(),
                );
            }

            // 2. Ensure Video URL keys exist
            if (data.video_url === undefined) data.video_url = '';
            if (data.vocabulary_video_url === undefined)
                data.vocabulary_video_url = '';

            // 3. Create a new object with the strictly ordered keys
            const orderedData = {};

            // First, add keys in the specified order
            KEY_ORDER.forEach((key) => {
                if (data.hasOwnProperty(key)) {
                    orderedData[key] = data[key];
                } else if (
                    key === 'video_url' ||
                    key === 'vocabulary_video_url'
                ) {
                    orderedData[key] = ''; // Fallback for missing required keys
                }
            });

            // Then, add any remaining keys that weren't in the KEY_ORDER list (to prevent data loss)
            Object.keys(data).forEach((key) => {
                if (!orderedData.hasOwnProperty(key)) {
                    orderedData[key] = data[key];
                }
            });

            // 4. Write back the file (JSON.stringify respects the insertion order)
            fs.writeFileSync(
                filePath,
                JSON.stringify(orderedData, null, 4),
                'utf8',
            );
            console.log(`Processed and Reordered: ${fileName}`);
        });

        console.log('Task completed.');
    } catch (err) {
        console.error('Execution failed:', err.message);
    }
}

sanitizeDialogues();
