"use client";

export default function MenuCircle() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none ">

            {/* glow */}
            <div className="absolute w-[260px] h-[260px] rounded-full bg-cyan-500/10 blur-3xl" />

            {/* core */}
            <div className="pointer-events-auto relative w-[160px] h-[160px] rounded-full border border-cyan-400/40 bg-cyan-900/20 backdrop-blur-xl flex items-center justify-center transition hover:scale-105 cursor-pointer">

                <div className="text-center">
                    <div className="text-xs tracking-[0.3em] text-cyan-400/60">
                        MENU
                    </div>

                    <div className="mt-2 text-2xl text-cyan-300 font-semibold">
                        DEVOS
                    </div>
                </div>

            </div>
        </div>
    );
}