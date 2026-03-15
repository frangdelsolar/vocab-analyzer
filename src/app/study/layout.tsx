'use client';

import { ReactNode } from 'react';
import { StorageProvider } from '@/context/StorageContext';
import { FSRSProvider } from '@/context/FSRSContext';

export default function StudyLayout({ children }: { children: ReactNode }) {
    return (
        <StorageProvider>
            <FSRSProvider>{children}</FSRSProvider>
        </StorageProvider>
    );
}
