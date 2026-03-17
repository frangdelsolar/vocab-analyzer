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
                {/* Due Now: Amber/Gold for urgency without the "error" vibe of red */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-amber-400 mb-0.5">
                        <Clock size={12} />
                        <span className="text-xl font-black leading-none">
                            {due}
                        </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase opacity-40 tracking-tighter">
                        Due Now
                    </span>
                </div>

                {/* New Items: Cyan/Teal for a modern "discovery" feel */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-cyan-400 mb-0.5">
                        <Sparkles size={12} />
                        <span className="text-xl font-black leading-none">
                            {newCards}
                        </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase opacity-40 tracking-tighter">
                        New Items
                    </span>
                </div>

                {/* Scheduled: Dimmed Silver/Slate to represent the background queue */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                        <span className="text-xl font-black leading-none opacity-60">
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
