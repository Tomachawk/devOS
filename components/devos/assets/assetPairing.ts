export type AssetType = "model" | "blueprint";

export type AssetPair = {
    baseName: string;
    inputType: AssetType;
    modelPath: string | null;
    blueprintPath: string | null;
    modelExists: boolean;
    blueprintExists: boolean;
};

export const AVAILABLE_ASSETS = ["chiron", "jesko", "vegeta", "zombie", "mecha", "regera"];

export function getBaseName(fileName: string) {
    return fileName.replace(/\.(glb|png)$/i, "");
}

export function getAssetType(fileName: string): AssetType | null {
    const lower = fileName.toLowerCase();

    if (lower.endsWith(".glb")) return "model";
    if (lower.endsWith(".png")) return "blueprint";

    return null;
}

export function pairAsset(fileName: string): AssetPair | null {
    const inputType = getAssetType(fileName);

    if (!inputType) return null;

    const baseName = getBaseName(fileName);
    const existsInLibrary = AVAILABLE_ASSETS.includes(baseName);

    const modelExists = existsInLibrary;
    const blueprintExists = existsInLibrary;

    return {
        baseName,
        inputType,
        modelPath: modelExists ? `/models/${baseName}.glb` : null,
        blueprintPath: blueprintExists ? `/blueprints/${baseName}.png` : null,
        modelExists,
        blueprintExists,
    };
}