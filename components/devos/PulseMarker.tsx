type PulseMarkerProps = {
    className?: string;
    delay?: string;
};

export default function PulseMarker({
    className = "",
    delay = "0s",
}: PulseMarkerProps) {
    return (
        <div
            className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 group ${className}`}
        >
            <span
                style={{ animationDelay: delay }}
                className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/20 animate-[hud-pulse_2.6s_linear_infinite]"
            />

            <span
                className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/25 blur-[3px]"
            />

            <span
                className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200 bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.95)]"
            />
        </div>
    );
}