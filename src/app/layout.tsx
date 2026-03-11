// src/app/layout.tsx
import { Noto_Sans_TC } from 'next/font/google'; // Import Noto Sans TC
import './globals.css';

import Sidebar from '@/components/Navigation';
import { ThemeProvider } from '@/context/ThemeProvider';
import { VocabProvider } from '@/context/VocabularyContext';
import { UserProvider } from '@/context/UserContext';

// Configure the font
const notoSmansTC = Noto_Sans_TC({
    subsets: ['latin'],
    weight: ['100', '300', '400', '500', '700', '900'],
    variable: '--font-noto-sans-tc', // Define the CSS variable
    display: 'swap',
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Add the font variable to the html tag
        <html
            lang="zh-TW"
            className={`${notoSmansTC.variable}`}
            suppressHydrationWarning
        >
            <body className="font-sans bg-paper text-ink transition-colors duration-500">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <UserProvider>
                        <VocabProvider>
                            <div className="flex min-h-screen">
                                <Sidebar />
                                <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                                    {children}
                                </div>
                            </div>
                        </VocabProvider>
                    </UserProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
