import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB limit

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as Blob;

        if (!file) {
            return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "Audio file too large. Maximum 25MB allowed" }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("STT Error: GROQ_API_KEY is missing");
            return NextResponse.json({ error: "Speech recognition service unavailable" }, { status: 503 });
        }

        // Create form data for Groq API
        const groqFormData = new FormData();
        groqFormData.append("file", file, "audio.wav");
        groqFormData.append("model", "whisper-large-v3");
        groqFormData.append("language", "en");

        const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
            },
            body: groqFormData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: "Unknown error" }));
            console.error("Groq STT Error:", response.status, error);
            return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
        }

        const result = await response.json();

        if (!result.text || result.text.trim() === '') {
            return NextResponse.json({ error: "Could not understand audio. Please try again." }, { status: 422 });
        }

        return NextResponse.json({ text: result.text.trim() });
    } catch (error) {
        console.error("STT Server Error:", error);
        return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
    }
}
