import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Chinese Vocabulary Study
                    </h1>
                    <p className="text-gray-600">
                        Browse and study vocabulary from your parsed cards
                    </p>
                </header>

                <main className="bg-white rounded-xl shadow-lg p-6">
                    {children}
                </main>

                <footer className="mt-8 text-center text-sm text-gray-500">
                    <p>Vocabulary data loaded from parsed-cards.json</p>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
