"use client";

import { useEffect, useState } from "react";
import HudPanel from "./HudPanel";

const messages = [
    "System stats updated",
    "CPU data received",
    "RAM usage synchronized",
    "Storage scan completed",
    "Network packet stream active",
    "Market data refreshed",
    "Dashboard render cycle complete",
    "Backend connection stable",
];

function getTime() {
    return new Date().toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

export default function ActivityLog() {
    const [logs, setLogs] = useState<string[]>([
        `${getTime()} — DevOS initialized`,
        `${getTime()} — Backend connection established`,
        `${getTime()} — Realtime modules online`,
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomMessage =
                messages[Math.floor(Math.random() * messages.length)];

            setLogs((prev) => [
                `${getTime()} — ${randomMessage}`,
                ...prev.slice(0, 5),
            ]);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    return (
        <HudPanel title="Activity Log" className="min-h-[252px]">
            <div className="space-y-2 text-[13px] leading-6 text-cyan-200/80">
                {logs.map((log, index) => (
                    <div
                        key={`${log}-${index}`}
                        className={index === 0 ? "text-cyan-300" : "text-cyan-200/70"}
                    >
                        {log}
                    </div>
                ))}
            </div>
        </HudPanel>
    );
}