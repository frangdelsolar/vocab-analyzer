'use client';

import { useVocabulary, HighlightScope } from '@/context/VocabularyContext';
import {
    Settings2,
    GraduationCap,
    BookCopy,
    Layout,
    MousePointer2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Typography } from './ui/typography';

const SCOPES: { value: HighlightScope; label: string; icon: any }[] = [
    { value: 'none', label: 'None', icon: MousePointer2 }, // Suggested icon: MousePointer2 or EyeOff
    { value: 'all', label: 'All', icon: Settings2 },
    { value: 'cumulative', label: 'Cumulative', icon: GraduationCap },
    { value: 'chapter', label: 'Chapter', icon: BookCopy },
    { value: 'section', label: 'Section', icon: Layout },
];

export default function StudySettingsControl() {
    const { settings, setSettings } = useVocabulary();

    return (
        <div className="flex flex-col gap-3 py-4 border-b border-border-main/50">
            <div className="flex items-center justify-between">
                <Typography
                    variant="small"
                    className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40"
                >
                    Vocabulary Highlight Filter
                </Typography>
            </div>

            <div className="flex flex-wrap gap-2">
                {SCOPES.map((scope) => {
                    const Icon = scope.icon;
                    const isActive = settings.scope === scope.value;

                    return (
                        <button
                            key={scope.value}
                            onClick={() => setSettings({ scope: scope.value })}
                            className={cn(
                                'flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 border',
                                isActive
                                    ? 'bg-red-500 border-red-600 text-white shadow-sm scale-[1.02]'
                                    : 'bg-surface border-border-main text-ink/60 hover:border-red-500/30 hover:text-red-500',
                            )}
                        >
                            <Icon size={14} strokeWidth={isActive ? 3 : 2} />
                            <span className="text-xs font-bold uppercase tracking-tighter">
                                {scope.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
