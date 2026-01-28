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
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
