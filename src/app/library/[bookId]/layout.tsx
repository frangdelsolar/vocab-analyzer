// app/library/[bookId]/layout.tsx
export async function generateStaticParams() {
    return [
        { bookId: 'book-1' },
        { bookId: 'book-2' },
        { bookId: 'book-3' },
        { bookId: 'book-4' },
        { bookId: 'book-5' },
        { bookId: 'book-6' },
    ];
}

export default function BookLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
