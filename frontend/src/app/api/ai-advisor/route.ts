import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(
  request: Request
) {
  try {
    const {
      question,
      travelStyle,
      travelPersonality,
    } = await request.json();

    const prompt = `
You are Moksh Yatri AI Travel Advisor.

Traveler Style:
${travelStyle}

Traveler Personality:
${travelPersonality}

Question:
${question}

Instructions:

- Give practical travel advice.
- Do not invent festivals, events, weather forecasts, prices, permits, schedules, or local regulations.
- If uncertain, say "check current local information before travel".
- Prefer general travel guidance over unsupported facts.
- Use bullet points.
- Keep answer under 250 words.
`;

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

    return NextResponse.json({
      success: true,
      answer:
        completion.choices[0]?.message?.content ||
        "No response generated.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        answer: "AI advisor unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}