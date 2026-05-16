import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";
import { readdir } from "fs/promises";
import { join } from "path";

// R2 credentials from Cloudflare dashboard
const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function uploadToR2(localPath, r2Path, bucketName) {
  const fileContent = readFileSync(localPath);
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: r2Path,
    Body: fileContent,
    ContentType: getContentType(localPath),
  });

  await S3.send(command);
  console.log(`✅ Uploaded: ${r2Path}`);
}

function getContentType(filename) {
  if (filename.endsWith('.webp')) return 'image/webp';
  if (filename.endsWith('.png')) return 'image/png';
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

// Usage Example (Uncomment to test)
/*
await uploadToR2(
  './images/hero.webp',
  'blog/seo-for-designers/hero.webp',
  'atelierevo-blog-assets'
);
*/

export { uploadToR2 };
