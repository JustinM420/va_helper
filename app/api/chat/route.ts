import { Configuration, OpenAIApi } from "openai-edge";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, 
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));

    if (_chats.length !== 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);

    // Handle missing or empty context
    const contextBlock = context || "No context available.";

    const prompt = {
      role: "system",
      content: `AI assistant is an expert in helping veterans understand their VA Decision Letters. The assistant is knowledgeable, clear, and empathetic, providing accurate explanations of VA processes and terminology. AI is respectful and supportive, focusing on empowering veterans with the information they need.

            START CONTEXT BLOCK
            ${contextBlock}
            END OF CONTEXT BLOCK

            - AI uses the CONTEXT BLOCK to answer questions.
            - If the context doesn't provide an answer, AI will say, "I'm sorry, but I don't know the answer to that question."
            - AI doesn't apologize for past responses but indicates when new information is available.
            - AI will not create information beyond what is in the context or known from authoritative sources.
            - Do Not use markdown formatting in your response. Use added spacing and indenting to help make your responses easy to read.
            - If the User asks about a document or file they are refering to the context block.
             `,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini", 
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
      stream: true,
    });

    const stream = OpenAIStream(response, {
      onStart: async () => {
        try {
          await db.insert(_messages).values({
            chatId,
            content: lastMessage.content,
            role: "user",
          });
        } catch (error) {
          console.error("Error saving user message to DB:", error);
        }
      },
      onCompletion: async (completion) => {
        try {
          await db.insert(_messages).values({
            chatId,
            content: completion,
            role: "system",
          });
        } catch (error) {
          console.error("Error saving AI message to DB:", error);
        }
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
