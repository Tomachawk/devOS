"use client";

import { useState, useEffect } from 'react';

export default function SystemCore() {
    const [cpuUsage, setCpuUsage] = useState(0);

    useEffect(() => {
        const fetchCPUUsage = async () => {
            try {
                const response = await fetch('http://localhost:8000/cpu');
                const data = await response.json();
                setCpuUsage(Math.round(data.cpu_percent));
            } catch (error) {
                console.error('Błąd podczas pobierania danych CPU:', error);
                // W przypadku błędu pokazujemy wartość domyślną
                setCpuUsage(40);
            }
        };

        // Pobierz dane od razu
        fetchCPUUsage();

        // Aktualizuj co sekundę
        const interval = setInterval(fetchCPUUsage, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex h-[420px] w-[420px] items-center justify-center">
            <div className="absolute h-[280px] w-[280px] rounded-full border border-dashed border-blue-500/20 animate-[spin_25s_linear_infinite]" />
            <div className="absolute h-[200px] w-[200px] rounded-full bg-blue-500/10 blur-2xl animate-pulse" />
            <div className="absolute h-[360px] w-[360px] rounded-full border border-blue-500/10" />
            <div className="absolute h-[300px] w-[300px] rounded-full border border-blue-500/20 animate-[spin_18s_linear_infinite]" />
            <div className="absolute h-[240px] w-[240px] rounded-full border border-blue-400/30 animate-[spin_10s_linear_infinite_reverse]" />

            <div className="absolute h-[180px] w-[180px] rounded-full bg-blue-500/10 blur-3xl" />

            <div className="absolute h-[160px] w-[160px] rounded-full border border-blue-400/40 bg-[#07111b]/80" />

            <div className="z-10 text-center">
                <div className="text-xs tracking-[0.4em] text-blue-400/60">CORE</div>
                <div className="mt-3 text-6xl font-semibold text-blue-400">{cpuUsage}%</div>
                <div className="mt-3 text-sm tracking-[0.25em] text-blue-400/60">
                    PERFORMANCE
                </div>
            </div>
        </div>
    );
}