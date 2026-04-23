"use client";

import { useEffect, useMemo, useState } from "react";
import NetworkActivity from "./NetworkActivity";
import HudPanel from "./HudPanel";
import WorldMapPanel from "./WorldMapPanel";

function TopNav() {
    return (
        <header className="relative z-10 flex items-center justify-between border-b border-cyan-500/20 px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="text-4xl font-semibold tracking-[0.15em] text-cyan-300">
                    DEVOS
                </div>
                <div className="text-sm text-cyan-400/60">v2.4.1</div>
            </div>

            <nav className="flex items-center gap-10 text-sm uppercase tracking-[0.2em] text-cyan-200/80">
                <button>Dashboard</button>
                <button>Projects</button>
                <button>Tasks</button>
                <button>AI Assistant</button>
                <button>Tools</button>
                <button>Settings</button>
            </nav>

            <div className="flex items-center gap-4 text-cyan-300/80">
                <span>◌</span>
                <span>⌕</span>
                <span>☰</span>
            </div>
        </header>
    );
}

function StatCard({
    title,
    value,
    suffix,
}: {
    title: string;
    value: string;
    suffix?: string;
}) {
    return (
        <HudPanel title={title} className="min-h-[110px]">
            <div className="flex items-end gap-2">
                <span className="text-5xl font-semibold leading-none text-cyan-300">
                    {value}
                </span>
                {suffix && (
                    <span className="pb-1 text-lg text-cyan-400/70">{suffix}</span>
                )}
            </div>
        </HudPanel>
    );
}

type SystemStatsResponse = {
    cpu: {
        usage_percent: number;
        physical_cores: number;
        logical_cores: number;
    };
    ram: {
        used_gb: number;
        total_gb: number;
        available_gb: number;
        usage_percent: number;
    };
    storage: {
        used_gb: number;
        total_gb: number;
        free_gb: number;
        usage_percent: number;
    };
    network?: {
        current?: {
            download: number;
            upload: number;
        };
    };
};

type MonitorItem = {
    label: string;
    value: number;
};

