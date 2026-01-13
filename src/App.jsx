import React from 'react';
import { VocabularyProvider } from './contexts/VocabularyContext';
import { DialoguesProvider } from './contexts/DialoguesContext';
import VocabularyTable from './components/VocabularyTable';
import VocabularySettings from './components/VocabularySettings';
import DialoguesList from './components/DialoguesList';
import Layout from './components/Layout';

function App() {
    return (
        <VocabularyProvider>
            <DialoguesProvider>
                <Layout>
                    <DialoguesList />
                </Layout>
                <Layout>
                    <VocabularySettings />
                    <VocabularyTable />
                </Layout>
            </DialoguesProvider>
        </VocabularyProvider>
    );
}

export default App;
