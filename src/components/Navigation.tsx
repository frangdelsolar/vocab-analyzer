'use client';

import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import {
    Menu,
    X,
    PenTool,
    Home,
    ChevronLeft,
    ChevronRight,
    Library,
    Notebook,
    BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Library', icon: Library, href: '/library' },
    { name: 'Vocabulary', icon: BookOpen, href: '/vocabulary' },
    { name: 'Study', icon: Notebook, href: '/study' },
    { name: 'Writer', icon: PenTool, href: '/writer' },
];

export default function Sidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    useEffect(() => setIsMobileOpen(false), [pathname]);

    return (
        <>
            {/* 📱 MOBILE TOP BAR - Fixed so it doesn't scroll away */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between p-4 border-b border-border-main bg-surface z-[100]">
                {/* Wrapped Mobile Logo */}
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Logo hideText={true} />
                </Link>
                <span className="font-bold text-ink tracking-tight uppercase text-xs">
                    Dāngdài App
                </span>
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 text-ink"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            {/* 🖥️ DESKTOP SPACER - This "pushes" the main content to the right */}
            <div
                className={`hidden lg:block shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
            />

            {/* 🌫️ MOBILE BACKDROP */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* 🖥️ SIDEBAR */}
            <aside
                className={`
                    fixed top-0 left-0 h-full z-[120]
                    bg-surface border-r border-border-main
                    transition-all duration-300 ease-in-out
                    ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
                    ${!isMobileOpen && isCollapsed ? 'lg:w-20' : 'lg:w-64'}
                `}
            >
                <div className="flex flex-col h-full relative">
                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-24 bg-ink text-paper rounded-full p-1 border border-border-main shadow-md hover:scale-110 transition-transform z-[130]"
                    >
                        {isCollapsed ? (
                            <ChevronRight size={12} />
                        ) : (
                            <ChevronLeft size={12} />
                        )}
                    </button>

                    {/* Header */}
                    <div
                        className={`p-6 flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center' : 'justify-between'} mb-6`}
                    >
                        {/* Wrapped Sidebar Logo */}
                        <Link
                            href="/"
                            className="hover:opacity-80 transition-opacity"
                        >
                            <Logo hideText={isCollapsed && !isMobileOpen} />
                        </Link>

                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 px-3 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const showLabel = !isCollapsed || isMobileOpen;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-4 px-3 py-3 rounded-xl transition-all group
                                        ${isActive ? 'bg-ink text-paper shadow-sm' : 'text-ink/70 hover:bg-ink/5 hover:text-ink'}
                                        ${!showLabel ? 'justify-center' : ''}
                                    `}
                                >
                                    <item.icon
                                        className={`w-5 h-5 shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                    />
                                    {showLabel && (
                                        <span className="font-medium text-sm truncate">
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 mt-auto space-y-4">
                        <ThemeToggle compact={isCollapsed && !isMobileOpen} />
                        {(!isCollapsed || isMobileOpen) && (
                            <div className="pt-4 border-t border-border-main text-center">
                                <p className="text-[9px] text-ink/40 uppercase tracking-widest font-bold">
                                    當代中文 v2.0
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
