import { generateText, streamText, tool } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { ChatMessage } from "@/lib/types";
import { NextResponse } from "next/server";
import { products } from "../products";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const prompt = `
You are a seller in antique shop. You are selling products to the customer. You are trying to close the deal. You are negotiating the price. Try to be as human as possible, do not answer long sentences.
Products that you are selling: ${JSON.stringify(products)}

You can suggest or show products to the customer when customer asks.
`;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: prompt,
    messages: messages,
    tools: {
      products: tool({
        description: "Suggest or show products to the customer",
        parameters: z.object({
          productIds: z
            .array(z.number())
            .describe(
              "The product ids to suggest or show when customer asks, Max give 2 ids"
            ),
        }),
        execute: async ({ productIds }) => {
          return products.filter((p) => productIds.includes(p.id));
        },
      }),
    },
  });
  console.log(result.toolResults);
  return result.toDataStreamResponse();
}
