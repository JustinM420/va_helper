import { S3, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

export async function downloadFromS3(file_key: string): Promise<string | null> {
  const s3 = new S3({
    region: process.env.NEXT_PUBLIC_S3_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
    },
  });

  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    Key: file_key,
  };

  try {
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);

    if (!response.Body) {
      throw new Error("Response body is undefined.");
    }

    // Convert the response body into a buffer
    const data = await streamToBuffer(response.Body);
    
    const file_name = `/tmp/pdf-${Date.now().toString()}.pdf`;
    fs.writeFileSync(file_name, data);

    return file_name;
  } catch (error) {
    console.error("Error downloading from S3:", error);
    return null;
  }
}

// Helper function to convert a readable stream to a buffer
function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
