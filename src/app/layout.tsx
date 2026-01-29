import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Industrial Society and Its Smart Contracts",
  description: "An on-chain manifesto about technology, stored on the very technology it critiques. The irony is the point.",
  openGraph: {
    title: "Industrial Society and Its Smart Contracts",
    description: "An on-chain manifesto stored on Base.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
