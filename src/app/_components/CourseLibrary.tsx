// components/home/CourseLibrary.tsx
import { Typography, Button } from '@/components/ui';
import { BookCard } from './BookCard';

export const CourseLibrary = () => (
    <div className="w-full mb-12">
        <div className="flex items-center justify-between mb-6">
            <Typography variant="h2" className="border-none pb-0">
                Course Library
            </Typography>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
                <BookCard key={n} number={n} />
            ))}
        </div>
    </div>
);
