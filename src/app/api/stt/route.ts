import { openai } from "@/lib/openai";
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

        // Convert Blob to File for OpenAI SDK
        const audioFile = new File([file], "audio.wav", { type: "audio/wav" });

        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: "whisper-1",
            language: "en",
        });

        if (!transcription.text || transcription.text.trim() === '') {
            return NextResponse.json({ error: "Could not understand audio. Please try again." }, { status: 422 });
        }

        return NextResponse.json({ text: transcription.text.trim() });
    } catch (error) {
        console.error("OpenAI STT Error:", error);
        return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
    }
}
