// lib/dialogue-utils.ts

export interface DialogueContent {
    speaker?: string; // Optional for Readings
    paragraph?: number; // Used in Readings
    text: string;
    pinyin?: string;
}

export interface DialogueData {
    lesson_number: number;
    part?: number;
    dialogue_id: 'dialogue' | 'reading'; //
    title: string;
    participants?: string[]; // Optional for Readings
    content: DialogueContent[];
    video_url?: string; // Main video
    vocabulary_video_url?: string; // Exercise video
}

const pad = (n: number | string) => n.toString().padStart(2, '0');

export async function getDialogue(
    book: string | number,
    lesson: string | number,
    part: string | number,
): Promise<DialogueData | null> {
    const filename = `${pad(book)}${pad(lesson)}${pad(part)}.json`;

    try {
        const res = await fetch(`/dialogues/${filename}`);
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error('Failed to load dialogue:', filename);
        return null;
    }
}
