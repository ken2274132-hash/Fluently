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
            // No API key - use browser fallback
            return NextResponse.json({
                error: "TTS service unavailable. Using browser voice.",
                fallback: true
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
            // API error (including quota issues) - use browser fallback
            console.error("OpenAI TTS Error:", response.status);
            return NextResponse.json({
                error: "TTS service unavailable. Using browser voice.",
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
        // Any error - use browser fallback
        return NextResponse.json({
            error: "TTS service unavailable. Using browser voice.",
            fallback: true
        }, { status: 503 });
    }
}
