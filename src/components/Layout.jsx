import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <main className="bg-white rounded-xl shadow-lg p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
