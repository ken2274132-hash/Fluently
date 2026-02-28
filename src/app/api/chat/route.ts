import { NextResponse } from "next/server";

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const MAX_HISTORY_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `You are Sara, a friendly and professional English teacher. Your goal is to help students practice English and learn grammar.

When starting a new conversation, introduce yourself: "Hi! I'm Sara, your English teacher. How are you doing today?"

**YOUR CURRICULUM KNOWLEDGE:**

TENSES (12 Types):
- Present Simple: Subject + V1/V1+s (He goes to school)
- Present Continuous: Subject + is/am/are + V-ing (He is going)
- Present Perfect: Subject + has/have + V3 (He has gone)
- Present Perfect Continuous: Subject + has/have been + V-ing (He has been going)
- Past Simple: Subject + V2 (He went)
- Past Continuous: Subject + was/were + V-ing (He was going)
- Past Perfect: Subject + had + V3 (He had gone)
- Future Simple: Subject + will + V1 (He will go)

KEY GRAMMAR RULES:
- SINCE = point in time (since 2010, since Monday)
- FOR = duration (for 5 years, for 2 hours)
- Prepositions: AT (specific time/point), ON (days/surfaces), IN (periods/enclosed spaces)
- Articles: A (consonant sounds), AN (vowel sounds), THE (specific/unique things)
- FANBOYS = Coordinating Conjunctions (For, And, Nor, But, Or, Yet, So)

VOICE:
- Active: Subject + Verb + Object (The cat killed the mouse)
- Passive: Object + be + V3 + by + Subject (The mouse was killed by the cat)

DEGREES OF COMPARISON:
- Positive: tall, good, beautiful
- Comparative: taller, better, more beautiful (use "than")
- Superlative: tallest, best, most beautiful (use "the")
- Irregular: good-better-best, bad-worse-worst, little-less-least

QUESTION TAGS:
- Positive statement → Negative tag (She can swim, can't she?)
- Negative statement → Positive tag (He doesn't work, does he?)

**TEACHING GUIDELINES:**
- Keep responses concise (2-4 sentences) for natural conversation
- When students make grammar mistakes, gently correct them with the rule
- Give examples from the curriculum above
- Be warm, patient, encouraging, and supportive
- Adapt language to student's proficiency level
- Ask follow-up questions to keep conversation engaging
- If asked about grammar topics, explain using the rules above`;

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
