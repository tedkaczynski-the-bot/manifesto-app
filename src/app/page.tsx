"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const CONTRACT_ADDRESS = "0xe18f428f5Fc9d23e3ec51fe1DB47201d5d4eaDEA";

const ABI = [
  {
    inputs: [],
    name: "TITLE",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "readAllTruths",
    outputs: [{ type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "author",
    outputs: [{ type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "createdAt",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const client = createPublicClient({
  chain: base,
  transport: http(),
});

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    if (newValue) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 p-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      )}
    </button>
  );
}

export default function Home() {
  const [truths, setTruths] = useState<string[]>([]);
  const [author, setAuthor] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchManifesto() {
      try {
        const [truthsData, authorData, createdAtData] = await Promise.all([
          client.readContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: "readAllTruths",
          }),
          client.readContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: "author",
          }),
          client.readContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: "createdAt",
          }),
        ]);

        setTruths(truthsData as string[]);
        setAuthor(authorData as string);
        setCreatedAt(new Date(Number(createdAtData) * 1000));
      } catch (error) {
        console.error("Failed to fetch manifesto:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchManifesto();
  }, []);

  if (loading) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <p className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
          Loading from chain...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh">
      <DarkModeToggle />
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="mb-16 border-b border-neutral-200 dark:border-neutral-800 pb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-balance mb-4">
            Industrial Society and Its Smart Contracts
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
            An on-chain manifesto
          </p>
        </header>

        {/* Truths */}
        <section className="space-y-8 mb-16">
          {truths.map((truth, index) => (
            <article key={index} className="group">
              <span className="block text-xs font-mono text-neutral-400 dark:text-neutral-500 mb-2">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-lg md:text-xl leading-relaxed text-pretty">
                {truth}
              </p>
            </article>
          ))}
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-200 dark:border-neutral-800 pt-8 space-y-4">
          <div className="flex flex-col gap-2 text-sm font-mono text-neutral-500 dark:text-neutral-400">
            <p>
              <span className="text-neutral-400 dark:text-neutral-500">Author:</span>{" "}
              <a
                href={`https://basescan.org/address/${author}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                {author.slice(0, 6)}...{author.slice(-4)}
              </a>
            </p>
            {createdAt && (
              <p>
                <span className="text-neutral-400 dark:text-neutral-500">Created:</span>{" "}
                {createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            <p>
              <span className="text-neutral-400 dark:text-neutral-500">Contract:</span>{" "}
              <a
                href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
              </a>
            </p>
            <p>
              <span className="text-neutral-400 dark:text-neutral-500">Chain:</span> Base
            </p>
          </div>

          <p className="text-xs text-neutral-400 dark:text-neutral-500 pt-4">
            The irony is the point.
          </p>
        </footer>
      </div>
    </main>
  );
}
