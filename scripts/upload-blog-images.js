import "dotenv/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { readdir } from "fs/promises";
import { join } from "path";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function uploadBlogImages(blogSlug, localImagesDir) {
  const files = await readdir(localImagesDir);
  const uploadedUrls = [];

  for (const file of files) {
    if (!file.match(/\.(webp|png|jpg|jpeg)$/i)) continue;

    const localPath = join(localImagesDir, file);
    const r2Key = `blog/${blogSlug}/${file.replace(/\.[^/.]+$/, "")}.webp`;

    console.log(`🚀 Optimizing and uploading: ${file}...`);

    // Optimize image with sharp
    const optimized = await sharp(localPath)
      .webp({ quality: 85 })
      .toBuffer();

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'atelierevo-blog-assets',
      Key: r2Key,
      Body: optimized,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000", // 1 year cache
    });

    await S3.send(command);

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${r2Key}`;
    uploadedUrls.push({ file, url: publicUrl });
    console.log(`✅ Uploaded: ${publicUrl}`);
  }

  return uploadedUrls;
}

export { uploadBlogImages };

// Example execution if run directly
if (process.argv[1].includes('upload-blog-images.js')) {
  const [,, blogSlug, localImagesDir] = process.argv;
  if (blogSlug && localImagesDir) {
    uploadBlogImages(blogSlug, localImagesDir)
      .then(urls => console.log(JSON.stringify(urls, null, 2)))
      .catch(err => console.error(err));
  }
}
