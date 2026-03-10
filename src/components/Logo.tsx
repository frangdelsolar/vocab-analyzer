// components/Logo.tsx
export const Logo = ({ hideText = false }: { hideText?: boolean }) => (
    <div className="flex items-center gap-3 select-none group cursor-pointer shrink-0">
        <div className="relative shrink-0">
            <div className="bg-ink text-paper w-10 h-10 flex items-center justify-center rounded-xl font-kaiti text-xl transition-all duration-500 group-hover:rotate-6 shadow-sm">
                <div className="flex flex-col leading-none translate-y-[1px]">
                    <span>當</span>
                    <span className="mt-[-4px]">代</span>
                </div>
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface" />
        </div>

        {!hideText && (
            <div className="flex flex-col justify-center overflow-hidden transition-all duration-300">
                <h1 className="text-lg font-black tracking-tighter leading-none text-ink flex items-baseline gap-1">
                    Dāngdài
                    <span className="text-red-500 text-[10px] font-bold">
                        PRO
                    </span>
                </h1>
                <span className="text-[9px] uppercase tracking-widest font-bold text-ink/40">
                    Contemporary
                </span>
            </div>
        )}
    </div>
);
