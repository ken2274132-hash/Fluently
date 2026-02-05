import { NextResponse } from "next/server";

export async function POST() {
    try {
        const res = await fetch("https://api.heygen.com/v1/streaming.create_token", {
            method: "POST",
            headers: {
                "x-api-key": process.env.HEYGEN_API_KEY || "",
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("HeyGen Token Error:", errorData);
            return NextResponse.json({ error: errorData.message || "Failed to create token" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json({ token: data.data.token });
    } catch (error) {
        console.error("HeyGen Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
