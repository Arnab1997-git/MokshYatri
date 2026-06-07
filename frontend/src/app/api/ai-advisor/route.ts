import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";


export async function POST(
  request: Request
) {

  try {

    
    const {
      question,
      travelStyle,
      travelPersonality,
    } =
      await request.json();

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

    const response =
      await fetch(
        "http://127.0.0.1:11435/api/generate",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            model:
              "llama3:latest",

            prompt,

            stream: false,

          }),

        }
      );

    const data =
      await response.json();

    return NextResponse.json({

      success: true,

      answer:
        data.response,

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {

        success: false,

        answer:
          "AI advisor unavailable.",

      },
      {
        status: 500,
      }
    );

  }

}