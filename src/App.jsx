import React from 'react';
import { VocabularyProvider } from './contexts/VocabularyContext';
import VocabularyTable from './components/VocabularyTable';

function App() {
    return (
        <VocabularyProvider>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Chinese Vocabulary Study App
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Study and review vocabulary from your parsed cards
                        </p>
                    </header>

                    <main>
                        <VocabularyTable />
                    </main>
                </div>
            </div>
        </VocabularyProvider>
    );
}

export default App;
