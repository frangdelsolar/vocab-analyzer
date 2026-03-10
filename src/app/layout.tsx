// src/app/layout.tsx
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

import Sidebar from '@/components/Navigation';
import { ThemeProvider } from '@/context/ThemeProvider';
import { VocabProvider } from '@/context/VocabularyContext'; //

const geistSans = Geist({
    variable: '--font-sans',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-Hans" suppressHydrationWarning>
            <body className="font-sans bg-paper text-ink transition-colors duration-500">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <VocabProvider>
                        <div className="flex min-h-screen">
                            <Sidebar />
                            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                                {children}
                            </div>
                        </div>
                    </VocabProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
