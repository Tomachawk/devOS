"use client";

import { useEffect, useState } from "react";
import HudPanel from "./HudPanel";

type AIResponse = {
    status: string;
    insight?: string;
    message?: string;
};

export default function AICorePanel() {
    const [insight, setInsight] = useState("Waiting for AI analysis...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAIInsight() {
            try {
                setLoading(true);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/ai/system-insight`
                );

                const data: AIResponse = await res.json();

                if (data.status === "success" && data.insight) {
                    setInsight(data.insight);
                } else {
                    setInsight(data.message ?? "AI analysis unavailable.");
                }
            } catch (error) {
                console.error("AI Core error:", error);
                setInsight("AI Core connection error.");
            } finally {
                setLoading(false);
            }
        }

        fetchAIInsight();

        const interval = setInterval(fetchAIInsight, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <HudPanel title="AI Core" className="min-h-[252px]">
            <div className="space-y-3 font-mono text-[12px] leading-5 text-cyan-200/80">
                <div className="text-cyan-300">
                    <span className="text-cyan-500/70">{">"}</span>{" "}
                    AI CORE ONLINE
                </div>

                <div>
                    <span className="text-cyan-500/70">{">"}</span>{" "}
                    {loading ? "Analyzing system telemetry..." : "OpenAI analysis complete."}
                    <span className="ml-1 animate-pulse text-cyan-300">█</span>
                </div>

                <div className="max-h-[140px] overflow-y-auto whitespace-pre-line border-t border-cyan-500/10 pt-3 pr-2 text-cyan-200/70 custom-scroll">
                    {insight}
                </div>
            </div>
        </HudPanel>
    );
}