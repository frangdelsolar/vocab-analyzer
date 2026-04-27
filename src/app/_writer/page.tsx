'use client';

import { useState, useMemo } from 'react';
import { Shell } from '@/components/layout/Shell';
import { PageHeader } from '@/components/layout/PageHeader';
import { useVocabulary } from '@/context/VocabularyContext';
import HanziWriter from './_components/HanziWriter';
import { Button, Typography } from '@/components/ui';
import { Container, Stack, Row, Box } from '@/components/layout/Primitives';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function WritingPage() {
    const { filteredList, isLoading } = useVocabulary();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Mapeamos la lista filtrada a un array de palabras (strings)
    const vocabularyWords = useMemo(
        () => filteredList.map((item) => item.traditional),
        [filteredList],
    );

    // const currentWord = vocabularyWords[currentIndex];
    const currentWord = '人';
    const progress = ((currentIndex + 1) / vocabularyWords.length) * 100;

    if (isLoading)
        return (
            <Shell>
                <Box className="p-20 text-center opacity-20">Loading...</Box>
            </Shell>
        );

    if (vocabularyWords.length === 0)
        return (
            <Shell>
                <Box className="p-20 text-center">No vocabulary found.</Box>
            </Shell>
        );

    return (
        <Shell>
            <PageHeader
                overline="Practice Mode"
                title="Stroke Mastery"
                description={`Word ${currentIndex + 1} of ${vocabularyWords.length}`}
            />

            <Container className="mt-10 pb-20">
                <Stack gap={10}>
                    {/* Progress Section */}
                    <Stack gap={2}>
                        <Box className="h-1 w-full bg-ink/5 rounded-full overflow-hidden">
                            <Box
                                className="h-full bg-cyan-500 transition-all duration-700"
                                style={{ width: `${progress}%` }}
                            />
                        </Box>
                        <Typography
                            variant="small"
                            className="text-center font-black italic text-cyan-500 text-xs"
                        >
                            {currentIndex + 1} / {vocabularyWords.length}
                        </Typography>
                    </Stack>

                    <HanziWriter key={currentWord} targetPhrase={currentWord} />

                    {/* Footer Controls */}
                    <Box className="pt-8 border-t border-ink/5">
                        <Row className="justify-between">
                            <Button
                                variant="ghost"
                                disabled={currentIndex === 0}
                                onClick={() =>
                                    setCurrentIndex((prev) => prev - 1)
                                }
                                className="rounded-2xl gap-2"
                            >
                                <ChevronLeft size={18} />
                                <span className="font-bold">Prev Card</span>
                            </Button>

                            <Button
                                variant={
                                    currentIndex === vocabularyWords.length - 1
                                        ? 'ghost'
                                        : 'primary'
                                }
                                disabled={
                                    currentIndex === vocabularyWords.length - 1
                                }
                                onClick={() =>
                                    setCurrentIndex((prev) => prev + 1)
                                }
                                className="rounded-2xl gap-2 px-10"
                            >
                                <span className="font-bold">Next Card</span>
                                <ChevronRight size={18} />
                            </Button>
                        </Row>
                    </Box>
                </Stack>
            </Container>
        </Shell>
    );
}
