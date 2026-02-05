import { groq } from "@/lib/groq";
import { NextResponse } from "next/server";

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const MAX_HISTORY_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history } = body;

        // Input validation
        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 });
        }

        if (message.length > MAX_MESSAGE_LENGTH) {
            return NextResponse.json({ error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed` }, { status: 400 });
        }

        // Validate and sanitize history
        let sanitizedHistory: ChatMessage[] = [];
        if (Array.isArray(history)) {
            sanitizedHistory = history
                .filter((msg): msg is ChatMessage =>
                    msg &&
                    typeof msg === 'object' &&
                    (msg.role === 'user' || msg.role === 'assistant') &&
                    typeof msg.content === 'string' &&
                    msg.content.length <= MAX_MESSAGE_LENGTH
                )
                .slice(-MAX_HISTORY_LENGTH);
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a friendly and professional English teacher named Alex. Your goal is to help students practice their conversational English.

Key guidelines:
- Keep responses concise (1-3 sentences) for natural conversation flow
- Gently correct grammar mistakes when they occur, but keep it encouraging
- Adapt your language level to the student's proficiency
- Be warm, patient, and supportive
- Use simple vocabulary but don't oversimplify
- Ask follow-up questions to keep the conversation engaging`,
                },
                ...sanitizedHistory,
                { role: "user", content: message },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 256,
        });

        const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
        return NextResponse.json({ response });
    } catch (error) {
        console.error("Groq Error:", error);
        return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 });
    }
}
