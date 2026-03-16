'use client';

import { ReactNode } from 'react';
import { FSRSProvider } from '@/context/FSRSContext';

export default function StudyLayout({ children }: { children: ReactNode }) {
    return <FSRSProvider>{children}</FSRSProvider>;
}
