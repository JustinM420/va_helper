import { NextResponse } from 'next/server';
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { getPineconeClient } from '@/lib/pinecone';
import { convertToAscii } from '@/lib/utils';
import { getEmbeddings } from '@/lib/embeddings';
import { TokenTextSplitter } from "langchain/text_splitter";
import md5 from 'md5';
import pLimit from 'p-limit';

export async function POST(request: Request) {
  try {
    const { urls, namespace } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'Invalid URLs provided.' }, { status: 400 });
    }

    let successCount = 0;
    let failureCount = 0;
    const failedUrls = [];
    const allContent = [];

    for (const url of urls) {
      try {
        const loader = new PuppeteerWebBaseLoader(url);
        const docs = await loader.load();

        if (docs && docs.length > 0) {
          const textSplitter = new TokenTextSplitter({
            chunkSize: 2000,
            chunkOverlap: 200,
          });

          // Split the loaded document into chunks
          const splitDocs = await textSplitter.splitDocuments(docs);

          // Store each chunk for embedding
          for (const chunk of splitDocs) {
            allContent.push({
              url,
              content: chunk.pageContent,
            });
          }
          successCount++;
        } else {
          failedUrls.push(url);
          failureCount++;
        }
      } catch (error) {
        failedUrls.push(url);
        failureCount++;
      }
    }

    const client = getPineconeClient();
    const pineconeIndex = await client.index('va-helper');
    const ns = pineconeIndex.namespace(convertToAscii(namespace || 'default'));

    const limit = pLimit(5); // Limit to 5 concurrent uploads

    await Promise.all(
      allContent.map((item) =>
        limit(async () => {
          const embeddings = await getEmbeddings(item.content);
          const vector = {
            id: md5(item.content),
            values: embeddings,
            metadata: {
              url: item.url,
              content: item.content,
            },
          };

          await ns.upsert([vector]);
        })
      )
    );

    return NextResponse.json({
      message: 'Content successfully sent to Pinecone!',
      successCount,
      failureCount,
      failedUrls,
    });
  } catch (error) {
    console.error('Error processing URLs:', error);
    return NextResponse.json({ error: 'Failed to process URLs.' }, { status: 500 });
  }
}
