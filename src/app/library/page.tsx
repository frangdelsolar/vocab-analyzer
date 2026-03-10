import { Shell } from '@/components/layout/Shell';
import { Typography, Card, CardContent } from '@/components/ui';
import { CourseLibrary } from '../_components/CourseLibrary';
import { Search, Filter, BookCheck } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

export default function LibraryPage() {
    return (
        <Shell>
            <PageHeader
                title="Library"
                description="Access all 6 volumes of the Contemporary Chinese series."
                rightElement={
                    <Card className="bg-ink/5 border-none">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2 bg-green-500/20 text-green-600 rounded-lg">
                                <BookCheck size={20} />
                            </div>
                            <div>
                                <Typography
                                    variant="small"
                                    className="font-bold block leading-none"
                                >
                                    12 / 90 Lessons
                                </Typography>
                                <span className="text-[10px] uppercase tracking-tighter opacity-50">
                                    Total Progress • 13%
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                }
            />

            {/* 2. Search & Filters Bar */}
            <div className="flex gap-3 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search for grammar (e.g. '把' sentence)..."
                        className="w-full bg-surface border border-border-main rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ink/10 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-border-main rounded-xl text-sm font-medium hover:bg-ink/5 transition-colors">
                    <Filter size={14} />
                    Filters
                </button>
            </div>

            {/* 3. The Library Grid (Reusing our compact component) */}
            <div className="space-y-12">
                <section>
                    <Typography
                        variant="small"
                        className="uppercase tracking-widest opacity-40 mb-4 block font-bold"
                    >
                        Beginner Series (Vol 1-3)
                    </Typography>
                    <CourseLibrary />
                </section>

                {/* Optional: Add a 'Resources' section for stuff that isn't the core books */}
                <section>
                    <Typography
                        variant="small"
                        className="uppercase tracking-widest opacity-40 mb-4 block font-bold"
                    >
                        Reference Material
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4 hover:bg-ink/5 cursor-pointer transition-colors border-dashed">
                            <Typography variant="small" className="font-bold">
                                Grammar Index
                            </Typography>
                            <Typography
                                variant="p"
                                className="text-xs opacity-50 mt-1"
                            >
                                Complete mapping of grammar points across all
                                books.
                            </Typography>
                        </Card>
                        <Card className="p-4 hover:bg-ink/5 cursor-pointer transition-colors border-dashed">
                            <Typography variant="small" className="font-bold">
                                Audio Repository
                            </Typography>
                            <Typography
                                variant="p"
                                className="text-xs opacity-50 mt-1"
                            >
                                Direct access to raw MP3 files by lesson number.
                            </Typography>
                        </Card>
                    </div>
                </section>
            </div>
        </Shell>
    );
}
