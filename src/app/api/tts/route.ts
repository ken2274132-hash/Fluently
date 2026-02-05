import { NextResponse } from "next/server";

const MAX_TEXT_LENGTH = 4096;
const VALID_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const;
type Voice = typeof VALID_VOICES[number];

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text, voice = "nova" } = body;

        // Input validation
        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        if (text.length > MAX_TEXT_LENGTH) {
            return NextResponse.json({ error: `Text too long. Maximum ${MAX_TEXT_LENGTH} characters allowed` }, { status: 400 });
        }

        // Validate voice parameter
        const selectedVoice: Voice = VALID_VOICES.includes(voice) ? voice : 'nova';

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.error("TTS Error: OPENAI_API_KEY is missing");
            return NextResponse.json({
                error: "TTS service unavailable. Please use browser voice fallback."
            }, { status: 503 });
        }

        const response = await fetch("https://api.openai.com/v1/audio/speech", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "tts-1",
                input: text,
                voice: selectedVoice,
                speed: 1.0,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: "Unknown error" }));
            console.error("OpenAI TTS Error:", response.status);

            // Return 503 to trigger client-side fallback
            return NextResponse.json({
                error: error.message || "Speech generation failed",
                fallback: true
            }, { status: 503 });
        }

        const audioBuffer = await response.arrayBuffer();

        return new Response(audioBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Cache-Control": "no-cache",
            },
        });
    } catch (error: unknown) {
        console.error("TTS Server Error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message, fallback: true }, { status: 500 });
    }
}
