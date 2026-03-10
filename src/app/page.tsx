// app/page.tsx
import { Shell } from '@/components/layout/Shell';
import { UserStatusCard } from './_components/UserSatusCard';
import { CourseLibrary } from './_components/CourseLibrary';
import { VocabularyPreview } from './_components/VocabularyPreview';
import { PageHeader } from '@/components/layout/PageHeader';

export default function HomePage() {
    return (
        <Shell>
            <PageHeader overline="Welcome Back, 學員" title="當代中文課程" />
            <UserStatusCard />
            {/* <StatsSummary /> */}
            <CourseLibrary />
            <VocabularyPreview />
        </Shell>
    );
}
