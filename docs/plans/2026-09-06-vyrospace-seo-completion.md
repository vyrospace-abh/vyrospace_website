# VYROSPACE SEO Completion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add missing SEO metadata (canonical URL, Open Graph, Twitter Card, JSON-LD Service schemas) to `index.html` and add image tags to `sitemap.xml` for the 3 service pages that don't have them yet.

**Architecture:** Pure additive HTML/SVG/XML metadata — no structural changes, no new files, no CSS/JS modifications. The 4 service sub-pages are already fully optimized; only `index.html` and `sitemap.xml` need updates.

**Tech Stack:** Static HTML, XML sitemap, Google Rich Results / Open Graph / Twitter Card spec.

---

## Task 1: Add canonical URL to index.html

**Files:**
- Modify: `index.html:10` (insert after `<link rel="stylesheet" href="style.css">`)

**Step 1: Insert canonical link**

Add this line after `index.html:15` (after `<link rel="stylesheet" href="style.css">`):

```html
<link rel="canonical" href="https://vyrospace.com/">
```

**Step 2: Verify visually**

Run: `grep -n "canonical" index.html`
Expected: One match with `https://vyrospace.com/`

**Step 3: Commit**

```bash
git add index.html
git commit -m "Add canonical URL to index.html"
```

---

## Task 2: Add Open Graph tags to index.html

**Files:**
- Modify: `index.html` (insert before `</head>`)

**Step 1: Insert OG block**

Add the following block after `index.html:27` (after the existing `<meta name="mobile-web-app-capable" content="yes">`):

```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://vyrospace.com/">
<meta property="og:title" content="VYROSPACE — 3D Rendering & Architectural Visualization Studio">
<meta property="og:description" content="VYROSPACE is a premier 3D rendering and architectural visualization studio. We provide photorealistic exterior renderings, interior visualizations, product renders, and immersive 3D walkthroughs for architects, developers, and product designers worldwide.">
<meta property="og:image" content="https://vyrospace.com/vyro_main_png.png">
<meta property="og:site_name" content="VYROSPACE">
```

**Step 2: Verify visually**

Run: `grep -c "og:" index.html`
Expected: 6 (one for each og: tag)

**Step 3: Commit**

```bash
git add index.html
git commit -m "Add Open Graph tags to index.html"
```

---

## Task 3: Add Twitter Card tags to index.html

**Files:**
- Modify: `index.html` (insert after OG block)

**Step 1: Insert Twitter Card block**

Add the following block after the OG block (after `og:site_name`):

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://vyrospace.com/">
<meta name="twitter:title" content="VYROSPACE — 3D Rendering & Architectural Visualization Studio">
<meta name="twitter:description" content="Premium 3D rendering and architectural visualization studio. Exterior renderings, interior visualizations, product renders, and 3D walkthroughs.">
<meta name="twitter:image" content="https://vyrospace.com/vyro_main_png.png">
```

**Step 2: Verify visually**

Run: `grep -c "twitter:" index.html`
Expected: 5 (one for each twitter: tag)

**Step 3: Commit**

```bash
git add index.html
git commit -m "Add Twitter Card tags to index.html"
```

---

## Task 4: Add JSON-LD Service schemas to index.html

**Files:**
- Modify: `index.html` (insert after FAQPage JSON-LD, before `<nav>`)

**Step 1: Insert Exterior service schema**

After the existing FAQPage JSON-LD block (after `index.html:131`), add:

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Exterior 3D Rendering",
    "name": "Exterior 3D Rendering Services",
    "alternateName": ["Architectural Visualization", "3D Exterior Renders", "Building Renderings"],
    "description": "Premium exterior 3D rendering services for real estate developers, architects, and marketing teams. Photorealistic architectural visualizations with cinematic lighting and realistic materials.",
    "url": "https://vyrospace.com/exterior-rendering.html",
    "provider": {
        "@type": "Organization",
        "name": "VYROSPACE",
        "url": "https://vyrospace.com"
    },
    "areaServed": "Worldwide"
}
    </script>
```

**Step 2: Insert Interior service schema**

After the Exterior block:

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Interior 3D Visualization",
    "name": "Interior 3D Visualization Services",
    "alternateName": ["Interior Design Renders", "3D Interior Rendering"],
    "description": "Premium interior 3D visualization services. Photorealistic interior renders for architects, designers, and real estate marketing that capture atmosphere, mood, and authentic lived-in details.",
    "url": "https://vyrospace.com/interior-visualization.html",
    "provider": {
        "@type": "Organization",
        "name": "VYROSPACE",
        "url": "https://vyrospace.com"
    },
    "areaServed": "Worldwide"
}
    </script>
