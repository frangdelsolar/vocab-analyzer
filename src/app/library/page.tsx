import { Shell } from '@/components/layout/Shell';
import { CourseLibrary } from '../_components/CourseLibrary';
import { Search, Filter } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { LibraryStats } from './_components/LibraryStats';
import { MediaSection } from './_components/MediaSection';

export default function LibraryPage() {
    return (
        <Shell>
            <PageHeader
                title="Library"
                description="Access all 6 volumes of the Contemporary Chinese series."
                rightElement={<LibraryStats />}
            />

            <div className="space-y-16">
                {/* Books Grid */}
                <CourseLibrary />

                {/* New Media Carrousels */}
                <MediaSection />
            </div>
        </Shell>
    );
}
