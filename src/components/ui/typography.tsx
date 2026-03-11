import { ReactNode } from 'react';

interface Props {
    // Add h3 and h4 here
    variant: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'hanzi' | 'pinyin';
    children: ReactNode;
    className?: string;
}

export const Typography = ({ variant, children, className = '' }: Props) => {
    const colorClasses = 'text-ink transition-colors duration-500';

    const styles = {
        h1: `text-4xl font-extrabold tracking-tight lg:text-5xl ${colorClasses}`,
        h2: `text-3xl font-semibold tracking-tight border-b border-border-main pb-2 mb-4 ${colorClasses}`,
        h3: `text-2xl font-bold tracking-tight ${colorClasses}`,
        h4: `text-lg font-bold tracking-tight ${colorClasses}`,
        p: `leading-7 [&:not(:first-child)]:mt-4 ${colorClasses}`,
        small: `text-sm font-medium leading-none opacity-70 ${colorClasses}`,
        hanzi: `font-sans text-3xl leading-relaxed tracking-wide ${colorClasses}`,
        pinyin: `text-sm font-sans italic opacity-60 tracking-tight ${colorClasses}`,
    };

    const Component =
        variant === 'small' || variant === 'hanzi' || variant === 'pinyin'
            ? 'span'
            : variant;

    return (
        <Component className={`${styles[variant]} ${className}`}>
            {children}
        </Component>
    );
};
