import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui';

export const StudyContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={cn(
            'flex flex-col items-center gap-10 w-full max-w-4xl mx-auto py-8 px-4',
            className,
        )}
    >
        {children}
    </div>
);

export const ControlGroup = ({ children }: { children: React.ReactNode }) => (
    <div className="flex gap-4 mb-2">{children}</div>
);
