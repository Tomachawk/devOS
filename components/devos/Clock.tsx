"use client";

import { useEffect, useState } from "react";

export default function Clock() {
    const [time, setTime] = useState("");

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

    return (
        <div className="text-sm text-cyan-300 tracking-wider">
            {time}
        </div>
    );
}