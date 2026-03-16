// @/components/status/StudyHealthStats.tsx
import { Typography } from '@/components/ui';
import { BrainCircuit, Clock, Sparkles } from 'lucide-react';

interface HealthProps {
    due: number;
    newCards: number;
    total: number;
}

export function StudyHealthStats({ due, newCards, total }: HealthProps) {
    return (
        <div className="p-6 border-r border-border-main/50 flex flex-col justify-center gap-4">
            <div className="flex items-center gap-2 mb-1">
                <BrainCircuit size={14} className="opacity-40" />
                <Typography
                    variant="small"
                    className="text-[10px] font-black uppercase tracking-widest opacity-40"
                >
                    Deck Health
                </Typography>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-blue-500 mb-0.5">
                        <Clock size={12} />
                        <span className="text-xl font-black leading-none">
                            {due}
                        </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase opacity-40 tracking-tighter">
                        Due Now
                    </span>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-green-600 mb-0.5">
                        <Sparkles size={12} />
                        <span className="text-xl font-black leading-none">
                            {newCards}
                        </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase opacity-40 tracking-tighter">
                        New Items
                    </span>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-ink mb-0.5">
                        <span className="text-xl font-black leading-none opacity-20">
                            {total - (due + newCards)}
                        </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase opacity-40 tracking-tighter">
                        Scheduled
                    </span>
                </div>
            </div>
        </div>
    );
}
