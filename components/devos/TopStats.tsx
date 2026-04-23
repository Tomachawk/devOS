"use client";

function StatBox({ title, value }: { title: string; value: string }) {
    return (
        <div className="relative flex flex-col justify-between border border-blue-500/20 bg-[#07111b]/80 p-4 min-h-[90px] overflow-hidden">

            {/* narożniki */}
            <div className="absolute left-0 top-0 h-3 w-3 border-l border-t border-blue-500/50" />
            <div className="absolute right-0 top-0 h-3 w-3 border-r border-t border-blue-500/50" />
            <div className="absolute left-0 bottom-0 h-3 w-3 border-l border-b border-blue-500/50" />
            <div className="absolute right-0 bottom-0 h-3 w-3 border-r border-b border-blue-500/50" />

            <div className="text-[10px] tracking-[0.35em] text-blue-400/60">
                {title}
            </div>

            <div className="text-2xl text-blue-400">{value}</div>

            {/* fake wykres */}
            <div className="absolute bottom-2 left-2 right-2 h-6">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-pulse" />
            </div>
        </div>
    );
}

export default function TopStats() {
    return (
        <div className="grid grid-cols-4 gap-4">
            <StatBox title="TIME" value="12:45:27" />
            <StatBox title="CPU" value="58%" />
            <StatBox title="RAM" value="68%" />
            <StatBox title="NETWORK" value="154 Mbps" />
        </div>
    );
}