export default function DevOSLayout() {
    const [maxDownload, setMaxDownload] = useState(0);
    const [time, setTime] = useState("");

    const [cpuUsage, setCpuUsage] = useState(0);
    const [ramUsage, setRamUsage] = useState(0);
    const [storageUsage, setStorageUsage] = useState(0);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formatted = now.toLocaleTimeString("pl-PL", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            setTime(formatted);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let mounted = true;

        async function fetchSystemStats() {
            try {
                const res = await fetch("http://127.0.0.1:8000/system/stats", {
                    cache: "no-store",
                });

                if (!res.ok) return;

                const data: SystemStatsResponse = await res.json();

                if (!mounted) return;

                setCpuUsage(Math.round(data.cpu.usage_percent));
                setRamUsage(Math.round(data.ram.usage_percent));
                setStorageUsage(Math.round(data.storage.usage_percent));
            } catch (error) {
                console.error("Błąd pobierania system stats:", error);
            }
        }

        fetchSystemStats();
        const interval = setInterval(fetchSystemStats, 3000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    const monitorItems: MonitorItem[] = useMemo(
        () => [
            { label: "CPU", value: cpuUsage },
            { label: "RAM", value: ramUsage },
            { label: "Storage", value: storageUsage },
            { label: "Network", value: Math.min(Math.round(maxDownload), 100) },
        ],
        [cpuUsage, ramUsage, storageUsage, maxDownload]
    );

    return (
        <main className="min-h-screen bg-[#020817] text-white">
            <div className="relative min-h-screen overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.12),transparent_35%),linear-gradient(to_bottom,rgba(3,7,18,0.98),rgba(2,6,23,1))]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
                </div>

                <TopNav />

                <div className="relative z-10 mx-auto grid max-w-[1920px] gap-5 p-6 xl:grid-cols-[1.15fr_2.35fr_1.15fr]">
                    {/* left column */}
                    <div className="flex flex-col gap-5">
                        <HudPanel title="System Status" className="h-[260px]">
                            <div className="flex h-full items-center justify-center">
                                <div className="flex h-[170px] w-[170px] items-center justify-center rounded-full border border-cyan-400/40 text-center">
                                    <div>
                                        <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">
                                            CPU
                                        </div>
                                        <div className="mt-3 text-6xl font-semibold text-cyan-300">
                                            {cpuUsage}%
                                        </div>
                                        <div className="mt-2 text-sm uppercase tracking-[0.25em] text-cyan-400/60">
                                            Core Load
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </HudPanel>

                        <HudPanel title="System Monitor" className="min-h-[260px]">
                            <div className="space-y-5">
                                {monitorItems.map((item) => (
                                    <div key={item.label}>
                                        <div className="mb-2 flex items-center justify-between text-sm text-cyan-200/80">
                                            <span className="w-24">{item.label}</span>
                                            <span>{item.value}%</span>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-cyan-950/80">
                                            <div
                                                className="h-full rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                                                style={{ width: `${item.value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </HudPanel>

                        <HudPanel title="Activity Log" className="min-h-[252px]">
                            <div className="space-y-2 text-[13px] leading-6 text-cyan-200/80">
                                <div>14:23:15 — System initialized</div>
                                <div>14:23:18 — Database connected</div>
                                <div>14:23:21 — User login: admin</div>
                                <div>14:23:33 — Files synced</div>
                                <div>14:23:41 — Backup completed</div>
                                <div>14:23:48 — Security check passed</div>
                            </div>
                        </HudPanel>
                    </div>

                    {/* center */}
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-4 gap-4">
                            <StatCard title="Time" value={time} />

                            <HudPanel title="" className="min-h-[110px] overflow-hidden">
                                <div className="relative h-full w-full bg-[#07111e] -top-[10px]">
                                    <img
                                        src="/rog.gif"
                                        alt="ROG visual"
                                        className="h-full w-full object-cover opacity-90 scale-130"
                                    />
                                </div>
                            </HudPanel>

                            <StatCard title="RAM Usage" value={`${ramUsage}%`} />

                            <StatCard
                                title="NETWORK"
                                value={maxDownload.toFixed(2)}
                                suffix="Mbps"
                            />
                        </div>

                        <WorldMapPanel />

                        <div className="grid grid-cols-2 gap-5 items-stretch">
                            <HudPanel title="Recent Projects" className="h-[217px]">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-cyan-200/80">
                                        <span>DevOS Platform</span>
                                        <span>85%</span>
                                    </div>
                                    <div className="flex justify-between text-cyan-200/80">
                                        <span>AI Dashboard</span>
                                        <span>62%</span>
                                    </div>
                                    <div className="flex justify-between text-cyan-200/80">
                                        <span>Mobile App</span>
                                        <span>40%</span>
                                    </div>
                                    <div className="flex justify-between text-cyan-200/80">
                                        <span>Landing Page</span>
                                        <span>90%</span>
                                    </div>
                                </div>
                            </HudPanel>

                            <HudPanel title="" className="max-h-[217px] overflow-hidden">
                                <div className="relative h-full w-full bg-[#07111e] -top-[30px]">
                                    <img
                                        src="/visualization.gif"
                                        alt="Visualization"
                                        className="h-full w-full object-cover opacity-90 scale-110"
                                    />
                                </div>
                            </HudPanel>
                        </div>
                    </div>

                    {/* right */}
                    <div className="flex flex-col gap-5">
                        <NetworkActivity onMaxDownload={setMaxDownload} />

                        <HudPanel title="Global Overwiev" className="h-[220px]">
                            <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#07111e] -top-[40px]">
                                <div className="absolute -top-40px inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_60%)]" />

                                <img
                                    src="/globus.gif"
                                    alt="Rotating globe"
                                    className="relative z-10 h-[195px] w-[190px] object-contain opacity-85 mix-blend-screen scale-105"
                                />

                                <div className="pointer-events-none absolute inset-0 rounded-sm border border-cyan-500/10" />
                            </div>
                        </HudPanel>

                        <HudPanel title="System Info" className="h-[210px]">
                            <div className="space-y-3 text-sm text-cyan-200/80">
                                <div className="flex justify-between">
                                    <span>OS Version</span>
                                    <span>DevOS 2.4.1</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Build</span>
                                    <span>2026.04.21</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Node</span>
                                    <span>v18.17.0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Status</span>
                                    <span>Stable</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>User</span>
                                    <span>admin</span>
                                </div>
                            </div>
                        </HudPanel>

                        <HudPanel title="Quick Access" className="h-[160px]">
                            <div className="grid grid-cols-2 gap-3">
                                {["New Project", "AI Assistant", "File Manager", "Terminal"].map(
                                    (item) => (
                                        <button
                                            key={item}
                                            className="border border-cyan-500/30 bg-cyan-950/30 px-3 py-3 text-sm text-cyan-200/90 transition hover:bg-cyan-900/40"
                                        >
                                            {item}
                                        </button>
                                    )
                                )}
                            </div>
                        </HudPanel>
                    </div>
                </div>
            </div>
        </main>
    );
}