```

**Step 3: Insert Product service schema**

After the Interior block:

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "3D Product Visualization",
    "name": "3D Product Visualization Services",
    "alternateName": ["Product CGI", "Product Rendering", "3D Product Rendering"],
    "description": "Premium 3D product visualization services. Photorealistic CGI renders for e-commerce, marketing, and branding — studio shots, lifestyle scenes, and 360° interactive views.",
    "url": "https://vyrospace.com/product-visualization.html",
    "provider": {
        "@type": "Organization",
        "name": "VYROSPACE",
        "url": "https://vyrospace.com"
    },
    "areaServed": "Worldwide"
}
    </script>
```

**Step 4: Insert Walkthrough service schema**

After the Product block:

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "3D Walkthrough",
    "name": "Immersive 3D Walkthrough Services",
    "alternateName": ["Virtual Tour", "3D Walkthrough Animation", "Architectural Walkthrough"],
    "description": "Experience your projects before they exist with immersive 3D walkthroughs. Interactive spatial storytelling and cinematic virtual tours for architecture, real estate, and hospitality.",
    "url": "https://vyrospace.com/3d-walkthrough.html",
    "provider": {
        "@type": "Organization",
        "name": "VYROSPACE",
        "url": "https://vyrospace.com"
    },
    "areaServed": "Worldwide"
}
    </script>
```

**Step 5: Verify visually**

Run: `grep -c "Service" index.html`
Expected: At least 4 (plus the existing 1 in the FAQPage block — total 5)

Run: `grep -c "@type" index.html`
Expected: 7 (Organization, WebSite, FAQPage + 4 new Service schemas)

**Step 6: Commit**

```bash
git add index.html
git commit -m "Add JSON-LD Service schemas to index.html"
```

---

## Task 5: Add image tags to sitemap.xml for 3 service pages

**Files:**
- Modify: `sitemap.xml` (add `<image:image>` blocks to 3 URL entries)

**Step 1: Add image tag for Interior 3D Visualization**

Modify the Interior URL block (after `<loc>` and before `</url>`) to add:

```xml
<image:image>
    <image:loc>https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=85</image:loc>
    <image:title>Interior 3D Visualization Services - VYROSPACE</image:title>
</image:image>
```

**Step 2: Add image tag for Product 3D Visualization**

In the Product URL block, add:

```xml
<image:image>
    <image:loc>https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85</image:loc>
    <image:title>3D Product Visualization Services - VYROSPACE</image:title>
</image:image>
```

**Step 3: Add image tag for 3D Walkthrough**

In the 3D Walkthrough URL block, add:

```xml
<image:image>
    <image:loc>https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85</image:loc>
    <image:title>Immersive 3D Walkthrough Services - VYROSPACE</image:title>
</image:image>
```

**Step 4: Validate the XML**

Run: `xmllint --noout sitemap.xml && echo "Valid XML"`
Expected: "Valid XML"

**Step 5: Verify visually**

Run: `grep -c "image:image" sitemap.xml`
Expected: 4 (1 homepage + 1 exterior + 3 newly added)

**Step 6: Commit**

```bash
git add sitemap.xml
git commit -m "Add image tags to sitemap.xml for 3 service pages"
```

---

## Final Verification

**Step 1: Confirm all 5 pages have full SEO coverage**

Run:
```bash
for page in index.html exterior-rendering.html interior-visualization.html product-visualization.html 3d-walkthrough.html; do
  echo "=== $page ==="
  echo "Canonical: $(grep -c "rel=\"canonical\"" $page)"
  echo "OG tags: $(grep -c "og:" $page)"
  echo "Twitter: $(grep -c "twitter:" $page)"
done
```

Expected: All pages show Canonical=1, OG≥6, Twitter≥5

**Step 2: Validate JSON-LD with Google Rich Results Test**

Open each page in browser → View Source → Copy JSON-LD blocks → Paste at https://search.google.com/test/rich-results
Expected: 0 errors, 0 warnings

**Step 3: Final commit summary**

Run: `git log --oneline`
Expected: 5 new commits on top of the initial design doc commit.
