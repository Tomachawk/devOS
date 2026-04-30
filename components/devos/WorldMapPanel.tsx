import Image from "next/image";
import HudPanel from "./HudPanel";
import PulseMarker from "./PulseMarker";

export default function WorldMapPanel() {
    return (
        <HudPanel title="Global Overview" className="h-[420px]">
            <div className="relative h-[350px] overflow-hidden rounded-sm border border-cyan-500/10 bg-[#07111e]">
                <Image
                    src="/world-map.png"
                    alt="World map"
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 33vw"
                    className="object-cover opacity-40 contrast-125 mix-blend-screen"
                />

                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:28px_28px]" />

                {/* markery */}
                <PulseMarker className="left-[22%] top-[44%] scale-100" delay="0s" />
                <PulseMarker className="left-[56%] top-[33%] scale-125" delay="0.6s" />
                <PulseMarker className="left-[74%] top-[61%] scale-90" delay="1.2s" />

                {/* etykiety */}
                <div className="absolute left-[26%] top-[49%] border border-cyan-400/40 bg-[#081421]/80 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.12)] backdrop-blur-[2px]">
                    New York
                </div>

                <div className="absolute left-[59%] top-[28%] border border-cyan-400/40 bg-[#081421]/80 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.12)] backdrop-blur-[2px]">
                    London
                </div>

                <div className="absolute left-[66%] top-[66%] border border-cyan-400/40 bg-[#081421]/80 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.12)] backdrop-blur-[2px]">
                    Singapore
                </div>
            </div>
        </HudPanel>
    );
}