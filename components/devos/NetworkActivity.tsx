"use client";

import { useEffect, useMemo, useState } from "react";
import HudPanel from "./HudPanel";

type NetworkPoint = {
    download: number;
    upload: number;
};

type SystemStatsResponse = {
    network: {
        current: {
            download: number;
            upload: number;
        };
        history: NetworkPoint[];
        total_sent_mb: number;
        total_recv_mb: number;
    };
};

type NetworkActivityProps = {
    onMaxDownload: (val: number) => void;
    onCurrentDownload: (val: number) => void;
};

const CHART_WIDTH = 420;
const CHART_HEIGHT = 120;
const PADDING = 12;

function buildPath(
    values: number[],
    width: number,
    height: number,
    maxValue: number
) {
    if (values.length === 0) return "";

    const stepX = values.length > 1 ? width / (values.length - 1) : 0;

    return values
        .map((value, index) => {
            const x = index * stepX;
            const y =
                height -
                (maxValue === 0 ? 0 : (value / maxValue) * (height - PADDING * 2)) -
                PADDING;

            return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(" ");
}

export default function NetworkActivity({
    onMaxDownload,
    onCurrentDownload,
}: NetworkActivityProps) {
    const [data, setData] = useState({
        current: { download: 0, upload: 0 },
        history: [] as NetworkPoint[],
    });

    const [sessionMaxDownload, setSessionMaxDownload] = useState(0);

    useEffect(() => {
        let mounted = true;

        async function fetchStats() {
            try {
                const API = process.env.NEXT_PUBLIC_API_URL;

                if (!API) {
                    console.error("API URL not set");
                    return;
                }

                const res = await fetch(`${API}/system/stats`);

                if (!res.ok) return;

                const json: SystemStatsResponse = await res.json();
                const network = json.network;
                const currentDownload = network.current.download;

                if (!mounted) return;

                setData({
                    current: network.current,
                    history: network.history,
                });

                onCurrentDownload(currentDownload);

                setSessionMaxDownload((prev) => Math.max(prev, currentDownload));
            } catch (error) {
                console.error("Błąd pobierania danych sieci:", error);
            }
        }

        fetchStats();
        const interval = setInterval(fetchStats, 2000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [onCurrentDownload]);

    useEffect(() => {
        onMaxDownload(sessionMaxDownload);
    }, [sessionMaxDownload, onMaxDownload]);

    const chart = useMemo(() => {
        const downloads = data.history.map((item) => item.download);
        const uploads = data.history.map((item) => item.upload);

        const maxValue = Math.max(1, ...downloads, ...uploads);

        return {
            downloadPath: buildPath(downloads, CHART_WIDTH, CHART_HEIGHT, maxValue),
            uploadPath: buildPath(uploads, CHART_WIDTH, CHART_HEIGHT, maxValue),
        };
    }, [data.history]);

    return (
        <HudPanel title="Network Activity" className="h-[180px]">
            <div className="flex h-full flex-col justify-between">
                <div className="relative rounded-sm border border-cyan-500/10 bg-[#07111e] p-2">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:20px_20px]" />

                    <div className="absolute left-3 top-2 z-20 flex gap-6 text-[10px] uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2 text-cyan-300/80">
                            <span className="h-2 w-2 rounded-full bg-cyan-300" />
                            <span>Download {data.current.download} Mbps</span>
                        </div>

                        <div className="flex items-center gap-2 text-amber-300/80">
                            <span className="h-2 w-2 rounded-full bg-amber-300" />
                            <span>Upload {data.current.upload} Mbps</span>
                        </div>
                    </div>

                    <svg
                        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                        className="relative z-10 h-[90px] w-full"
                        preserveAspectRatio="none"
                    >
                        <path
                            d={chart.downloadPath}
                            fill="none"
                            stroke="#67e8f9"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                        <path
                            d={chart.uploadPath}
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </div>
        </HudPanel>
    );
}