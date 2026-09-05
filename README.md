# VYROSPACE

Premium 3D visualization and architectural rendering studio. Photorealistic exterior renderings, interior visualizations, product renders, and immersive 3D walkthroughs.

**Live site:** https://vyrospace.com

## Tech Stack

- Static HTML / CSS / vanilla JavaScript
- Google Fonts (Outfit, Inter)
- YouTube/Vimeo-style video embeds
- PWA-enabled via `manifest.json`

## Project Structure

```
.
├── index.html                       # Homepage
├── exterior-rendering.html          # Exterior 3D rendering service page
├── interior-visualization.html      # Interior 3D visualization service page
├── product-visualization.html       # 3D product visualization service page
├── 3d-walkthrough.html              # Immersive 3D walkthrough service page
├── style.css                        # Global styles
├── script.js                        # Site interactions
├── manifest.json                    # PWA manifest
├── sitemap.xml                      # SEO sitemap
├── robots.txt                       # Crawler rules
├── vercel.json                      # Vercel config (security headers, caching, redirects)
├── nginx.conf                       # Nginx config for Docker
├── Dockerfile                       # Docker build (nginx + static files)
├── .dockerignore                    # Docker build exclusions
├── docs/plans/                      # Design and implementation plans
└── generated image/                 # Rendered 3D images by category
```

## Local Development

```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Serve via Python
python -m http.server 8000
# Then open http://localhost:8000

# Option 3: Serve via Node
npx serve .
```

## Deployment

This project is configured for **two deployment targets**:

### Option A: Vercel (Recommended)

Vercel auto-detects this as a static site. The `vercel.json` config provides:
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- Cache rules (1-year immutable for assets, no-cache for HTML)
- Clean URLs (no `.html` extension)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Or push to a GitHub repo and connect it in the Vercel dashboard — Vercel handles the rest automatically.

### Option B: Docker

```bash
# Build the image
docker build -t vyrospace .

# Run the container
docker run -d -p 8080:80 --name vyrospace vyrospace

# Visit
open http://localhost:8080
```

The container uses nginx 1.27-alpine and serves the static files with gzip compression and proper cache headers.

## SEO

All 5 HTML pages include:
- Title and meta description
- Canonical URL
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- JSON-LD structured data (Organization, Service, BreadcrumbList, ImageObject, FAQPage)

`sitemap.xml` includes image entries for all 5 pages. `robots.txt` allows full crawling and points to the sitemap.

After deploying, validate SEO with:
- https://search.google.com/test/rich-results
- Google Search Console → Sitemaps

## Performance

- Lazy-loaded images
- Preconnect to Google Fonts CDN
- Immutable cache for static assets
- Video files use `playsinline` and `autoplay muted` for mobile compatibility

## License

© 2026 VYROSPACE. All rights reserved.
