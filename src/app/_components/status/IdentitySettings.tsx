// @/components/UserStatusCard.tsx
'use client';

import { useState } from 'react';
import { User, Check, Edit3, Cloud, Info, ChevronDown } from 'lucide-react';

const IdentitySettings = ({
    userId,
    onIdChange,
}: {
    userId: string;
    onIdChange: (id: string) => void;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [val, setVal] = useState(userId);

    const handleSave = () => {
        if (val.trim()) {
            onIdChange(val.trim());
            setIsEditing(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                    {/* Security Warning Tooltip-style info */}
                    <div className="group relative flex items-center">
                        <Info
                            size={10}
                            className="text-red-500/40 cursor-help"
                        />
                        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-ink text-paper text-[10px] leading-relaxed rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50 pointer-events-none italic">
                            No passwords here. Use a unique name to prevent
                            others from overwriting your cloud vault.
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 opacity-30">
                        <Cloud size={10} />
                        <span className="text-[9px] font-black uppercase tracking-[0.15em]">
                            Sync Identity
                        </span>
                    </div>
                </div>

                {isEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                        <input
                            autoFocus
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            className="bg-ink/5 border-none rounded-md px-2 py-0.5 text-xs font-bold outline-none w-32 text-right focus:ring-1 ring-red-500/20"
                        />
                        <button
                            onClick={handleSave}
                            className="text-green-600 hover:scale-110 transition-transform"
                        >
                            <Check size={14} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setVal(userId);
                            setIsEditing(true);
                        }}
                        className="group flex items-center gap-2 mt-0.5"
                    >
                        <span className="text-sm font-black tracking-tight group-hover:text-red-500 transition-colors">
                            {userId}
                        </span>
                        <Edit3
                            size={12}
                            className="opacity-0 group-hover:opacity-30 transition-opacity"
                        />
                    </button>
                )}
            </div>

            <div className="w-10 h-10 rounded-2xl bg-ink/[0.03] flex items-center justify-center text-ink/20 shrink-0">
                <User size={18} />
            </div>
        </div>
    );
};

const StatusSelect = ({ icon: Icon, label, value, options, onChange }: any) => (
    <div className="relative group">
        <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-border-main/50 hover:border-border-main rounded-2xl px-4 py-2 transition-all cursor-pointer">
            <div className="p-1.5 rounded-lg bg-ink/[0.03] text-ink/40">
                <Icon size={12} />
            </div>
            <div className="flex flex-col pr-4">
                <span className="text-[8px] font-black uppercase tracking-widest opacity-30 leading-none mb-0.5">
                    {label}
                </span>
                <span className="text-xs font-black leading-none">{value}</span>
            </div>
            <ChevronDown
                size={12}
                className="opacity-20 group-hover:opacity-50 transition-opacity absolute right-3"
            />

            <select
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
                {options.map((opt: number) => (
                    <option key={opt} value={opt}>
                        {label} {opt}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

export { IdentitySettings, StatusSelect };

export default IdentitySettings;
