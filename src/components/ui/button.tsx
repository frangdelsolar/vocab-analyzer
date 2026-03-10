interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}: ButtonProps) => {
    // Base styles: Focus on layout and physical feedback (active:scale)
    const baseStyles =
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 select-none cursor-pointer';

    const variants = {
        // High contrast: Ink background with Paper text
        primary:
            'bg-ink text-paper hover:opacity-90 shadow-sm border border-transparent',

        // Minimalist: Transparent background with Ink border/text
        outline: 'border border-ink/10 text-ink hover:bg-ink/5',

        // Ghost: Text only, subtle background on hover
        ghost: 'text-ink/70 hover:text-ink hover:bg-ink/5',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        />
    );
};
