// @/components/ui/form-elements.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export const StudyToggle = ({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={cn(
            'flex items-center justify-between gap-3 px-3 py-2 rounded-lg border transition-all w-full',
            active
                ? 'bg-red-500/5 border-red-500/30 text-red-600 dark:text-red-400'
                : 'bg-ink/5 border-transparent text-ink/40 dark:text-ink-dark/40',
        )}
    >
        <span className="text-[10px] font-black uppercase tracking-tight">
            {label}
        </span>
        {active ? (
            <Eye size={12} />
        ) : (
            <EyeOff size={12} className="opacity-50" />
        )}
    </button>
);

// Existing FilterButton and FilterSelect remain here...

export const FilterSelect = ({
    label,
    icon: Icon,
    className,
    ...props
}: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase opacity-40 flex items-center gap-1">
            {Icon && <Icon size={10} />} {label}
        </label>
        <select
            className={cn(
                'w-full bg-ink/5 dark:bg-white/5 border-none rounded-lg p-2 text-xs outline-none',
                'focus:ring-2 focus:ring-red-500/20 transition-shadow',
                className,
            )}
            {...props}
        />
    </div>
);

export const FilterButton = ({
    active,
    children,
    className,
    ...props
}: any) => (
    <button
        className={cn(
            'flex items-center gap-2 px-4 py-1.5 rounded-xl transition-all border text-xs font-bold uppercase',
            active
                ? 'bg-red-500 border-red-600 text-white shadow-sm'
                : 'bg-surface border-border-main/50 text-ink/60 dark:text-ink-dark/60 hover:text-red-500 dark:hover:text-red-400',
            className,
        )}
        {...props}
    >
        {children}
    </button>
);
