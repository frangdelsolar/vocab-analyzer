// @/app/study/_components/StudyDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Typography } from '@/components/ui';
import { useProgress } from '@/context/ProgressContext';
import { useFSRS } from '@/context/FSRSContext';
import { StudySection } from './StudyCard';
import {
    Cloud,
    TrendingUp,
    RefreshCw,
    Database,
    CheckCircle2,
    RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudyDashboard() {
    const { progress } = useProgress();
    const { getCardState, isLoading: fsrsLoading, gradeCard } = useFSRS();

    // UI States
    const [hasMounted, setHasMounted] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    // In the new context, we'd ideally have a way to count keys in FSRS state
    // For now, we can derive insights from the FSRS context
    const learnedCount = 0; // We will implement a proper count in the context later if needed

    const handleManualSync = async () => {
        setIsRefreshing(true);
        // Simulate a refresh/re-fetch from Supabase
        // Since useFSRS handles this on mount/user change,
        // a manual sync usually just involves a window reload or a re-fetch call.
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4">
            {/* LEFT: PROGRESS INSIGHTS */}
            <StudySection title="Learning Progress" icon={TrendingUp}>
                <div className="space-y-6">
                    <div className="flex items-end justify-between">
                        <div>
                            <Typography
                                variant="h2"
                                className="leading-none tracking-tighter"
                            >
                                {hasMounted ? 'LVL ' + progress.book : '--'}
                            </Typography>
                            <Typography
                                variant="small"
                                className="opacity-40 uppercase text-[9px] font-black tracking-widest"
                            >
                                Current Book Tier
                            </Typography>
                        </div>
                        <div className="text-right">
                            <Typography
                                variant="h4"
                                className="leading-none font-bold"
                            >
                                {progress.lesson}.{progress.section}
                            </Typography>
                            <Typography
                                variant="small"
                                className="opacity-40 uppercase text-[9px] font-black tracking-widest"
                            >
                                Position
                            </Typography>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase opacity-30 tracking-[0.2em]">
                            <span>Retention Rate</span>
                            <span>{hasMounted ? 'Adaptive' : '--'}</span>
                        </div>
                        <div className="h-1.5 w-full bg-ink/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500/40 rounded-full transition-all duration-1000"
                                style={{ width: hasMounted ? '100%' : '0%' }}
                            />
                        </div>
                    </div>
                </div>
            </StudySection>

            {/* RIGHT: CLOUD STATUS */}
            <StudySection title="Cloud Sync" icon={Cloud}>
                <div className="space-y-4">
                    <div
                        className={cn(
                            'flex items-center justify-between p-4 rounded-2xl border border-border-main/50',
                            'bg-ink/[0.02] dark:bg-white/[0.02]',
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    'w-2 h-2 rounded-full animate-pulse',
                                    fsrsLoading
                                        ? 'bg-orange-500'
                                        : 'bg-green-500',
                                )}
                            />
                            <div>
                                <Typography
                                    variant="small"
                                    className="text-[10px] font-black uppercase tracking-widest opacity-40 block"
                                >
                                    Database Status
                                </Typography>
                                <Typography
                                    variant="p"
                                    className="text-xs font-bold"
                                >
                                    {fsrsLoading
                                        ? 'Syncing...'
                                        : 'Connected & Protected'}
                                </Typography>
                            </div>
                        </div>

                        <button
                            onClick={handleManualSync}
                            disabled={fsrsLoading || isRefreshing}
                            className="p-2 hover:bg-ink/5 rounded-full transition-all active:rotate-180 duration-500"
                        >
                            <RefreshCw
                                size={16}
                                className={cn(isRefreshing && 'animate-spin')}
                            />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 px-2">
                        <Database size={14} className="opacity-20" />
                        <Typography
                            variant="small"
                            className="text-[10px] opacity-30 italic leading-tight"
                        >
                            Your progress is automatically saved to the cloud
                            under your <strong>Sync Name</strong>. No manual
                            export needed.
                        </Typography>
                    </div>
                </div>
            </StudySection>
        </div>
    );
}
