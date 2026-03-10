// app/page.tsx
import { Shell } from '@/components/layout/Shell';
import { StatsSummary } from './_components/StatsSummary';
import { CourseLibrary } from './_components/CourseLibrary';
import { VocabularyPreview } from './_components/VocabularyPreview';
import { PageHeader } from '@/components/layout/PageHeader';
import { Typography } from '@/components/ui';

export default function HomePage() {
    return (
        <Shell>
            <PageHeader
                overline="Welcome Back, 學員"
                title="當代中文課程"
                rightElement={
                    <div className="text-right hidden md:block">
                        <Typography
                            variant="small"
                            className="block opacity-50"
                        >
                            Current Goal
                        </Typography>
                        <Typography
                            variant="p"
                            className="mt-0 font-bold text-red-500"
                        >
                            Lesson 7: Recycle
                        </Typography>
                    </div>
                }
            />
            <StatsSummary />
            <CourseLibrary />
            <VocabularyPreview />
        </Shell>
    );
}
