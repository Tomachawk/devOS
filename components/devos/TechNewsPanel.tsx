"use client";

import { useEffect, useState } from "react";
import HudPanel from "./HudPanel";

type NewsItem = {
    title: string;
    source: string;
    link: string;
};

type NewsResponse = {
    status: string;
    articles: NewsItem[];
};

export default function TechNewsPanel() {
    const [articles, setArticles] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function fetchNews() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
                    cache: "no-store",
                });

                if (!res.ok) return;

                const data: NewsResponse = await res.json();

                if (mounted) {
                    setArticles(data.articles.slice(0, 3));
                    setLoading(false);
                }
            } catch (error) {
                console.error("Błąd pobierania newsów:", error);
                setLoading(false);
            }
        }

        fetchNews();
        const interval = setInterval(fetchNews, 300000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    return (
        <HudPanel title="Tech News" className="h-[210px]">
            <div className="space-y-2 text-[12px] leading-5">
                {loading && <div className="text-cyan-300/60">Loading news...</div>}

                {!loading &&
                    articles.map((article, index) => (
                        <a
                            key={`${article.title}-${index}`}
                            href={article.link}
                            target="_blank"
                            rel="noreferrer"
                            className="block border-b border-cyan-500/10 pb-1 last:border-b-0 hover:text-cyan-300"
                        >
                            <div className="line-clamp-1 text-cyan-200/90">
                                {article.title}
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/60">
                                {article.source}
                            </div>
                        </a>
                    ))}
            </div>
        </HudPanel>
    );
}