// components/home/VocabularyPreview.tsx
import { Card, Typography, Button } from '@/components/ui';
import { PlayCircle } from 'lucide-react';

const MOCK_VOCAB = [
    { hz: '垃圾', py: 'lājī', en: 'Garbage' },
    { hz: '回收', py: 'huíshōu', en: 'Recycle' },
    { hz: '塑料', py: 'sùliào', en: 'Plastic' },
];

export const VocabularyPreview = () => (
    <div className="w-full">
        <Typography variant="h2" className="mb-6">
            Vocabulary Preview
        </Typography>
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border-main bg-ink/5">
                            <th className="p-4 text-xs uppercase tracking-widest opacity-50 font-bold">
                                Character
                            </th>
                            <th className="p-4 text-xs uppercase tracking-widest opacity-50 font-bold">
                                Pinyin
                            </th>
                            <th className="p-4 text-xs uppercase tracking-widest opacity-50 font-bold">
                                Meaning
                            </th>
                            <th className="p-4 text-xs uppercase tracking-widest opacity-50 font-bold text-right">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_VOCAB.map((word, i) => (
                            <tr
                                key={i}
                                className="border-b border-border-main last:border-0 hover:bg-ink/5 transition-colors group"
                            >
                                <td className="p-4">
                                    <Typography
                                        variant="hanzi"
                                        className="text-xl"
                                    >
                                        {word.hz}
                                    </Typography>
                                </td>
                                <td className="p-4 font-mono text-sm opacity-60">
                                    {word.py}
                                </td>
                                <td className="p-4 text-sm font-medium">
                                    {word.en}
                                </td>
                                <td className="p-4 text-right">
                                    <button className="p-2 opacity-0 group-hover:opacity-100 text-ink/40 hover:text-red-500 transition-all">
                                        <PlayCircle size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 bg-ink/5 text-center">
                <Button variant="ghost" size="sm" className="w-full">
                    Open Flashcard Deck
                </Button>
            </div>
        </Card>
    </div>
);
