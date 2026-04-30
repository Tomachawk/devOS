"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Script from "next/script";
import { pairAsset } from "./assetPairing";

const ModelViewer = "model-viewer" as any;

type LoadingStage =
    | "WAITING FOR ASSET"
    | "SCANNING FILE"
    | "MATCHING BLUEPRINT"
    | "PAIRING DATA"
    | "RENDER MODULE ONLINE";

export default function AssetsLab({ onClose }: { onClose: () => void }) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [blueprintError, setBlueprintError] = useState(false);
    const [loadingStage, setLoadingStage] =
        useState<LoadingStage>("WAITING FOR ASSET");
    const [isReady, setIsReady] = useState(false);

    const pair = selectedFile ? pairAsset(selectedFile) : null;

    useEffect(() => {
        setBlueprintError(false);
    }, [selectedFile]);

    function handleUpload(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) return;

        setSelectedFile(file.name);
        setBlueprintError(false);
        setIsReady(false);
        setLoadingStage("SCANNING FILE");

        setTimeout(() => setLoadingStage("MATCHING BLUEPRINT"), 700);
        setTimeout(() => setLoadingStage("PAIRING DATA"), 1400);
        setTimeout(() => setLoadingStage("RENDER MODULE ONLINE"), 2100);
        setTimeout(() => setIsReady(true), 2800);

        event.target.value = "";
    }

    return (
        <>
            <Script
                type="module"
                src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="relative w-[1200px] max-w-[95%] rounded-sm border border-cyan-500/20 bg-[#07111e]/90 p-6 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-2 text-cyan-400/70 hover:text-cyan-300"
                    >
                        ✕
                    </button>

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-[0.2em] text-cyan-300">
                                ASSETS LAB
                            </h2>
                            <p className="mt-2 text-sm text-cyan-400/60">
                                Auto-pairing model files with blueprint documentation
                            </p>
                        </div>

                        <div>
                            <input
                                type="file"
                                accept=".glb,.png"
                                onChange={handleUpload}
                                className="hidden"
                                id="asset-upload"
                            />

                            <label
                                htmlFor="asset-upload"
                                className="cursor-pointer border border-cyan-500/40 bg-cyan-950/40 px-5 py-3 text-sm uppercase tracking-[0.25em] text-cyan-200 hover:bg-cyan-900/50"
                            >
                                Upload Asset
                            </label>
                        </div>
                    </div>

                    {!isReady && (
                        <HudCornerFrame>
                            <div className="flex h-full flex-col items-center justify-center text-center">
                                <div className="mb-5 h-16 w-16 animate-spin rounded-full border border-cyan-400/20 border-t-cyan-300" />
                                <div className="text-lg uppercase tracking-[0.3em] text-cyan-300">
                                    {loadingStage}
                                </div>
                                <div className="mt-3 text-xs uppercase tracking-[0.25em] text-cyan-500/70">
                                    Processing: {selectedFile ?? "NO FILE"}
                                </div>
                            </div>
                        </HudCornerFrame>
                    )}

                    {isReady && (
                        <>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="min-h-[360px] bg-transparent p-4">
                                    <div className="mb-3 text-xs uppercase tracking-[0.25em] text-cyan-400/60">
                                        Model
                                    </div>

                                    <HudCornerFrame>
                                        {pair?.modelPath ? (
                                            <ModelViewer
                                                src={pair.modelPath}
                                                camera-controls
                                                auto-rotate
                                                exposure="0.85"
                                                shadow-intensity="0"
                                                tone-mapping="aces"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    background: "transparent",
                                                    filter:
                                                        "brightness(0.85) contrast(1.45) drop-shadow(0 0 18px rgba(34,211,238,0.75))",
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-cyan-400/50">
                                                [ MODEL NOT FOUND ]
                                            </div>
                                        )}
                                    </HudCornerFrame>
                                </div>

                                <div className="min-h-[360px] bg-transparent p-4">
                                    <div className="mb-3 text-xs uppercase tracking-[0.25em] text-cyan-400/60">
                                        Blueprint
                                    </div>

                                    <HudCornerFrame>
                                        {pair?.blueprintPath && !blueprintError ? (
                                            <img
                                                src={pair.blueprintPath}
                                                alt={`${pair.baseName} blueprint`}
                                                onError={() => setBlueprintError(true)}
                                                className="h-full w-full object-contain opacity-90"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-cyan-400/50">
                                                [ BLUEPRINT NOT FOUND ]
                                            </div>
                                        )}
                                    </HudCornerFrame>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-4 gap-4 text-sm text-cyan-200/80">
                                <div>Input: {selectedFile ?? "NO FILE"}</div>
                                <div>Base: {pair?.baseName ?? "—"}</div>
                                <div>Type: {pair?.inputType ?? "—"}</div>
                                <div>
                                    Status:{" "}
                                    {pair ? "PAIR CHECK COMPLETE" : "INVALID FILE"}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

function HudCornerFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative h-[300px] w-full">
            <div className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-cyan-400/60" />
            <div className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-cyan-400/60" />
            <div className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-cyan-400/60" />
            <div className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-cyan-400/60" />

            <div className="relative h-full w-full overflow-hidden p-4">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:22px_22px]" />

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_65%)]" />

                <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
                    <div className="absolute left-0 top-0 h-[2px] w-full bg-cyan-300/60 shadow-[0_0_16px_rgba(34,211,238,0.9)] animate-scan" />
                </div>

                <div className="relative z-10 h-full w-full">{children}</div>
            </div>
        </div>
    );
}