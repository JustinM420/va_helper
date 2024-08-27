import { S3, PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadToS3(file: File) {
  try {
    const s3 = new S3({
      region: process.env.NEXT_PUBLIC_S3_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });

    const file_key = 'uploads/' + Date.now().toString() + file.name.replace(" ", "-");

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    const command = new PutObjectCommand(params);

    const upload = s3.send(command);
    
    // You can track progress manually, but AWS SDK v3 doesn't have native progress tracking like v2's .on('httpUploadProgress')
    console.log('Uploading to s3...');

    await upload;
    console.log('File uploaded successfully', file_key);

    return {
      file_key,
      file_name: file.name,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${file_key}`;
  return url;
}
