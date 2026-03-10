'use client';

import {
    useVocabulary,
    SearchScope,
    ExplorerMode,
} from '@/context/VocabularyContext';
import {
    Settings2,
    GraduationCap,
    BookCopy,
    Layout,
    MousePointer2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';

// Define the logic mapping for our UI buttons
const SCOPES: {
    id: string;
    label: string;
    scope: SearchScope;
    mode: ExplorerMode;
    icon: any;
}[] = [
    {
        id: 'none',
        label: 'None',
        scope: 'none',
        mode: 'section',
        icon: MousePointer2,
    },
    {
        id: 'chapter',
        label: 'Chapter',
        scope: 'explorer',
        mode: 'chapter',
        icon: BookCopy,
    },
    {
        id: 'section',
        label: 'Section',
        scope: 'explorer',
        mode: 'section',
        icon: Layout,
    },
    {
        id: 'cumulative',
        label: 'Cumulative',
        scope: 'explorer',
        mode: 'cumulative',
        icon: GraduationCap,
    },
];

export default function StudySettingsControl() {
    const { settings, setSettings } = useVocabulary();

    const handleFilterClick = (scope: SearchScope, mode: ExplorerMode) => {
        setSettings((prev) => ({
            ...prev,
            scope: scope,
            explorer: {
                ...prev.explorer,
                mode: mode,
            },
        }));
    };

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
                {SCOPES.map((filter) => {
                    const Icon = filter.icon;

                    // Logic to determine if this button is the active one
                    const isActive =
                        settings.scope === filter.scope &&
                        (filter.scope !== 'explorer' ||
                            settings.explorer.mode === filter.mode);

                    return (
                        <button
                            key={filter.id}
                            onClick={() =>
                                handleFilterClick(filter.scope, filter.mode)
                            }
                            className={cn(
                                'flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 border',
                                isActive
                                    ? 'bg-red-500 border-red-600 text-white shadow-sm scale-[1.02]'
                                    : 'bg-surface border-border-main text-ink/60 hover:border-red-500/30 hover:text-red-500',
                            )}
                        >
                            <Icon size={14} strokeWidth={isActive ? 3 : 2} />
                            <span className="text-xs font-bold uppercase tracking-tighter">
                                {filter.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
