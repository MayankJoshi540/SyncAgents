import dotenv from "dotenv";
dotenv.config();

import { s3 } from "./utils/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

async function test() {
  console.log("==========================================");
  console.log("🔍 Testing AWS S3 Connection");
  console.log("==========================================");
  console.log("Region:    ", process.env.AWS_REGION);
  console.log("Bucket:    ", process.env.AWS_BUCKET_NAME);
  console.log("Access Key:", process.env.AWS_ACCESS_KEY_ID);
  console.log("------------------------------------------");

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: "test-connection.txt",
      Body: "Hello from CortexAI connection test script!",
      ContentType: "text/plain"
    });
    
    console.log("⏳ Sending upload request to S3...");
    await s3.send(command);
    console.log("✅ SUCCESS! Uploaded test file 'test-connection.txt' to S3 successfully.");
  } catch (error) {
    console.error("❌ S3 UPLOAD FAILED!");
    console.error(error);
  }
}

test();
