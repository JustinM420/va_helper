import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "@/lib/s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import md5 from "md5";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "@/lib/embeddings";
import { convertToAscii } from "./utils";

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
    try {
      // Step 1: Download the file from S3
      console.log("downloading S3 into file system");
      const file_name = await downloadFromS3(fileKey);
      if (!file_name) {
        throw new Error("could not download from S3");
      }
  
      console.log("loading PDF into memory: " + file_name);
      const loader = new PDFLoader(file_name);
      const pages = (await loader.load()) as PDFPage[];
  
      // Step 2: Split and segment the PDF
      const documents = await Promise.all(pages.map(prepareDocument));
  
      // Step 3: Vectorize and embed individual documents
      const vectors = await Promise.all(documents.flat().map(embedDocument));
  
      // Step 4: Upload to Pinecone
      const client = getPineconeClient();
      const pineconeIndex = await client.index("va-helper");
      const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
  
      console.log("inserting vectors into Pinecone");
      await namespace.upsert(vectors);
  
      return documents[0];
    } catch (error) {
      console.error("Error in loadS3IntoPinecone:", error);
      throw error;
    }
  }
  

export async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}