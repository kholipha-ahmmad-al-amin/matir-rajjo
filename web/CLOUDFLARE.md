# ─── Cloudflare Integration Guide ───────────────────────────────────────
# This file contains the configuration required for Cloudflare integration.

## 1. Why Cloudflare?

Cloudflare sits in front of Firebase Hosting to provide:
- DDoS protection and WAF (Web Application Firewall)
- Argo Smart Routing for faster global delivery
- Bot management (block scrapers, bots)
- Automatic HTTPS rewrites
- Caching static assets at the edge
- Email routing (catch-all for custom domain)

## 2. DNS Configuration

In your Cloudflare dashboard, configure these DNS records:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| CNAME | @ | matir-rajjo.web.app | Proxied (orange cloud) |
| CNAME | www | matir-rajjo.web.app | Proxied |

## 3. SSL/TLS Settings

- SSL/TLS encryption mode: **Full (strict)**
- Always Use HTTPS: **On**
- Automatic HTTPS Rewrites: **On**
- Minimum TLS Version: **1.2**

## 4. Page Rules

Create these page rules for maximum performance:

```
# Cache static assets aggressively
URL: matir-rajjo.equisaas-bd.com/_next/static/*
Cache Level: Cache Everything
Edge Cache TTL: 30 days
Browser Cache TTL: 7 days
```

```
# Cache images
URL: matir-rajjo.equisaas-bd.com/*.jpg
Cache Level: Cache Everything
Edge Cache TTL: 7 days
```

## 5. Security Rules (WAF)

```
# Rate limit contact form submissions
URL: matir-rajjo.equisaas-bd.com/contact
Rule: (http.request.uri.path eq "/contact")
Action: Block if rate exceeds 5 requests per 60 seconds per IP
```

```
# Block known bad bots
Rule: (cf.client.bot) 
Action: Challenge (JS Challenge)
```

## 6. Workers Script (Optional: Edge-Side Image Optimization)

```javascript
// workers/image-optimizer.js
// Deploy to Cloudflare Workers to optimize images served through Cloudflare
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Only optimize images from Cloudinary or Next.js
    if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      const cfOptions = {
        polish: "lossy",      // Auto-optimize images
        mirage: true,         // Lazy-load images for slow connections
        cacheEverything: true,
      };
      return fetch(request, { cf: cfOptions });
    }
    
    return fetch(request);
  }
};
```
