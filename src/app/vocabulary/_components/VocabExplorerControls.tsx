// @/components/vocabulary/_components/VocabExplorerControls.tsx
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
    Trophy,
    ChevronDown,
    Languages, // For Simplified Toggle
} from 'lucide-react';
import { FilterSelect, FilterButton } from '@/components/ui/form-elements';
import { Typography } from '@/components/ui';
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

    const updateExplorer = (updates: Partial<typeof settings.explorer>) => {
        setSettings({
            ...settings,
            scope: 'explorer',
            explorer: { ...settings.explorer, ...updates },
        });
    };

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
                'flex flex-col bg-surface dark:bg-surface-dark border border-border-main/50 rounded-[2rem] shadow-lg ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300',
                isCollapsed ? 'p-3 gap-0' : 'p-6 gap-6',
            )}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            'group flex items-center gap-2 px-3 py-2 rounded-xl transition-all',
                            isCollapsed
                                ? 'hover:bg-ink/5'
                                : 'bg-red-500/5 text-red-600',
                        )}
                    >
                        <ChevronDown
                            size={16}
                            className={cn(
                                'transition-transform duration-300',
                                !isCollapsed && 'rotate-180',
                            )}
                        />
                        <Typography
                            variant="small"
                            className="text-[10px] font-black uppercase tracking-widest"
                        >
                            {isCollapsed ? 'Filters' : 'Hide'}
                        </Typography>
                    </button>

                    <div className="flex gap-1 bg-ink/[0.03] p-1 rounded-xl">
                        <FilterButton
                            active={settings.scope === 'user'}
                            onClick={() =>
                                setSettings({ ...settings, scope: 'user' })
                            }
                        >
                            <Trophy size={14} />{' '}
                            <span className="hidden sm:inline">
                                My Progress
                            </span>
                        </FilterButton>
                        <FilterButton
                            active={settings.scope === 'explorer'}
                            onClick={() =>
                                setSettings({ ...settings, scope: 'explorer' })
                            }
                        >
                            <Filter size={14} />{' '}
                            <span className="hidden sm:inline">Explorer</span>
                        </FilterButton>
                        <FilterButton
                            active={settings.scope === 'all'}
                            onClick={() =>
                                setSettings({ ...settings, scope: 'all' })
                            }
                        >
                            <Globe size={14} />{' '}
                            <span className="hidden sm:inline">All</span>
                        </FilterButton>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Simplified Column Master Toggle */}
                    <button
                        onClick={() => onToggleVisibility('showSimplified')} // Master toggle Presence
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300',
                            visibility.showSimplified // Use Presence key
                                ? 'bg-red-500 border-red-600 text-white shadow-md shadow-red-500/20'
                                : 'bg-ink/[0.03] border-border-main/10 text-ink/40 hover:bg-ink/[0.06]',
                        )}
                    >
                        <Languages size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {visibility.showSimplified
                                ? 'Simplified ON'
                                : 'Simplified OFF'}
                        </span>
                    </button>

                    <div className="relative w-full lg:min-w-[240px]">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20"
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
            </div>

            {!isCollapsed && settings.scope === 'explorer' && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 border-t border-border-main/10 animate-in fade-in slide-in-from-top-4">
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
                    <div className="flex flex-col justify-end">
                        <button
                            onClick={cycleMode}
                            className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-ink/[0.03] border border-border-main/20 hover:bg-ink/[0.05] transition-all"
                        >
                            {settings.explorer.mode} Mode
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
