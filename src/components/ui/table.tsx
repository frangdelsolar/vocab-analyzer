import * as React from 'react';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';

const Table = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <div className="relative w-full border border-border-main/50 rounded-2xl bg-surface/50 dark:bg-surface-dark shadow-sm transition-colors duration-500 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto w-full">
            <table
                ref={ref}
                className={cn(
                    'w-full min-w-[600px] md:min-w-full text-left border-collapse',
                    className,
                )}
                {...props}
            />
        </div>
    </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead
        ref={ref}
        className={cn(
            'bg-ink/[0.03] dark:bg-white/[0.03] border-b border-border-main/50',
            className,
        )}
        {...props}
    />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn('divide-y divide-border-main/30', className)}
        {...props}
    />
));
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            'hover:bg-ink/[0.01] dark:hover:bg-white/[0.01] transition-colors group/row',
            className,
        )}
        {...props}
    />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
    <th
        ref={ref}
        className={cn('px-4 md:px-6 py-4 whitespace-nowrap', className)}
        {...props}
    >
        <Typography
            variant="small"
            className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-0"
        >
            {children}
        </Typography>
    </th>
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td ref={ref} className={cn('px-4 md:px-6 py-5', className)} {...props} />
));
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell };
