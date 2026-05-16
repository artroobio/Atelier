Command Structure Overview
BLOG_AUTOEXEC.md
├── STEP 1: SEO Planning
├── STEP 2: Content Generation
├── STEP 3: Image Creation & R2 Upload
├── STEP 4: HTML Generation
├── STEP 5: Git Push to Cloudflare
└── STEP 6: Verification

Complete Auto-Execute Command
File: ATELIEREVO_BLOG_AUTOEXEC.md
markdown# AtelierEvo Blog Auto-Execution Plan

## Project Context
- Website: atelierevo.com
- Target Audience: Architects & Interior Designers
- Goal: Authority + Leads + SEO Ranking
- Stack: Static HTML → Git → Cloudflare Pages
- Assets: Cloudflare R2 bucket for images

---

## STEP 1: SEO Planning Phase

**Input:** Blog topic from roadmap

**Execute:**
1. Generate 5 SEO-focused title options
2. Provide:
   - Primary keyword
   - 5 supporting keywords
   - Search intent analysis
   - Competitor gap analysis
3. Create logical H1 → H2 → H3 outline
4. Generate meta description (155 chars max)
5. Identify internal linking opportunities from existing blogs

**Output:** `{blog-slug}/SEO_BRIEF.json`

---

## STEP 2: Content Generation Phase

**Topic Selected:** [FROM ROADMAP]

**Requirements:**
- **Word count:** 1800–2500 words (premium long-form)
- **Tone:** Expert but conversational, technical credibility + accessibility
- **Structure Rules:**
  - Every H2/H3 must start with 3–4 line explanatory paragraph
  - Bullet points ONLY after paragraph context
  - No speculation—cite design principles, UX research, case studies
  - Include at least 1 data point or statistic per section
  - Add actionable takeaways in each section

**Content Elements:**
-  TOC at top
- 3 authoritative external links (Smashing Magazine, Nielsen Norman Group, Awwwards, CSS Tricks, etc.)
- Internal links to 3 related AtelierEvo blog posts (from roadmap)
- Comparison tables where relevant (e.g., CMS comparison, cost analysis)
- Real-world examples or portfolio scenarios
- FAQ section (5–7 questions)
**Layout:** Full-width widescreen layout optimized for desktop reading (max-width: 1400px centered container, NOT narrow 700px article width). Content area should utilize 65-70% viewport width on desktop with generous whitespace. Use CSS `max-width: 1400px; margin: 0 auto; padding: 0 4rem;` for main container. Images should span full content width. Mobile: 100% width with 1.5rem side padding.

**SEO Integration:**
- Primary keyword in: H1, first paragraph, URL slug, meta title
- Supporting keywords naturally distributed
- Alt text for all images (descriptive + keyword-relevant)
- Semantic HTML5 structure
- Schema markup for Article + FAQPage

**Output:** `{blog-slug}/content.json` (structured content)
**Output Structure:** All blog content, images, and metadata must be organized in `blog/{blog-slug}/` folder with subfolders for images and JSON logs.
---

## STEP 3: Image Creation & R2 Upload

**Image Requirements per blog:**
- Hero image (1200×630px, OG image)
- 4–6 section illustrations (800×600px or 16:9)
- Infographic/comparison diagrams where applicable
- Before/after examples if relevant

**Naming Convention:**
`atelierevo-{blog-slug}-{image-type}-{number}.webp`

Examples:
- `atelierevo-seo-interior-designers-hero-01.webp`
- `atelierevo-best-architecture-websites-comparison-02.webp`

**Image Creation Process:**
1. Generate images based on [IMAGE: description] markers in content
2. Convert to WebP format
3. Optimize for web (compression without quality loss)
4. Generate alt text for each image

**R2 Upload:**
- Bucket: `atelierevo-blog-assets`
- Path structure: `/blog/{blog-slug}/`
- Make all images publicly accessible
- Generate CDN URLs: `https://assets.atelierevo.com/blog/{blog-slug}/{filename}`

**Output:** 
- `{blog-slug}/images/` (local backup)
- `{blog-slug}/R2_UPLOAD_LOG.json` (CDN URLs + alt text)

---

## STEP 3.5: R2 Upload Script

