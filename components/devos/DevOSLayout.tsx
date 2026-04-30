"use client";

import { useEffect, useMemo, useState } from "react";
import NetworkActivity from "./NetworkActivity";
import HudPanel from "./HudPanel";
import WorldMapPanel from "./WorldMapPanel";
import StocksPanel from "./StocksPanel";
import ActivityLog from "./ActivityLog";
import CoreCircle from "./CoreCircle";
import TechNewsPanel from "./TechNewsPanel";
import AssetsLab from "./assets/AssetsLab";

type ActiveModule =
    | "dashboard"
    | "assets"
    | "projects"
    | "tasks"
    | "ai"
    | "tools"
    | "settings";

function TopNav({
    activeModule,
    setActiveModule,
}: {
    activeModule: ActiveModule;
    setActiveModule: (module: ActiveModule) => void;
}) {
    const navItems: { label: string; value: ActiveModule }[] = [
        { label: "Dashboard", value: "dashboard" },
        { label: "Projects", value: "projects" },
        { label: "Tasks", value: "tasks" },
        { label: "AI Assistant", value: "ai" },
        { label: "Tools", value: "tools" },
        { label: "Assets", value: "assets" },
        { label: "Settings", value: "settings" },
    ];

    return (
        <header className="relative z-10 flex items-center justify-between border-b border-cyan-500/20 px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="text-4xl font-semibold tracking-[0.15em] text-cyan-300">
                    DEVOS
                </div>
                <div className="text-sm text-cyan-400/60">v2.4.1</div>
            </div>

            <nav className="flex items-center gap-10 text-sm uppercase tracking-[0.2em] text-cyan-200/80">
                {navItems.map((item) => (
                    <button
                        key={item.value}
                        onClick={() => setActiveModule(item.value)}
                        className={
                            activeModule === item.value
                                ? "text-cyan-300"
                                : "transition hover:text-cyan-300"
                        }
                    >
                        {item.label}
                    </button>
                ))}
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
};

type MonitorItem = {
    label: string;
    value: number;
};

function formatNetwork(value: number) {
    if (value >= 1000) {
        return {
            value: (value / 1000).toFixed(2),
            suffix: "Mbps",
        };
    }

    return {
        value: value.toFixed(2),
        suffix: "Mbps",
    };
}

export default function DevOSLayout() {
    const [activeModule, setActiveModule] =
        useState<ActiveModule>("dashboard");

    const [maxDownload, setMaxDownload] = useState(0);
    const [currentDownload, setCurrentDownload] = useState(0);
    const [time, setTime] = useState("");

    const [cpuUsage, setCpuUsage] = useState(0);
    const [ramUsage, setRamUsage] = useState(0);
    const [storageUsage, setStorageUsage] = useState(0);

    const networkDisplay = formatNetwork(maxDownload);

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
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/system/stats`
                );

                if (!res.ok) return;

                const data: SystemStatsResponse = await res.json();

                if (!mounted) return;

                setCpuUsage(Math.round(data.cpu.usage_percent));
                setRamUsage(Math.round(data.ram.usage_percent));
                setStorageUsage(Math.round(data.storage.usage_percent));
            } catch (error) {
                console.warn("Błąd pobierania system stats:", error);
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
            {
                label: "Network",
                value:
                    maxDownload > 0
                        ? Math.min(Math.round((currentDownload / maxDownload) * 100), 100)
                        : 0,
            },
        ],
        [cpuUsage, ramUsage, storageUsage, currentDownload, maxDownload]
    );

    return (
        <main className="min-h-screen bg-[#020817] text-white">
            <div className="relative min-h-screen overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.12),transparent_35%),linear-gradient(to_bottom,rgba(3,7,18,0.98),rgba(2,6,23,1))]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
                </div>

                <TopNav
                    activeModule={activeModule}
                    setActiveModule={setActiveModule}
                />

                {activeModule === "dashboard" && (
                    <div className="relative z-10 mx-auto grid max-w-[1920px] gap-5 p-6 xl:grid-cols-[1.15fr_2.35fr_1.15fr]">
                        <div className="flex flex-col gap-5">
                            <HudPanel title="System Status" className="h-[260px]">
                                <CoreCircle value={cpuUsage} />
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

                            <ActivityLog />
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="grid grid-cols-4 gap-4">
                                <StatCard title="Time" value={time} />

                                <HudPanel title="" className="min-h-[110px] overflow-hidden">
                                    <div className="relative h-full w-full overflow-hidden bg-[#07111e] -top-[10px]">
                                        <img
                                            src="/rog.gif"
                                            alt="ROG visual"
                                            className="h-full w-full scale-[1.3] object-cover opacity-90"
                                        />
                                    </div>
                                </HudPanel>

                                <StatCard title="RAM Usage" value={`${ramUsage}%`} />

                                <StatCard
                                    title="NETWORK"
                                    value={networkDisplay.value}
                                    suffix={networkDisplay.suffix}
                                />
                            </div>

                            <WorldMapPanel />

                            <div className="grid grid-cols-2 gap-5 items-stretch">
                                <StocksPanel />

                                <HudPanel title="" className="h-[217px] overflow-hidden">
                                    <div className="relative h-full w-full overflow-hidden bg-[#07111e] -top-[30px]">
                                        <img
                                            src="/visualization.gif"
                                            alt="Visualization"
                                            className="h-full w-full scale-110 object-cover opacity-90"
                                        />
                                    </div>
                                </HudPanel>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            <NetworkActivity
                                onMaxDownload={setMaxDownload}
                                onCurrentDownload={setCurrentDownload}
                            />

                            <HudPanel title="Global Overview" className="h-[220px]">
                                <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#07111e] -top-[40px]">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_60%)]" />

                                    <img
                                        src="/globus.gif"
                                        alt="Rotating globe"
                                        className="relative z-10 h-[195px] w-[190px] scale-105 object-contain opacity-85 mix-blend-screen"
                                    />

                                    <div className="pointer-events-none absolute inset-0 rounded-sm border border-cyan-500/10" />
                                </div>
                            </HudPanel>

                            <TechNewsPanel />

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
                )}
                {activeModule === "assets" && (
                    <AssetsLab onClose={() => setActiveModule("dashboard")} />
                )}
            </div>
        </main>
    );
}