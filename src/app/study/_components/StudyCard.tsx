import { Typography } from '@/components/ui';

export const StudySection = ({ title, children, icon: Icon }: any) => (
    <section className="bg-surface border border-border-main rounded-[2rem] p-8 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-6 opacity-40">
            {Icon && <Icon size={18} />}
            <Typography
                variant="small"
                className="font-black uppercase tracking-widest text-[10px]"
            >
                {title}
            </Typography>
        </div>
        {children}
    </section>
);
