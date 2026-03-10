import React from 'react';

export const Card = ({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={`
            bg-surface border border-border-main 
            rounded-2xl shadow-sm overflow-hidden 
            transition-colors duration-500 ${className}
        `}
    >
        {children}
    </div>
);

export const CardHeader = ({
    title,
    subtitle,
    className = '',
}: {
    title: string;
    subtitle?: string;
    className?: string;
}) => (
    <div className={`px-6 pt-6 pb-2 ${className}`}>
        {/* Using your custom Kaiti font for titles to match the scholarly theme */}
        <h3 className="text-xl font-kaiti font-bold tracking-tight text-ink">
            {title}
        </h3>
        {subtitle && (
            <p className="text-sm text-ink/50 mt-1 font-medium italic">
                {subtitle}
            </p>
        )}
    </div>
);

export const CardContent = ({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={`p-6 text-ink/90 leading-relaxed ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={`px-6 py-4 bg-ink/5 border-t border-border-main ${className}`}
    >
        {children}
    </div>
);
