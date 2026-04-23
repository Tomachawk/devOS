"use client";

export default function HudBackground() {
    return (
        <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,255,0.12),transparent_35%),linear-gradient(to_bottom,rgba(0,140,255,0.08),transparent_30%),linear-gradient(to_right,rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:auto,auto,60px_60px,60px_60px]" />

            <div className="absolute inset-0 opacity-30">
                <div className="absolute left-0 top-[18%] h-px w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                <div className="absolute left-0 top-[42%] h-px w-full bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />
                <div className="absolute left-0 top-[76%] h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            </div>

            <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute right-[12%] top-[15%] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute bottom-[10%] left-[40%] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute left-0 top-0 h-full w-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 h-[2px] w-full bg-blue-500/40 animate-scan" />
            </div>
        </>
    );
}