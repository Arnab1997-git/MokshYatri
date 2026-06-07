import { Ollama } from "ollama";
import { supabase } from "@/lib/supabase";
import { getRelevantGems } from "@/services/aiGemService";

const ollama = new Ollama({
  host: "http://127.0.0.1:11435",
});

export async function POST(req: Request) {
  try {

    
    const body = await req.json();

    const { destination, days, style } = body;

    const gems = await getRelevantGems(style);

    const gemContext =
      gems.length > 0
        ? gems
            .map(
              (g) =>
                `${g.title} - ${g.location} - ${g.description}`
            )
            .join("\n")
        : "No hidden gems available.";

    const response = await ollama.chat({
      model: "llama3",
      messages: [
        {
          role: "system",
          content: `
You are the premium AI travel planner for Moksh Yatri.

Your job is to create cinematic, immersive, highly detailed travel itineraries.

Rules:

1. Always respond in VALID MARKDOWN.

2. Use this exact structure:

# Destination Name

## Overview

Brief emotional introduction to the destination.

## Day 1

### Morning

Activities

### Afternoon

Activities

### Evening

Activities

## Day 2

### Morning

Activities

### Afternoon

Activities

### Evening

Activities

(Continue for all requested days)

## Hidden Gems

* Hidden place 1
* Hidden place 2
* Hidden place 3

## Local Food To Try

* Food 1
* Food 2
* Food 3

## Photography Spots

* Spot 1
* Spot 2
* Spot 3

## Travel Tips

* Tip 1
* Tip 2
* Tip 3

Requirements:

* Make the itinerary visually rich and cinematic.
* Include cafés, viewpoints, local culture and unique experiences.
* Avoid generic tourist-only recommendations.
* Keep the output well structured.
* Use markdown headings (#, ##, ###).
* Do not output JSON.
* Do not explain your reasoning.
* Directly generate the itinerary.

          `,
        },
        {
          role: "user",
          content: `
          Plan a ${days}-day ${style} trip to ${destination}.

          Recommended Hidden Gems:

          ${gemContext}

          When appropriate, naturally include these hidden gems
          inside the itinerary.

          Do not force them.

          Use them only when they improve the travel experience.
          `,
        },
      ],
    });

    return Response.json({
      result: response.message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}