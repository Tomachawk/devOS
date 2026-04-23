type HudPanelProps = {
    title: string;
    children: React.ReactNode;
    className?: string;
};

export default function HudPanel({
    title,
    children,
    className = "",
}: HudPanelProps) {
    return (
        <section
            className={`relative border border-cyan-500/30 bg-[#06101d]/70 shadow-[0_0_20px_rgba(34,211,238,0.08)] ${className}`}
        >
            <div className="absolute left-0 top-0 h-4 w-4 border-l border-t border-cyan-400/60" />
            <div className="absolute right-0 top-0 h-4 w-4 border-r border-t border-cyan-400/60" />
            <div className="absolute left-0 bottom-0 h-4 w-4 border-l border-b border-cyan-400/60" />
            <div className="absolute right-0 bottom-0 h-4 w-4 border-r border-b border-cyan-400/60" />

            <div className="px-5 pt-4 pb-3">
                <div className="mb-4 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
                    {title}
                </div>
                {children}
            </div>
        </section>
    );
}