import React from 'react';
import { VocabularyProvider } from './contexts/VocabularyContext';
import VocabularyTable from './components/VocabularyTable';
import Layout from './components/Layout';

function App() {
    return (
        <VocabularyProvider>
            <Layout>
                <VocabularyTable />
            </Layout>
        </VocabularyProvider>
    );
}

export default App;
