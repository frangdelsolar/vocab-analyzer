// @/app/study/_components/SessionDeckPreview.tsx
import { AnkiCard } from '@/context/VocabularyContext';
import { Typography } from '@/components/ui';
import { useFSRS } from '@/context/FSRSContext';
import { cn } from '@/lib/utils';
import { Clock, Plus, Ban } from 'lucide-react';

interface PreviewProps {
    allFilteredCards: AnkiCard[]; // The full list from context
    dueGuids: Set<string>;
    sessionCards: AnkiCard[]; // Cards actually in the queue
}

export function SessionDeckPreview({
    allFilteredCards,
    dueGuids,
    sessionCards,
}: PreviewProps) {
    const sessionGuids = new Set(sessionCards.map((c) => c.guid));

    return (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-12">
            <div className="mb-8 border-l-4 border-ink pl-6 py-2">
                <Typography
                    variant="h3"
                    className="border-none p-0 m-0 text-xl font-bold tracking-tight"
                >
                    Deck Composition
                </Typography>
                <Typography variant="small" className="opacity-40 font-medium">
                    Showing all {allFilteredCards.length} items in current
                    selection
                </Typography>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {allFilteredCards.map((card) => {
                    const isInSession = sessionGuids.has(card.guid);
                    const isDue = dueGuids.has(card.guid);

                    return (
                        <DeckCard
                            key={card.guid}
                            card={card}
                            isDue={isDue}
                            isExcluded={!isInSession}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// --- Subcomponent ---

function DeckCard({
    card,
    isDue,
    isExcluded,
}: {
    card: AnkiCard;
    isDue: boolean;
    isExcluded: boolean;
}) {
    const { srsMap } = useFSRS();
    const srsData = srsMap[card.guid];

    const lastDateStr = srsData?.last_review
        ? new Date(srsData.last_review).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
          })
        : '';

    return (
        <div
            className={cn(
                'group relative flex flex-col h-full transition-all duration-300 border-2 rounded-2xl overflow-hidden bg-surface',
                isDue && 'border-blue-500 bg-blue-500/[0.02]',
                !isDue && !isExcluded && 'border-green-600 bg-green-600/[0.02]',
                isExcluded &&
                    'border-border-main opacity-40 grayscale-[0.5] hover:opacity-100 hover:grayscale-0',
            )}
        >
            <div className="flex-1 flex flex-col items-center justify-center p-5 min-h-[100px]">
                <Typography
                    variant="hanzi"
                    className={cn(
                        'text-2xl transition-transform group-hover:scale-110',
                        isExcluded ? 'text-ink/40' : 'text-ink',
                    )}
                >
                    {card.traditional}
                </Typography>
            </div>

            <div
                className={cn(
                    'py-1.5 px-3 flex items-center justify-center gap-2 border-t text-[9px] font-black uppercase tracking-widest',
                    isDue
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : !isExcluded
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'bg-ink/5 border-border-main text-ink/40',
                )}
            >
                {isDue ? (
                    <>
                        <Clock size={10} />
                        <span>Review</span>
                    </>
                ) : !isExcluded ? (
                    <>
                        <Plus size={10} />
                        <span>New</span>
                    </>
                ) : srsData ? (
                    <>
                        <Clock size={10} />
                        <span>Done • {lastDateStr}</span>
                    </>
                ) : (
                    <>
                        <Ban size={10} />
                        <span>Filtered</span>
                    </>
                )}
            </div>
        </div>
    );
}
