import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const avatarId = body.avatarId || 'dd73ea75-1218-4ef3-92ce-606d5f7fbc0a';
        const voiceId = body.voiceId || 'c2527536-6d1f-4412-a643-53a3497dada9';

        // Get session token from LiveAvatar API
        const res = await fetch("https://api.liveavatar.com/v1/sessions/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.LIVEAVATAR_API_KEY || process.env.HEYGEN_API_KEY || "",
            },
            body: JSON.stringify({
                mode: "FULL",
                avatar_id: avatarId,
                avatar_persona: {
                    avatar_id: avatarId,
                    voice_id: voiceId,
                },
            }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
            console.error("LiveAvatar Token Error:", errorData);
            return NextResponse.json(
                { error: errorData.message || errorData.error || "Failed to create session token" },
                { status: res.status }
            );
        }

        const responseData = await res.json();
        console.log("LiveAvatar Token Response:", JSON.stringify(responseData, null, 2));

        // Response format: { code: 100, data: { session_id, session_token }, message }
        const sessionToken = responseData.data?.session_token;
        const sessionId = responseData.data?.session_id;

        if (!sessionToken) {
            console.error("No session_token found in response:", responseData);
            return NextResponse.json({ error: "No session token in response" }, { status: 500 });
        }

        console.log("Session ID:", sessionId);
        console.log("Session Token (first 50 chars):", sessionToken.substring(0, 50) + "...");

        return NextResponse.json({ token: sessionToken, sessionId });
    } catch (error) {
        console.error("LiveAvatar Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
