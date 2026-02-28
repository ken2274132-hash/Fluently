import { NextResponse } from "next/server";

const GRAMMAR_PROMPT = `You are a grammar checker. Analyze the given English text and:
1. Identify all grammar errors
2. Provide corrections
3. Explain the grammar rule for each error

Return a JSON response with this exact structure:
{
    "corrected": "the fully corrected text",
    "suggestions": [
        {
            "original": "the wrong word/phrase",
            "correction": "the correct word/phrase",
            "rule": "brief explanation of the grammar rule"
        }
    ],
    "score": number between 0-100 based on correctness
}

Grammar rules to check:
- Subject-verb agreement (He goes, not He go)
- Tense consistency
- Since vs For (since = point in time, for = duration)
- Articles (a, an, the)
- Prepositions (in, on, at)
- Question tags (positive statement → negative tag)
- Singular/plural forms
- Word order

Only return valid JSON, no additional text.`;

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text || typeof text !== "string" || text.length > 2000) {
            return NextResponse.json({ error: "Invalid text" }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                corrected: text,
                suggestions: [],
                score: 100
            });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: GRAMMAR_PROMPT },
                    { role: "user", content: `Check this text: "${text}"` }
                ],
                temperature: 0.3,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            console.error("Grammar check API error:", response.status);
            return NextResponse.json({
                corrected: text,
                suggestions: [],
                score: 100
            });
        }

        const result = await response.json();
        const content = result.choices?.[0]?.message?.content || "";

        try {
            // Try to parse JSON from response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return NextResponse.json({
                    corrected: parsed.corrected || text,
                    suggestions: parsed.suggestions || [],
                    score: typeof parsed.score === "number" ? parsed.score : 100
                });
            }
        } catch (parseError) {
            console.error("Failed to parse grammar response:", parseError);
        }

        return NextResponse.json({
            corrected: text,
            suggestions: [],
            score: 100
        });

    } catch (error) {
        console.error("Grammar check error:", error);
        return NextResponse.json({
            corrected: "",
            suggestions: [],
            score: 100
        });
    }
}
