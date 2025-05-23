import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";

export const metadata = {
  title: "Neural Interface - Powered by Claude 4 Sonnet",
  openGraph: {
    title: "Neural Interface - Powered by Claude 4 Sonnet",
    description: "A premium AI experience with Claude 4 Sonnet and other advanced models.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Neural Interface - Powered by Claude 4 Sonnet</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0a0a0c" />
      </head>
      <body className="min-h-screen">
        {children}
        <Analytics />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Check for saved theme preference or use device preference
            if (localStorage.theme === 'dark' || (!('theme' in localStorage ) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          `
        }} />
      </body>
    </html>
  );
}
