// @/app/study/_components/SessionDeckPreview.tsx
import { AnkiCard } from '@/context/VocabularyContext';
import { Typography, Card } from '@/components/ui';
import { useFSRS } from '@/context/FSRSContext';
import { cn } from '@/lib/utils';
import { Clock, Plus } from 'lucide-react';

interface PreviewProps {
    cards: AnkiCard[];
    dueGuids: Set<string>;
}

export function SessionDeckPreview({ cards, dueGuids }: PreviewProps) {
    return (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="mb-8 border-l-4 border-ink pl-6 py-2">
                <Typography
                    variant="h3"
                    className="border-none p-0 m-0 text-xl font-bold tracking-tight"
                >
                    Session Deck
                </Typography>
                <Typography variant="small" className="opacity-40 font-medium">
                    {cards.length} items prepared
                </Typography>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {cards.map((card) => (
                    <DeckCard
                        key={card.guid}
                        card={card}
                        isDue={dueGuids.has(card.guid)}
                    />
                ))}
            </div>
        </div>
    );
}

// --- Subcomponent ---

function DeckCard({ card, isDue }: { card: AnkiCard; isDue: boolean }) {
    const { srsMap } = useFSRS();
    const srsData = srsMap[card.guid];

    // Handle date formatting internally
    const lastDateStr = srsData?.last_review
        ? new Date(srsData.last_review).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
          })
        : '';

    return (
        <Card
            className={cn(
                'group relative flex flex-col h-full transition-all duration-300 border-2',
                isDue
                    ? 'border-blue-500 bg-blue-500/[0.02]'
                    : 'border-border-main hover:border-ink/20',
            )}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[120px]">
                <Typography
                    variant="hanzi"
                    className="text-2xl text-ink transition-transform group-hover:scale-105"
                >
                    {card.traditional}
                </Typography>
            </div>

            <div
                className={cn(
                    'py-1.5 px-3 flex items-center justify-center gap-2 border-t',
                    isDue
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-ink/5 border-border-main',
                )}
            >
                {srsData ? (
                    <>
                        <Clock
                            size={10}
                            className={cn(isDue ? 'text-white' : 'opacity-30')}
                        />
                        <span
                            className={cn(
                                'text-[9px] font-black uppercase tracking-widest',
                                isDue ? 'text-white' : 'opacity-40 text-ink',
                            )}
                        >
                            {isDue ? `Review • ${lastDateStr}` : lastDateStr}
                        </span>
                    </>
                ) : (
                    <>
                        <Plus size={10} className="opacity-30" />
                        <span className="text-[9px] font-black uppercase opacity-30 tracking-widest text-ink">
                            New
                        </span>
                    </>
                )}
            </div>
        </Card>
    );
}
