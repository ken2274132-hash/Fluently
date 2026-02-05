import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch("https://api.heygen.com/v1/streaming/avatar.list", {
            method: "GET",
            headers: {
                "x-api-key": process.env.HEYGEN_API_KEY || "",
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("HeyGen Avatar List Error:", errorData);
            return NextResponse.json({ error: errorData.message || "Failed to list avatars" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("HeyGen Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
