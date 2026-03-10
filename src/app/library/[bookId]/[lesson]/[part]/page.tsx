// app/library/[bookId]/[lesson]/[part]/page.tsx
import DialogueClientView from './DialogueClientView';
import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
    try {
        // 1. Load the manifest from the filesystem during build
        const filePath = path.join(
            process.cwd(),
            'public',
            'dialogues',
            'manifest.json',
        );
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { files }: { files: string[] } = JSON.parse(fileContent);

        // 2. Map filenames like "030501.json" to { bookId: 'book-3', lesson: '5', part: '1' }
        return files.map((filename) => {
            const b = parseInt(filename.substring(0, 2));
            const l = parseInt(filename.substring(2, 4));
            const p = parseInt(filename.substring(4, 6));

            return {
                bookId: `book-${b}`,
                lesson: l.toString(),
                part: p.toString(),
            };
        });
    } catch (error) {
        console.error('Failed to generate static params from manifest:', error);
        return [];
    }
}

export default async function DialoguePage({
    params,
}: {
    params: Promise<{ bookId: string; lesson: string; part: string }>;
}) {
    return <DialogueClientView params={params} />;
}
