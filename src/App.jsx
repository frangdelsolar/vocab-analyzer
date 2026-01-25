// src/App.jsx
import React, { useState } from 'react';
import { PageContainer } from './components/shared/Container';

import Navigation from './components/layout/Navigation';

import { VocabularyProvider } from './contexts/VocabularyContext';
import { DialoguesProvider } from './contexts/DialoguesContext';
import VocabularyTable from './components/VocabularyTable';
import VocabularySettings from './components/VocabularySettings';
import VocabularyInsights from './components/VocabularyInsights';
import DialoguesList from './components/DialoguesList';

function App() {
    const [activeTab, setActiveTab] = useState('dialogues');

    return (
        <VocabularyProvider>
            <DialoguesProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
                    <Navigation
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    <main>
                        {activeTab === 'dialogues' && (
                            <PageContainer title="Dialogue Study" icon="📖">
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                                    <DialoguesList />
                                </div>
                            </PageContainer>
                        )}

                        {activeTab === 'insights' && (
                            <PageContainer title="Insights & Config" icon="📊">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <VocabularySettings />
                                    <VocabularyInsights />
                                </div>
                            </PageContainer>
                        )}

                        {activeTab === 'table' && (
                            <PageContainer
                                title="Vocabulary Reference"
                                icon="🔍"
                                actions={
                                    <button className="btn-china">
                                        Export CSV
                                    </button>
                                }
                            >
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                                    <VocabularyTable />
                                </div>
                            </PageContainer>
                        )}
                    </main>
                </div>
            </DialoguesProvider>
        </VocabularyProvider>
    );
}

export default App;