**Dependencies:**
```bash
npm install @aws-sdk/client-s3 sharp
```

**Upload Script (`scripts/upload-blog-images.js`):**
```javascript
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
    const r2Key = `blog/${blogSlug}/${file}`;

    // Optimize image with sharp
    const optimized = await sharp(localPath)
      .webp({ quality: 85 })
      .toBuffer();

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
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

// Execute
const urls = await uploadBlogImages(
  "seo-for-interior-designers",
  "./blog/seo-for-interior-designers/images"
);

console.log(JSON.stringify(urls, null, 2));
```

---

## STEP 4: HTML Generation

**File Structure:**
/blog/{blog-slug}/
├── index.html
├── og-image.png (1200×630)
└── assets/
├── images/ (local copies)
└── schema.json

**HTML Template Requirements:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta -->
    <title>{Meta Title - 60 chars}</title>
    <meta name="description" content="{Meta Description - 155 chars}">
    <link rel="canonical" href="https://atelierevo.com/blog/{blog-slug}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="{OG Title}">
    <meta property="og:description" content="{OG Description}">
    <meta property="og:image" content="https://assets.atelierevo.com/blog/{blog-slug}/hero.webp">
    <meta property="og:url" content="https://atelierevo.com/blog/{blog-slug}">
    <meta property="og:type" content="article">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{Twitter Title}">
    <meta name="twitter:description" content="{Twitter Description}">
    <meta name="twitter:image" content="https://assets.atelierevo.com/blog/{blog-slug}/hero.webp">
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "{Article Title}",
      "author": {
        "@type": "Person",
        "name": "AtelierEvo Team"
      },
      "datePublished": "{ISO 8601 Date}",
      "dateModified": "{ISO 8601 Date}",
      "image": "https://assets.atelierevo.com/blog/{blog-slug}/hero.webp",
      "publisher": {
        "@type": "Organization",
        "name": "AtelierEvo",
        "logo": {
          "@type": "ImageObject",
          "url": "https://atelierevo.com/logo.png"
        }
      }
    }
    </script>
    
    <!-- FAQ Schema (if applicable) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{FAQ_ITEMS}]
    }
    </script>
    
    <!-- Inline Critical CSS -->
    <style>
        /* Mobile-first responsive design */
        /* Premium typography */
        /* Performance-optimized */
    </style>
</head>
<body>
    <!-- Content with proper semantic HTML5 -->
    <!-- All images use R2 CDN URLs -->
    <!-- All internal/external links clickable -->
</body>
</html>
```
VERY Important - **SEO Implementation:** Integrate all elements from `SEO_CHECKLIST.txt` including meta tags, Open Graph, Twitter Cards, structured data (BlogPosting, FAQPage, BreadcrumbList, Organization, Person schemas), canonical URL, performance optimization hints (preconnect, dns-prefetch, preload), semantic HTML5 structure, and responsive image srcset. Verify all schema markup validates via Google Rich Results Test before deployment.

**CSS Requirements:**
- Mobile-first responsive (320px → 1920px)
- Premium typography hierarchy
- Smooth scrolling for TOC
- Lazy loading for images
- Dark/light theme support (optional)

**Output:** `{blog-slug}/index.html`

---

## STEP 5: Git Push to Cloudflare

**Pre-Push Checklist:**
- ✅ HTML validates (W3C)
- ✅ All images uploaded to R2
- ✅ All links working
- ✅ Mobile responsive verified
- ✅ Meta tags complete
- ✅ Schema markup valid
- ✅ Lighthouse score >90

**Git Workflow:**
```bash
# Assuming repo root is connected to Cloudflare Pages
cd /path/to/atelierevo-repo

# Create blog directory
mkdir -p blog/{blog-slug}
cp {generated-files} blog/{blog-slug}/

# Git operations
git checkout main
git pull origin main
git add blog/{blog-slug}
git commit -m "Add blog: {Blog Title}"
git push origin main
```

**Cloudflare Pages Auto-Deploy:**
- Triggered by push to `main`
- Build command: `none` (static HTML)
- Output directory: `/`
- Live URL: `https://atelierevo.com/blog/{blog-slug}`

**Output:** Git commit hash + deployed URL

---

## STEP 6: Verification & Reporting

