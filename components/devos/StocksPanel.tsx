"use client";

import { useEffect, useState } from "react";
import HudPanel from "./HudPanel";

type StockItem = {
    price: number;
    change: number;
    change_percent: number;
};

type StocksResponse = Record<string, StockItem>;

export default function StocksPanel() {
    const [stocks, setStocks] = useState<StocksResponse>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function fetchStocks() {
            try {
                const res = await fetch("http://127.0.0.1:8000/stocks", {
                    cache: "no-store",
                });

                if (!res.ok) return;

                const data: StocksResponse = await res.json();

                if (mounted) {
                    setStocks(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Błąd pobierania akcji:", error);
                setLoading(false);
            }
        }

        fetchStocks();
        const interval = setInterval(fetchStocks, 60000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    return (
        <HudPanel title="Tech Stocks" className="h-[217px]">
            <div className="space-y-1 text-[13px]">
                {loading && (
                    <div className="text-cyan-300/60">Loading market data...</div>
                )}

                {!loading &&
                    Object.entries(stocks).map(([symbol, data]) => {
                        const isUp = data.change_percent >= 0;

                        return (
                            <div
                                key={symbol}
                                className="grid grid-cols-[64px_1fr_80px] items-center gap-2 border-b border-cyan-500/10 pb-1 last:border-b-0"
                            >
                                <span className="font-semibold text-cyan-200">{symbol}</span>

                                <span className="text-cyan-300/80">
                                    ${data.price.toFixed(2)}
                                </span>

                                <span
                                    className={`text-right ${isUp ? "text-emerald-400" : "text-red-400"
                                        }`}
                                >
                                    {isUp ? "+" : ""}
                                    {data.change_percent.toFixed(2)}%
                                </span>
                            </div>
                        );
                    })}
            </div>
        </HudPanel>
    );
}