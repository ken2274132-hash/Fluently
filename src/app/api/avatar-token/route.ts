import { NextResponse } from "next/server";

export async function POST() {
    try {
        const apiKey = process.env.LIVEAVATAR_API_KEY;
        const avatarId = process.env.LIVEAVATAR_AVATAR_ID || "dd73ea75-1218-4ef3-92ce-606d5f7fbc0a";
        const voiceId = process.env.LIVEAVATAR_VOICE_ID || "c2527536-6d1f-4412-a643-53a3497dada9";
        const contextId = process.env.LIVEAVATAR_CONTEXT_ID || "5258caa3-8b8d-42b8-9e01-33c643cf887b";

        if (!apiKey) {
            console.error("LiveAvatar Error: LIVEAVATAR_API_KEY is missing");
            return NextResponse.json({ error: "Avatar service unavailable" }, { status: 503 });
        }

        const res = await fetch("https://api.liveavatar.com/v1/sessions/token", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mode: "FULL",
                avatar_id: avatarId,
                is_sandbox: true,
                avatar_persona: {
                    avatar_id: avatarId,
                    voice_id: voiceId,
                    ...(contextId ? { context_id: contextId } : {}),
                    language: "en"
                },
                quality: "low",
                voice_chat_transport: "livekit",
                activity_idle_timeout: 300,
            })
        });

        const status = res.status;
        const text = await res.text();

        if (!res.ok) {
            let errorMessage = "Failed to create avatar session";
            try {
                const errorData = JSON.parse(text);
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
                errorMessage = text || errorMessage;
            }
            console.error("LiveAvatar Token Error:", errorMessage);
            return NextResponse.json({ error: errorMessage }, { status });
        }

        const data = JSON.parse(text);
        const sessionData = data.data || data;

        return NextResponse.json({
            sessionToken: sessionData.session_token || sessionData.token,
            sessionId: sessionData.session_id
        });
    } catch (error: unknown) {
        console.error("LiveAvatar Server Error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
