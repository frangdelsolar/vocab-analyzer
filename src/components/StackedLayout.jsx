// components/StackedLayout.jsx
import React from 'react';

const StackedLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Simple Header */}
            <header className="bg-white border-b border-gray-200 mb-8">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
                    <h1 className="text-xl font-bold text-blue-600">
                        DangDai Study Tool
                    </h1>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 space-y-8">
                {/* Section 1: Dialogues Selection & Preview */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 ml-1">
                        Dialogue Study
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {children[0]} {/* DialoguesList */}
                    </div>
                </section>

                {/* Section 2: Configuration & Stats */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 ml-1">
                        Vocabulary Filtering & Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            {children[1]} {/* VocabularySettings */}
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            {children[2]} {/* VocabularyInsights */}
                        </div>
                    </div>
                </section>

                {/* Section 3: The Wide Table */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 ml-1">
                        Reference Table
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {children[3]} {/* VocabularyTable */}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StackedLayout;
