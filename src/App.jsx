import React from 'react';
import { VocabularyProvider } from './contexts/VocabularyContext';
import { DialoguesProvider } from './contexts/DialoguesContext';
import VocabularyTable from './components/VocabularyTable';
import VocabularySettings from './components/VocabularySettings';
import VocabularyInsights from './components/VocabularyInsights';
import DialoguesList from './components/DialoguesList';
import StackedLayout from './components/StackedLayout';

function App() {
    return (
        <VocabularyProvider>
            <DialoguesProvider>
                <StackedLayout>
                    <DialoguesList />
                    <VocabularySettings />
                    <VocabularyInsights />
                    <VocabularyTable />
                </StackedLayout>
            </DialoguesProvider>
        </VocabularyProvider>
    );
}

export default App;
