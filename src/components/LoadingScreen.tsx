"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, Check } from "lucide-react";

interface LoadingScreenProps {
  progress: number;
  isReady: boolean;
  onEnter: () => void;
}

export default function LoadingScreen({ progress, isReady, onEnter }: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState<number>(0);
  const [bootStep, setBootStep] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < progress) return prev + 1;
        if (isReady && prev < 100) return prev + 1;
        return prev;
      });
    }, 15);
    return () => clearInterval(timer);
  }, [progress, isReady]);

  useEffect(() => {
    if (displayProgress > 20) setBootStep(1);
    if (displayProgress > 50) setBootStep(2);
    if (displayProgress > 80) setBootStep(3);
    if (displayProgress >= 100) setBootStep(4);
  }, [displayProgress]);

  return (
    <div className="fixed inset-0 z-50 bg-tg-bg flex flex-col items-center justify-center p-6 select-none">
      {/* Center Boot Box */}
      <div className="w-full max-w-sm p-8 rounded-lg bg-tg-surface border border-tg-border flex flex-col items-center text-center space-y-7">
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center rounded-full border border-tg-border bg-tg-bg">
          <ShieldAlert className="w-7 h-7 text-tg-accent" />
        </div>

        {/* Branding */}
        <div>
          <h1
            className="text-3xl text-tg-text"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            ThreatGlobe <span className="text-tg-accent">AI</span>
          </h1>
          <p
            className="text-xs text-tg-muted mt-1 tracking-wider uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Planetary Defense Platform
          </p>
        </div>

        {/* Progress */}
        <div className="w-full space-y-2">
          <div
            className="flex justify-between items-center text-xs text-tg-muted"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span>Initialising</span>
            <span className="text-tg-text font-semibold">{displayProgress}%</span>
          </div>
          <div className="h-1 w-full bg-tg-bg rounded-full overflow-hidden border border-tg-border">
            <div
              className="h-full bg-tg-accent transition-all duration-200 rounded-full"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>

        {/* Boot Log */}
        <div
          className="w-full text-left text-[11px] text-tg-muted space-y-1.5 bg-tg-bg p-3 rounded border border-tg-border"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <div className={bootStep >= 1 ? "text-tg-text" : "opacity-30"}>
            [01] Loading geospatial frames{bootStep >= 1 && " ✓"}
          </div>
          <div className={bootStep >= 2 ? "text-tg-text" : "opacity-30"}>
            [02] Initialising 3D earth mesh{bootStep >= 2 && " ✓"}
          </div>
          <div className={bootStep >= 3 ? "text-tg-text" : "opacity-30"}>
            [03] Connecting Gemini AI endpoint{bootStep >= 3 && " ✓"}
          </div>
          <div className={bootStep >= 4 ? "text-tg-accent font-semibold" : "opacity-30"}>
            [04] Ready{bootStep >= 4 && " ✓"}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onEnter}
          disabled={displayProgress < 85}
          className={`w-full py-2.5 px-4 rounded border text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            displayProgress >= 85
              ? "bg-tg-accent border-tg-accent text-white hover:bg-[#e04e2d] cursor-pointer"
              : "bg-tg-bg border-tg-border text-tg-muted cursor-not-allowed"
          }`}
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          {displayProgress >= 85 ? (
            <>
              Enter <Check className="w-4 h-4" />
            </>
          ) : (
            "Loading…"
          )}
        </button>
      </div>
    </div>
  );
}
