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
            <PageHeader overline="Welcome Back, 學員" title="當代中文課程" />
            <StatsSummary />
            <CourseLibrary />
            <VocabularyPreview />
        </Shell>
    );
}
