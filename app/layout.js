import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";

export async function generateMetadata() {
  return {
    title: "Neural Interface - Powered by Claude 4 Sonnet",
    description: "A premium AI experience with Claude 4 Sonnet and other advanced models.",
    metadataBase: new URL('https://your-domain.com'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: "Neural Interface - Powered by Claude 4 Sonnet",
      description: "A premium AI experience with Claude 4 Sonnet and other advanced models.",
      images: '/og-image.png',
    },
    icons: {
      icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>',
    },
    themeColor: '#0a0a0c',
    viewport: 'width=device-width, initial-scale=1.0',
    // Security headers
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-eval' https://va.vercel-scripts.com; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' https://api.replicate.com https://va.vercel-analytics.com; " +
        "frame-ancestors 'none';",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Neural Interface - Powered by Claude 4 Sonnet</title>
      </head>
      <body className="min-h-screen">
        {children}
        <Analytics />
        <script
          id="theme-script"
          src="/theme.js"
          async
        />
      </body>
    </html>
  );
}
