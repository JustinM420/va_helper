import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    console.error("Unauthorized access attempt");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { file_key, file_name } = body;

    // Log the received data
    console.log("Received file_key:", file_key, "Received file_name:", file_name);

    // Step 1: Load file into Pinecone
    try {
      console.log("Starting to load file into Pinecone");
      await loadS3IntoPinecone(file_key);
      console.log("Successfully loaded file into Pinecone");
    } catch (pineconeError) {
      console.error("Error during Pinecone operation:", pineconeError);
      return NextResponse.json({ error: "Pinecone operation failed" }, { status: 500 });
    }

    // Step 2: Insert chat into the database
    try {
      const chat_id = await db
        .insert(chats)
        .values({
          fileKey: file_key,
          pdfName: file_name,
          pdfUrl: getS3Url(file_key),
          userId,
        })
        .returning({
          insertedId: chats.id,
        });

      console.log("Chat successfully inserted with ID:", chat_id[0].insertedId);

      return NextResponse.json(
        {
          chat_id: chat_id[0].insertedId,
        },
        { status: 200 }
      );
    } catch (dbError) {
      console.error("Error inserting chat into the database:", dbError);
      return NextResponse.json({ error: "Database insertion failed" }, { status: 500 });
    }

  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
