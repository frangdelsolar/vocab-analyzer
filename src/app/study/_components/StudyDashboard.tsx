'use client';

import { useState } from 'react';
import { Typography } from '@/components/ui';
import { useStorage } from '@/context/StorageContext';
import { StudySection } from './StudyCard';
import { Database, TrendingUp, Copy, Check, Download } from 'lucide-react';

export default function StudyDashboard() {
    const { studyData, generateSyncCode, importSyncCode } = useStorage();
    const [copied, setCopied] = useState(false);
    const [inputCode, setInputCode] = useState('');

    const learnedCount = Object.keys(studyData).length;

    const handleCopy = () => {
        navigator.clipboard.writeText(generateSyncCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4">
            {/* Mock Insights */}
            <StudySection title="Insights" icon={TrendingUp}>
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <Typography variant="h2" className="leading-none">
                            {learnedCount}
                        </Typography>
                        <Typography variant="small" className="opacity-40">
                            Words in system
                        </Typography>
                    </div>
                    <div className="h-12 w-px bg-border-main mx-4" />
                    <div className="flex-1">
                        <Typography variant="h2" className="leading-none">
                            0
                        </Typography>
                        <Typography variant="small" className="opacity-40">
                            Due for review
                        </Typography>
                    </div>
                </div>
            </StudySection>

            {/* Data Recovery (Old School Password) */}
            <StudySection title="Data Recovery" icon={Database}>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="flex-1 flex items-center justify-between px-4 py-3 bg-ink/5 hover:bg-ink/10 rounded-xl transition-colors text-left"
                        >
                            <span className="text-[10px] font-mono opacity-50 truncate mr-4">
                                {generateSyncCode()}
                            </span>
                            {copied ? (
                                <Check size={14} className="text-green-500" />
                            ) : (
                                <Copy size={14} />
                            )}
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <input
                            placeholder="Paste code to restore..."
                            className="flex-1 bg-transparent border border-border-main rounded-xl px-4 py-2 text-xs"
                            onChange={(e) => setInputCode(e.target.value)}
                        />
                        <button
                            onClick={() => importSyncCode(inputCode)}
                            className="px-4 py-2 bg-ink text-paper rounded-xl text-[10px] font-black uppercase tracking-widest"
                        >
                            Load
                        </button>
                    </div>
                </div>
            </StudySection>
        </div>
    );
}
