import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            input: `
Analyze current DevOS telemetry.

CPU usage: ${data.cpuUsage}%
RAM usage: ${data.ramUsage}%
Storage usage: ${data.storageUsage}%
Current network download: ${data.currentDownload} Mbps
Session max download: ${data.maxDownload} Mbps

Return:
- system status
- issue
- recommendation

Maximum 3 short lines.
`,
        });

        return NextResponse.json({
            status: "success",
            insight: response.output_text,
        });
    } catch (error) {
        return NextResponse.json({
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown AI error",
        });
    }
}