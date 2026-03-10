'use client';

import { useState } from 'react';
import { useVocabulary, ExplorerMode } from '@/context/VocabularyContext';
import { cn } from '@/lib/utils';
import {
    Search,
    BookOpen,
    Layers,
    ListFilter,
    Globe,
    Filter,
    Eye,
    EyeOff,
    Trophy,
    Settings2,
} from 'lucide-react';
import { Typography } from '@/components/ui';
import { FilterSelect, FilterButton } from '@/components/ui/form-elements';
import { VisibilitySettings } from '../page';

interface ControlsProps {
    visibility: VisibilitySettings;
    onToggleVisibility: (key: keyof VisibilitySettings) => void;
}

export default function VocabExplorerControls({
    visibility,
    onToggleVisibility,
}: ControlsProps) {
    const { settings, setSettings, metadata } = useVocabulary();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isUserScope = settings.scope === 'user';
    const isExplorerScope = settings.scope === 'explorer';
    const isAllScope = settings.scope === 'all';

    const updateExplorer = (updates: Partial<typeof settings.explorer>) => {
        setSettings({
            ...settings,
            scope: 'explorer',
            explorer: { ...settings.explorer, ...updates },
        });
    };

    // Helper to cycle through the 3 modes or set them via UI
    const cycleMode = () => {
        const modes: ExplorerMode[] = ['section', 'chapter', 'cumulative'];
        const currentIndex = modes.indexOf(settings.explorer.mode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        updateExplorer({ mode: nextMode });
    };

    const bookOptions = metadata
        ? Object.keys(metadata.books)
              .map(Number)
              .sort((a, b) => a - b)
        : [];
    const lessonOptions = metadata?.books[settings.explorer.b]
        ? Object.keys(metadata.books[settings.explorer.b].lessons)
              .map(Number)
              .sort((a, b) => a - b)
        : [];
    const sectionOptions = metadata?.books[settings.explorer.b]?.lessons[
        settings.explorer.l
    ]?.sections || [1, 2];

    return (
        <div
            className={cn(
                'flex flex-col bg-surface dark:bg-surface-dark border border-border-main/50 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 ease-in-out',
                isCollapsed ? 'gap-0 p-3' : 'gap-6 p-6',
            )}
        >
            {/* Header / Scope Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center justify-between lg:justify-start gap-4">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-ink/5 rounded-xl transition-colors text-ink/40"
                    >
                        <Settings2
                            size={18}
                            className={cn(
                                'transition-transform duration-300',
                                !isCollapsed && 'rotate-180 text-red-500',
                            )}
                        />
                    </button>

                    <div className="flex gap-1 bg-ink/[0.03] p-1 rounded-xl">
                        <FilterButton
                            active={isUserScope}
                            onClick={() =>
                                setSettings({ ...settings, scope: 'user' })
                            }
                        >
                            <Trophy size={14} /> {!isCollapsed && 'My Progress'}
                        </FilterButton>
                        <FilterButton
                            active={isExplorerScope}
                            onClick={() =>
                                setSettings({ ...settings, scope: 'explorer' })
                            }
                        >
                            <Filter size={14} /> {!isCollapsed && 'Explorer'}
                        </FilterButton>
                        <FilterButton
                            active={isAllScope}
                            onClick={() =>
                                setSettings({ ...settings, scope: 'all' })
                            }
                        >
                            <Globe size={14} /> {!isCollapsed && 'All'}
                        </FilterButton>
                    </div>
                </div>

                {/* Visibility Toggles */}
                <div className="flex items-center gap-2 bg-ink/[0.02] p-1 rounded-xl border border-border-main/20">
                    {(
                        [
                            'character',
                            'pinyin',
                            'meaning',
                            'simplified',
                        ] as const
                    ).map((key) => (
                        <button
                            key={key}
                            onClick={() => onToggleVisibility(key)}
                            className={cn(
                                'px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border transition-all flex items-center gap-1.5',
                                visibility[key]
                                    ? 'bg-ink/5 border-border-main/50 text-ink/40'
                                    : 'bg-red-500 text-white border-red-600 shadow-sm',
                            )}
                        >
                            {visibility[key] ? (
                                <Eye size={10} />
                            ) : (
                                <EyeOff size={10} />
                            )}
                            <span
                                className={cn(
                                    isCollapsed &&
                                        key !== 'character' &&
                                        'hidden sm:inline',
                                )}
                            >
                                {key === 'character' ? 'Trad' : key}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div
                    className={cn(
                        'relative transition-all duration-300',
                        isCollapsed
                            ? 'w-full lg:max-w-[180px]'
                            : 'w-full lg:max-w-xs',
                    )}
                >
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30"
                        size={14}
                    />
                    <input
                        type="text"
                        placeholder="Search vocabulary..."
                        className="w-full bg-ink/5 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-red-500/30"
                        value={settings.searchQuery}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                searchQuery: e.target.value,
                            })
                        }
                    />
                </div>
            </div>

            {/* Expanded Filters */}
            {!isCollapsed && isExplorerScope && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-border-main/20 animate-in fade-in slide-in-from-top-2">
                    <FilterSelect
                        label="Book"
                        icon={BookOpen}
                        value={settings.explorer.b}
                        onChange={(e: any) =>
                            updateExplorer({
                                b: Number(e.target.value),
                                l: 1,
                                p: 1,
                            })
                        }
                    >
                        {bookOptions.map((b) => (
                            <option key={b} value={b}>
                                Book {b}
                            </option>
                        ))}
                    </FilterSelect>

                    <FilterSelect
                        label="Lesson"
                        icon={Layers}
                        value={settings.explorer.l}
                        onChange={(e: any) =>
                            updateExplorer({ l: Number(e.target.value), p: 1 })
                        }
                    >
                        {lessonOptions.map((l) => (
                            <option key={l} value={l}>
                                Lesson {l}
                            </option>
                        ))}
                    </FilterSelect>

                    <FilterSelect
                        label="Part"
                        icon={ListFilter}
                        value={settings.explorer.p}
                        onChange={(e: any) =>
                            updateExplorer({ p: Number(e.target.value) })
                        }
                    >
                        {sectionOptions.map((s) => (
                            <option key={s} value={s}>
                                Part {s}
                            </option>
                        ))}
                    </FilterSelect>

                    <div className="flex flex-col justify-end gap-1.5">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40 px-1">
                            Filter Mode
                        </span>
                        <button
                            onClick={cycleMode}
                            className={cn(
                                'h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2',
                                settings.explorer.mode === 'cumulative'
                                    ? 'bg-red-500/10 border-red-500/50 text-red-600'
                                    : 'bg-zinc-100 border-zinc-200 text-zinc-500',
                            )}
                        >
                            {/* Visual Feedback for the 3 modes */}
                            {settings.explorer.mode === 'section' &&
                                'Strict: This Part'}
                            {settings.explorer.mode === 'chapter' &&
                                'Full: This Lesson'}
                            {settings.explorer.mode === 'cumulative' &&
                                'Cumulative Mode'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
