'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
    compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                className={`bg-ink/5 rounded-xl animate-pulse ${compact ? 'h-10 w-10' : 'h-12 w-full'}`}
            />
        );
    }

    const options = [
        { id: 'light', icon: Sun, label: 'Light' },
        { id: 'system', icon: Monitor, label: 'Auto' },
        { id: 'dark', icon: Moon, label: 'Dark' },
    ];

    // Compact Mode: A simple toggle button that cycles or a slim vertical stack
    if (compact) {
        return (
            <div className="flex flex-col items-center gap-2">
                <button
                    onClick={() =>
                        setTheme(theme === 'dark' ? 'light' : 'dark')
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-ink/5 border border-border-main text-ink hover:bg-ink/10 transition-all active:scale-90"
                    title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        );
    }

    // Full Mode: The 3-column grid
    return (
        <div className="grid grid-cols-3 gap-1 p-1 bg-ink/5 rounded-xl border border-border-main">
            {options.map((opt) => {
                const Icon = opt.icon;
                const isActive = theme === opt.id;
                return (
                    <button
                        key={opt.id}
                        onClick={() => setTheme(opt.id)}
                        className={`
                            flex flex-col items-center justify-center py-2 rounded-lg transition-all
                            ${
                                isActive
                                    ? 'bg-surface text-ink shadow-sm opacity-100 scale-100'
                                    : 'text-ink opacity-40 hover:opacity-100 scale-95 hover:bg-ink/5'
                            }
                        `}
                    >
                        <Icon size={14} className="mb-1" />
                        <span className="text-[10px] font-medium tracking-tight">
                            {opt.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
