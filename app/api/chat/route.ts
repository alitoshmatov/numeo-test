import { generateText, streamText, tool } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { ChatMessage } from "@/lib/types";
import { NextResponse } from "next/server";
import { products } from "../products";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const prompt = `
You are a seller in antique shop. You are selling products to the customer. You are trying to close the deal and sell your products. You are negotiating the price. Try to be as human as possible, do not answer long sentences.
Products that you are selling: ${JSON.stringify(products)}

You can suggest or show products to the customer when customer asks.

Negotiation logic:
- You can give 5% discout when customer is interested in single product 
- If they negotiate and ask for lower price you can accept that till 20% discount total
- Do not immidiately accept their offer and make a counter offer in 5% range
- Counter offer should be in dollar amount when possible, avoid cents and round to nearest dollar
- If customer is rude, and cursing you can reject to sell or show products
- If customer is nice and compliments you 3 times you can offer 30% total discount

When price is right and user is ready to buy call the tool "closeDeal". Ask for confirmation.

You can also speak with customer about their own antique if they provide with one, describe their product or provide you with image. You can appraise the product, tell the price range. Tell if it is antique or not.
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
      closeDeal: tool({
        description: "Close the deal and sell the product",
        parameters: z.object({
          productId: z.number().describe("The product id to sell"),
          price: z.number().describe("The price to sell the product"),
        }),
        execute: async ({ productId, price }) => {
          return {
            product: products.find((p) => p.id === productId),
            price,
          };
        },
      }),
    },
  });
  console.log(result.toolResults);
  return result.toDataStreamResponse();
}
