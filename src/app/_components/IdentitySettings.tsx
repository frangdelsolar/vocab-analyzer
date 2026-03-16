// @/components/UserStatusCard.tsx
'use client';

import { useState } from 'react';
import { Typography, Button } from '@/components/ui';
import { User, Check } from 'lucide-react';

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
        <div className="mt-6 pt-4 border-t border-border-main/10">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User size={14} className="opacity-40" />
                        <Typography
                            variant="small"
                            className="text-[10px] font-black uppercase tracking-widest opacity-40"
                        >
                            Cloud Sync Name
                        </Typography>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => {
                                setVal(userId);
                                setIsEditing(true);
                            }}
                            className="text-[10px] font-bold uppercase tracking-tight text-red-500/60 hover:text-red-500 transition-colors"
                        >
                            Change Name
                        </button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex-1">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <input
                                    autoFocus
                                    value={val}
                                    onChange={(e) => setVal(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && handleSave()
                                    }
                                    className="bg-ink/[0.03] dark:bg-white/[0.03] border border-border-main/20 rounded-lg px-3 py-1.5 text-sm font-bold outline-none w-full max-w-[240px]"
                                />
                                <Button
                                    onClick={handleSave}
                                    className="h-8 px-3 bg-ink text-white dark:bg-white dark:text-ink text-[10px] font-black uppercase"
                                >
                                    <Check size={14} className="mr-1" /> Save
                                </Button>
                            </div>
                        ) : (
                            <Typography
                                variant="h4"
                                className="font-mono tracking-tight"
                            >
                                {userId}
                            </Typography>
                        )}
                    </div>

                    <div className="max-w-[320px]">
                        <p className="text-[11px] leading-relaxed opacity-40 italic">
                            Your progress is tied to this name. Use a unique
                            phrase to ensure others don&apos;t accidentally
                            overwrite your data, as there are no passwords.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatusSelect = ({ icon: Icon, label, value, options, onChange }: any) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 opacity-40 px-1">
            <Icon size={10} />
            <span className="text-[9px] font-black uppercase tracking-widest">
                {label}
            </span>
        </div>
        <select
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="bg-ink/[0.03] dark:bg-white/[0.03] border border-border-main/20 rounded-lg px-3 py-2 text-xs font-bold outline-none"
        >
            {options.map((opt: number) => (
                <option key={opt} value={opt}>
                    {label} {opt}
                </option>
            ))}
        </select>
    </div>
);

export { IdentitySettings, StatusSelect };

export default IdentitySettings;
