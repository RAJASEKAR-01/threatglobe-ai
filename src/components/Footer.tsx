"use client";

import React from "react";
import { ShieldCheck, Lock, Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-tg-surface border-t border-tg-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-tg-accent" />
            <span
              className="text-sm font-medium text-tg-text"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              ThreatGlobe AI
            </span>
          </div>
          <p
            className="text-sm text-tg-muted max-w-md leading-relaxed"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            Scrubbing real-time global telemetry, correlating MITRE ATT&CK kill-chains, and
            generating autonomous defense countermeasure playbooks.
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div
            className="flex items-center gap-1.5 text-tg-muted bg-tg-bg px-3 py-1.5 rounded border border-tg-border text-xs"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <Lock className="w-3.5 h-3.5" />
            Zero client key exposure
          </div>
          <div
            className="flex items-center gap-1.5 text-tg-muted bg-tg-bg px-3 py-1.5 rounded border border-tg-border text-xs"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <Cpu className="w-3.5 h-3.5" />
            Gemini 2.5 Flash backbone
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-7xl mx-auto mt-8 pt-6 border-t border-tg-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-tg-muted"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div>
          Next.js · React Three Fiber · Drei · GSAP ScrollTrigger · Lenis · Tailwind
        </div>
        <div>
          © {new Date().getFullYear()} ThreatGlobe AI. All geospatial telemetry encrypted.
        </div>
      </div>
    </footer>
  );
}
