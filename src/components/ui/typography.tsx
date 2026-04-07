// @/components/ui/typography.tsx
import { ReactNode } from 'react';

interface Props {
    variant:
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'p'
        | 'small'
        | 'hanzi'
        | 'pinyin'
        | 'simplified';
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
        // Hanzi (Traditional/Main) using Noto Sans TC stack via font-sans
        hanzi: `font-sans text-3xl leading-relaxed tracking-wide ${colorClasses}`,
        // Simplified/Calligraphic using the Kaiti stack
        simplified: `font-kaiti text-3xl leading-relaxed tracking-wide ${colorClasses}`,
        /** * Pinyin Specific Styling:
         * 1. font-pinyin: Uses the stack defined in your CSS (Inter/Lexend)
         * 2. tracking-wider: Gives tone marks breathing room
         * 3. leading-loose: Prevents accents from hitting the line above
         * 4. lowercase: Standard for Pinyin unless it's a proper noun
         */
        pinyin: `font-pinyin text-sm lowercase opacity-60 tracking-wider leading-loose antialiased ${colorClasses}`,
    };

    // Mapping variants to HTML elements
    const Component =
        variant === 'small' ||
        variant === 'hanzi' ||
        variant === 'simplified' ||
        variant === 'pinyin'
            ? 'span'
            : variant;

    return (
        <Component className={`${styles[variant]} ${className}`}>
            {children}
        </Component>
    );
};
