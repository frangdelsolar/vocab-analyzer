'use client';

import { useState, useEffect } from 'react';
import { Typography } from '@/components/ui';
import { useStorage } from '@/context/StorageContext';
import { StudySection } from './StudyCard';
import {
    Database,
    TrendingUp,
    Copy,
    Check,
    FlaskConical,
    RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudyDashboard() {
    const { studyData, generateSyncCode, importSyncCode, updateCardProgress } =
        useStorage();

    // UI States
    const [copied, setCopied] = useState(false);
    const [inputCode, setInputCode] = useState('');
    const [hasMounted, setHasMounted] = useState(false);

    // Fix Hydration Mismatch: Only calculate sync string on client
    useEffect(() => {
        setHasMounted(true);
    }, []);

    const learnedCount = Object.keys(studyData).length;

    const handleCopy = () => {
        if (!hasMounted) return;
        const code = generateSyncCode();
        if (!code) return;

        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Dev Utility: Toggle some test data
    const toggleTestData = () => {
        if (learnedCount > 0) {
            // Simple way to clear for testing if you haven't implemented a clear function
            localStorage.removeItem('dangdai_progress');
            window.location.reload();
        } else {
            updateCardProgress('BZs?G`&HI4', {
                stability: 5.2,
                difficulty: 3.1,
                reps: 1,
                last_review: Date.now(),
            });
        }
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
                                {hasMounted ? learnedCount : '--'}
                            </Typography>
                            <Typography
                                variant="small"
                                className="opacity-40 uppercase text-[9px] font-black tracking-widest"
                            >
                                Mastered Cards
                            </Typography>
                        </div>
                        <button
                            onClick={toggleTestData}
                            className="p-2 opacity-10 hover:opacity-100 hover:text-red-500 transition-all"
                            title="Toggle Test Data"
                        >
                            {learnedCount > 0 ? (
                                <RotateCcw size={14} />
                            ) : (
                                <FlaskConical size={14} />
                            )}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase opacity-30 tracking-[0.2em]">
                            <span>Daily Retention</span>
                            <span>{hasMounted ? '85%' : '--'}</span>
                        </div>
                        <div className="h-1.5 w-full bg-ink/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-ink/40 rounded-full transition-all duration-1000"
                                style={{ width: hasMounted ? '85%' : '0%' }}
                            />
                        </div>
                    </div>
                </div>
            </StudySection>

            {/* RIGHT: DATA RECOVERY */}
            <StudySection title="Save State" icon={Database}>
                <div className="space-y-4">
                    <div className="relative group">
                        <button
                            onClick={handleCopy}
                            disabled={!hasMounted}
                            className={cn(
                                'w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all border border-dashed',
                                'bg-ink/[0.02] border-border-main hover:bg-ink/[0.05] hover:border-ink/20',
                                !hasMounted && 'opacity-50 cursor-not-allowed',
                            )}
                        >
                            <div className="flex flex-col items-start overflow-hidden text-left">
                                <Typography
                                    variant="small"
                                    className="text-[10px] font-black uppercase opacity-30 mb-1"
                                >
                                    {copied
                                        ? 'Copied to clipboard'
                                        : 'Click to copy sync key'}
                                </Typography>
                                <span className="text-[10px] font-mono opacity-40 truncate w-48 block">
                                    {hasMounted
                                        ? generateSyncCode() || 'EMPTY_DATABASE'
                                        : 'INITIALIZING...'}
                                </span>
                            </div>

                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-border-main shadow-sm">
                                {copied ? (
                                    <Check
                                        size={14}
                                        className="text-green-600 animate-in zoom-in"
                                    />
                                ) : (
                                    <Copy
                                        size={14}
                                        className="opacity-40 group-hover:opacity-100 transition-opacity"
                                    />
                                )}
                            </div>
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <input
                            placeholder="Paste recovery code..."
                            value={inputCode}
                            className="flex-1 bg-transparent border border-border-main rounded-xl px-4 py-3 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all"
                            onChange={(e) => setInputCode(e.target.value)}
                        />
                        <button
                            onClick={() => {
                                const success = importSyncCode(inputCode);
                                if (success) setInputCode('');
                            }}
                            className="px-6 py-3 bg-ink text-paper rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-ink/10"
                        >
                            Load
                        </button>
                    </div>
                </div>
            </StudySection>
        </div>
    );
}