**Post-Deploy Checks:**
1. Visit live URL: `https://atelierevo.com/blog/{blog-slug}`
2. Verify:
   - All images load (R2 CDN)
   - All links clickable
   - Mobile rendering correct
   - Meta tags present (view source)
   - Schema markup valid (Google Rich Results Test)
   - Page speed (Lighthouse)

**Generate Report:**
```json
{
  "blog_slug": "{blog-slug}",
  "title": "{Blog Title}",
  "url": "https://atelierevo.com/blog/{blog-slug}",
  "published_date": "{ISO Date}",
  "word_count": 2100,
  "images_uploaded": 6,
  "r2_urls": [...],
  "lighthouse_scores": {
    "performance": 95,
    "accessibility": 100,
    "seo": 100
  },
  "internal_links": [...],
  "external_links": [...],
  "primary_keyword": "{keyword}",
  "status": "✅ LIVE"
}
```

**Output:** `{blog-slug}/DEPLOYMENT_REPORT.json`

---

## STEP 7: CTA & Author Bio (Standard Template)

**CTA Section:**
```html
<section class="cta-section">
  <h2>Ready to Elevate Your Digital Presence?</h2>
  <p>
    Whether you're an architect showcasing award-winning projects, 
    an interior designer building your online portfolio, or a developer 
    looking to attract high-value clients, your website is your most 
    powerful marketing asset.
  </p>
  <p>
    At AtelierEvo, we specialize in creating premium, performance-optimized 
    websites for design professionals who refuse to compromise on aesthetics 
    or functionality.
  </p>
  <a href="https://atelierevo.com/contact" class="cta-button">
    Start Your Project
  </a>
</section>
```

**Author Bio:**
```html
<section class="author-bio">
  <h3>About AtelierEvo</h3>
  <p>
    AtelierEvo is a web development studio specializing in portfolio 
    websites for architects, interior designers, and real estate developers. 
    We combine technical excellence with design sensibility to create 
    digital experiences that convert visitors into clients.
  </p>
  <p>
    Our focus: Fast, beautiful, SEO-optimized websites that showcase 
    your work the way it deserves to be seen.
  </p>
  <a href="https://atelierevo.com/about">Learn More About Us</a>
</section>
```

---

## Blog Roadmap Execution Order

**Phase 1: Foundation (Weeks 1-2)**
1. Ultimate Guide to Interior Designer Websites
2. Why Portfolio Presentation Matters
3. Best Homepage Layouts for Architects

**Phase 2: Technical SEO (Weeks 3-4)**
4. SEO for Interior Designers
5. Local SEO for Architects
6. Why Designers Need SEO
7. SEO Mistakes Interior Designers Make

**Phase 3: Design Authority (Weeks 5-6)**
8. Best Architecture Websites in 2026
9. Luxury Website Design Trends
10. Minimalist Website Design for Designers
11. Dark vs Light Theme for Luxury Brands

**Phase 4: Technical Deep Dives (Weeks 7-8)**
12. WordPress vs Webflow for Architects
13. Best CMS for Architecture Websites
14. How Fast Websites Improve Conversions
15. Best Image Optimization Methods

**Phase 5: Conversion Optimization (Weeks 9-10)**
16. How Architects Can Get More Leads Online
17. Website Features That Increase Leads
18. Why Minimalist Websites Convert Better
19. How Designers Build Trust Online

**Phase 6: Advanced Topics (Weeks 11-12)**
20. Mobile UX for Portfolio Websites
21. Interactive Portfolio Website Trends
22. Architecture Website Navigation Best Practices
23. How to Structure a Luxury Portfolio Website

**Phase 7: Supporting Content (Ongoing)**
24-29. Remaining topics from roadmap

---

## Automation Checklist

Before running auto-execute:
- [ ] Cloudflare R2 bucket created and configured
- [ ] Git repo connected to Cloudflare Pages
- [ ] Blog topic selected from roadmap
- [ ] R2 CDN URLs accessible
- [ ] AtelierEvo design system documented (fonts, colors, spacing)

---

## Success Metrics

Track per blog:
- Organic impressions (30 days)
- Click-through rate
- Average time on page
- Bounce rate
- Lead form submissions
- Keyword rankings (primary + supporting)

---