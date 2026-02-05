import { groq } from "@/lib/groq";
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

        // Validate file type
        const validTypes = ['audio/wav', 'audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/ogg'];
        if (!validTypes.some(type => file.type.includes(type.split('/')[1]))) {
            console.warn("Unexpected audio type:", file.type, "- proceeding anyway");
        }

        // Convert Blob to File for Groq SDK
        const audioFile = new File([file], "audio.wav", { type: "audio/wav" });

        const transcription = await groq.audio.transcriptions.create({
            file: audioFile,
            model: "whisper-large-v3",
            language: "en",
        });

        if (!transcription.text || transcription.text.trim() === '') {
            return NextResponse.json({ error: "Could not understand audio. Please try again." }, { status: 422 });
        }

        return NextResponse.json({ text: transcription.text.trim() });
    } catch (error) {
        console.error("STT Error:", error);
        return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
    }
}
