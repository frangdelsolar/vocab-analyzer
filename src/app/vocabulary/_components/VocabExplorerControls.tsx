'use client';

import { useState } from 'react';
import { useVocabulary } from '@/context/VocabularyContext';
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
    ChevronDown,
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
    const { settings, setSettings } = useVocabulary();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isExplorerScope = settings.scope === 'explorer';
    const isAllScope = settings.scope === 'all';

    const updateExplorer = (updates: Partial<typeof settings.explorer>) => {
        setSettings({
            scope: 'explorer',
            explorer: { ...settings.explorer, ...updates },
        });
    };

    return (
        <div
            className={cn(
                'flex flex-col bg-surface dark:bg-surface-dark border border-border-main/50 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 ease-in-out',
                isCollapsed ? 'gap-0 p-3' : 'gap-6 p-6',
            )}
        >
            {/* Header Row: Always visible */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center justify-between lg:justify-start gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 hover:bg-ink/5 dark:hover:bg-white/5 rounded-xl transition-colors text-ink/40"
                        >
                            <Settings2
                                size={18}
                                className={cn(
                                    'transition-transform duration-300',
                                    isCollapsed
                                        ? ''
                                        : 'rotate-180 text-red-500',
                                )}
                            />
                        </button>
                        {!isCollapsed && (
                            <div className="hidden sm:block">
                                <Typography
                                    variant="small"
                                    className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40"
                                >
                                    Explorer Mode
                                </Typography>
                            </div>
                        )}
                    </div>

                    {/* Compact Mode Switches */}
                    <div className="flex gap-1">
                        <FilterButton
                            active={isAllScope}
                            onClick={() => setSettings({ scope: 'all' })}
                            className={isCollapsed ? 'h-8 px-2 text-[9px]' : ''}
                        >
                            <Globe size={isCollapsed ? 12 : 14} />{' '}
                            {isCollapsed ? '' : 'All'}
                        </FilterButton>
                        <FilterButton
                            active={isExplorerScope}
                            onClick={() => setSettings({ scope: 'explorer' })}
                            className={isCollapsed ? 'h-8 px-2 text-[9px]' : ''}
                        >
                            <Filter size={isCollapsed ? 12 : 14} />{' '}
                            {isCollapsed ? '' : 'Filtered'}
                        </FilterButton>
                    </div>
                </div>

                {/* Study Focus Toggles - Essential for sticky use */}
                <div className="flex items-center gap-3 bg-ink/[0.02] dark:bg-white/[0.02] p-1.5 rounded-xl border border-border-main/20">
                    <div className="hidden md:block px-2 border-r border-border-main/20">
                        <Typography
                            variant="small"
                            className="text-[9px] font-black uppercase tracking-tight opacity-30"
                        >
                            Focus
                        </Typography>
                    </div>
                    <div className="flex gap-1">
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
                                        ? 'bg-ink/5 dark:bg-white/5 border-border-main/50 text-ink/40 dark:text-ink-dark/40'
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
                </div>

                {/* Search - Shrinks when collapsed */}
                <div
                    className={cn(
                        'relative transition-all duration-300',
                        isCollapsed
                            ? 'w-full lg:max-w-[200px]'
                            : 'w-full lg:max-w-xs',
                    )}
                >
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30"
                        size={14}
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-ink/5 dark:bg-white/5 border-none rounded-xl pl-9 pr-4 py-2 text-xs outline-none text-ink dark:text-ink-dark focus:ring-1 focus:ring-red-500/30"
                        value={settings.searchQuery}
                        onChange={(e) =>
                            setSettings({ searchQuery: e.target.value })
                        }
                    />
                </div>
            </div>

            {/* Collapsible Section: Filters */}
            {!isCollapsed && isExplorerScope && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-border-main/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <FilterSelect
                        label="Book"
                        icon={BookOpen}
                        value={settings.explorer.b}
                        onChange={(e: any) =>
                            updateExplorer({ b: Number(e.target.value) })
                        }
                    >
                        {[1, 2, 3, 4, 5, 6].map((b) => (
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
                            updateExplorer({ l: Number(e.target.value) })
                        }
                    >
                        {Array.from({ length: 15 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                Lesson {i + 1}
                            </option>
                        ))}
                    </FilterSelect>
                    <FilterSelect
                        label="Part"
                        icon={ListFilter}
                        value={settings.explorer.p}
                        onChange={(e: any) =>
                            updateExplorer({ p: e.target.value })
                        }
                    >
                        {['I', 'II'].map((p) => (
                            <option key={p} value={p}>
                                Part {p}
                            </option>
                        ))}
                    </FilterSelect>
                    <div className="flex flex-col justify-end">
                        <button
                            onClick={() =>
                                updateExplorer({
                                    cumulative: !settings.explorer.cumulative,
                                })
                            }
                            className={cn(
                                'h-9 px-3 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all border',
                                settings.explorer.cumulative
                                    ? 'bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400'
                                    : 'bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-white/5 dark:border-white/10 dark:text-zinc-400',
                            )}
                        >
                            {settings.explorer.cumulative
                                ? 'Cumulative'
                                : 'Strict Match'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
