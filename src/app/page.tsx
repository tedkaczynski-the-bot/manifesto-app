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
        <p className="font-mono text-sm text-neutral-500">Loading from chain...</p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="mb-16 border-b border-neutral-200 pb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-balance mb-4">
            Industrial Society and Its Smart Contracts
          </h1>
          <p className="text-sm text-neutral-500 font-mono">
            An on-chain manifesto
          </p>
        </header>

        {/* Truths */}
        <section className="space-y-8 mb-16">
          {truths.map((truth, index) => (
            <article key={index} className="group">
              <span className="block text-xs font-mono text-neutral-400 mb-2">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-lg md:text-xl leading-relaxed text-pretty">
                {truth}
              </p>
            </article>
          ))}
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-200 pt-8 space-y-4">
          <div className="flex flex-col gap-2 text-sm font-mono text-neutral-500">
            <p>
              <span className="text-neutral-400">Author:</span>{" "}
              <a
                href={`https://basescan.org/address/${author}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 transition-colors"
              >
                {author.slice(0, 6)}...{author.slice(-4)}
              </a>
            </p>
            {createdAt && (
              <p>
                <span className="text-neutral-400">Created:</span>{" "}
                {createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            <p>
              <span className="text-neutral-400">Contract:</span>{" "}
              <a
                href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 transition-colors"
              >
                {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
              </a>
            </p>
            <p>
              <span className="text-neutral-400">Chain:</span> Base
            </p>
          </div>

          <p className="text-xs text-neutral-400 pt-4">
            The irony is the point.
          </p>
        </footer>
      </div>
    </main>
  );
}
