type CoreCircleProps = {
    value: number;
};

export default function CoreCircle({ value }: CoreCircleProps) {
    const safeValue = Math.min(Math.max(value, 0), 100);

    return (
        <div className="relative flex h-full items-center justify-center">
            <div className="relative flex h-[180px] w-[180px] items-center justify-center rounded-full">
                {/* outer glow */}
                <div className="absolute inset-0 rounded-full border border-cyan-400/20 shadow-[0_0_35px_rgba(34,211,238,0.25)]" />

                {/* rotating ring */}
                <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-cyan-300/70 border-r-cyan-300/20" />

                {/* reverse ring */}
                <div className="absolute inset-[10px] animate-[spin_8s_linear_infinite_reverse] rounded-full border border-transparent border-b-cyan-400/50 border-l-cyan-400/20" />

                {/* pulse */}
                <div className="absolute inset-[18px] animate-pulse rounded-full bg-cyan-500/5 shadow-[inset_0_0_35px_rgba(34,211,238,0.15)]" />

                {/* progress ring */}
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 180 180">
                    <circle
                        cx="90"
                        cy="90"
                        r="72"
                        fill="none"
                        stroke="rgba(34,211,238,0.12)"
                        strokeWidth="6"
                    />
                    <circle
                        cx="90"
                        cy="90"
                        r="72"
                        fill="none"
                        stroke="rgba(34,211,238,0.9)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={452}
                        strokeDashoffset={452 - (452 * safeValue) / 100}
                        className="transition-all duration-700"
                    />
                </svg>

                {/* center */}
                <div className="relative z-10 text-center">
                    <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">
                        CPU
                    </div>

                    <div className="mt-3 text-6xl font-semibold leading-none text-cyan-300">
                        {safeValue}%
                    </div>

                    <div className="mt-3 text-xs uppercase tracking-[0.3em] text-cyan-400/60">
                        Core Load
                    </div>
                </div>
            </div>
        </div>
    );
}