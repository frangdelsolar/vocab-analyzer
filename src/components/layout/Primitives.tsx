'use client';

import React from 'react';

// Extend the standard Div attributes so we can pass 'style', 'onClick', etc.
interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    gap?: number;
}

export const Box = ({ children, className = '', ...props }: LayoutProps) => (
    <div className={className} {...props}>
        {children}
    </div>
);

export const Stack = ({
    children,
    gap = 4,
    className = '',
    ...props
}: LayoutProps) => (
    <div className={`flex flex-col gap-${gap} ${className}`} {...props}>
        {children}
    </div>
);

/**
 * Row: Use 'flex-wrap' so buttons don't crush each other on tiny screens
 */
export const Row = ({
    children,
    gap = 4,
    className = '',
    ...props
}: LayoutProps) => (
    <div
        className={`flex flex-row flex-wrap items-center gap-${gap} ${className}`}
        {...props}
    >
        {children}
    </div>
);

/**
 * Container: Add a bit more padding for mobile side-gutters
 */
export const Container = ({
    children,
    className = '',
    ...props
}: LayoutProps) => (
    <div
        className={`max-w-xl mx-auto w-full px-6 md:px-4 ${className}`}
        {...props}
    >
        {children}
    </div>
);

// Note: For Grid, we keep the custom 'cols' prop
export const Grid = ({
    children,
    cols = 1,
    gap = 4,
    className = '',
    ...props
}: LayoutProps & { cols?: number }) => (
    <div
        className={`grid grid-cols-${cols} gap-${gap} ${className}`}
        {...props}
    >
        {children}
    </div>
);
