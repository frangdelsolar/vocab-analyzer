import React from 'react';
import { VocabularyProvider } from './contexts/VocabularyContext';
import VocabularyTable from './components/VocabularyTable';

function App() {
    return (
        <VocabularyProvider>
            <VocabularyTable />
        </VocabularyProvider>
    );
}

export default App;
