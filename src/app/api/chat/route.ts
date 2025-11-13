import { kaiwu } from "@/lib/ai-provider/provider";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json();

    const result = streamText({
      model: kaiwu('custom'),
      messages: convertToModelMessages(messages)
    })
    return result.toUIMessageStreamResponse({
      sendSources: true
    })



  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'applicatio/json' }
    });
  }
}

