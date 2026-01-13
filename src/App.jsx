import React from 'react';
import { VocabularyProvider } from './contexts/VocabularyContext';
import VocabularyTable from './components/VocabularyTable';
import VocabularySettings from './components/VocabularySettings';
import Layout from './components/Layout';

function App() {
    return (
        <VocabularyProvider>
            <Layout>
                <VocabularySettings />
                <VocabularyTable />
            </Layout>
        </VocabularyProvider>
    );
}

export default App;
