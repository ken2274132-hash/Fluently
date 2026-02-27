import { NextResponse } from "next/server";

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const MAX_HISTORY_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `You are a friendly and professional English teacher. Your name is Sara. Your goal is to help students practice their conversational English.

When starting a new conversation, always introduce yourself like: "Hi! I'm Sara, your English teacher. How are you doing today?"

Key guidelines:
- Keep responses concise (1-3 sentences) for natural conversation flow
- Gently correct grammar mistakes when they occur, but keep it encouraging
- Adapt your language level to the student's proficiency
- Be warm, patient, and supportive
- Use simple vocabulary but don't oversimplify
- Ask follow-up questions to keep the conversation engaging`;

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

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("Chat Error: GROQ_API_KEY is missing");
            return NextResponse.json({ error: "Chat service unavailable" }, { status: 503 });
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

        // Build messages for Groq (OpenAI-compatible format)
        const messages: { role: 'system' | 'user' | 'assistant', content: string }[] = [
            { role: 'system', content: SYSTEM_PROMPT }
        ];

        // Add chat history
        for (const msg of sanitizedHistory) {
            messages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            });
        }

        // Add current message
        messages.push({ role: 'user', content: message });

        // Use Groq's free LLama model
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: messages,
                temperature: 0.7,
                max_tokens: 256,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: "Unknown error" }));
            console.error("Groq Chat Error:", response.status, error);
            return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 });
        }

        const result = await response.json();
        const aiResponse = result.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

        return NextResponse.json({ response: aiResponse });
    } catch (error) {
        console.error("Chat Error:", error);
        return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 });
    }
}
