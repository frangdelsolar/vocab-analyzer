// app/library/[bookId]/[lesson]/[part]/page.tsx
import DialogueClientView from './DialogueClientView';

// 1. generateStaticParams MUST be in a Server Component file
export async function generateStaticParams() {
    const books = [1, 2, 3, 4, 5, 6];
    const lessons = Array.from({ length: 15 }, (_, i) => i + 1);
    const parts = ['1', '2']; // Use strings to match route expectations

    return books.flatMap((b) =>
        lessons.flatMap((l) =>
            parts.map((p) => ({
                bookId: `book-${b}`,
                lesson: l.toString(),
                part: p,
            })),
        ),
    );
}

export default async function DialoguePage({
    params,
}: {
    params: Promise<{ bookId: string; lesson: string; part: string }>;
}) {
    // We pass the promise directly to the client view
    return <DialogueClientView params={params} />;
}
