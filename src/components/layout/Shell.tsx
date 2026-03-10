// @/components/layout/Shell.tsx
import { ReactNode } from 'react';

export function Shell({ children }: { children: ReactNode }) {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-all duration-300">
            {children}
        </div>
    );
}
