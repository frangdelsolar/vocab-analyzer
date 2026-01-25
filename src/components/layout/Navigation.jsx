// src/components/layout/Navigation.jsx
import React, { useState } from 'react';
import { useTheme } from '../../hoooks/useTheme';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-china-gold transition-all hover:ring-2 hover:ring-china-gold/50"
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? (
                /* Moon Icon */
                <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            ) : (
                /* Sun Icon */
                <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
        </button>
    );
};

const SidebarLink = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            active
                ? 'bg-china-red text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-china-red/10 hover:text-china-red'
        }`}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

const Navigation = ({ activeTab, setActiveTab }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { id: 'dialogues', label: 'Dialogue Study', icon: '📖' },
        { id: 'insights', label: 'Insights & Config', icon: '📊' },
        { id: 'table', label: 'Reference Table', icon: '🔍' },
    ];

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-china-red"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white flex gap-2">
                            <span className="text-china-red font-chinese">
                                當代中文課程
                            </span>
                            <span className="hidden sm:inline">Navigator</span>
                        </h1>
                    </div>

                    {/* Theme Toggle Added Here */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-china-gold animate-pulse" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Live
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-china-red font-chinese font-bold text-xl">
                            Study Menu
                        </span>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <SidebarLink
                                key={item.id}
                                active={activeTab === item.id}
                                label={item.label}
                                icon={item.icon}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsSidebarOpen(false);
                                }}
                            />
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Navigation;
