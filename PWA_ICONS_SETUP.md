# PWA Icons Setup

To complete the PWA setup, you need to create the following icon files in the `public` directory:

## Required Icon Files:

1. **pwa-192x192.png** - 192x192 pixels
2. **pwa-512x512.png** - 512x512 pixels  
3. **apple-touch-icon.png** - 180x180 pixels
4. **favicon.ico** - Standard favicon

## Icon Design Guidelines:

- Use the Algorithmic Insights logo or a relevant algorithm-themed icon
- Ensure icons work well on light and dark backgrounds
- Use consistent branding colors (theme color: #3182ce)
- Icons should be simple and recognizable at small sizes

## Tools for Icon Generation:

1. **PWA Builder** (Microsoft): https://www.pwabuilder.com/imageGenerator
2. **Favicon.io**: https://favicon.io/
3. **Real Favicon Generator**: https://realfavicongenerator.net/

## Steps to Generate Icons:

1. Create a base image (1024x1024 recommended)
2. Use one of the tools above to generate all required sizes
3. Place the generated files in the `public` directory
4. Ensure file names match those specified in vite.config.ts

## Current PWA Configuration:

The PWA is configured with:
- ✅ Service Worker with Workbox
- ✅ Automatic updates
- ✅ Offline caching strategy
- ✅ Install prompts
- ✅ Manifest configuration
- ⏳ Icons (need to be added)

Once icons are added, the app will be fully PWA-compliant!
