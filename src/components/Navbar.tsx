"use client";

import React, { useState, useEffect } from "react";
import { Shield, EyeOff, Eye } from "lucide-react";

interface NavbarProps {
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export default function Navbar({ reducedMotion, onToggleReducedMotion }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-tg-bg/95 border-b border-tg-border py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="p-1.5 rounded border border-tg-border bg-tg-surface text-tg-accent">
            <Shield className="w-4 h-4" />
          </div>
          <span
            className="text-sm font-semibold tracking-tight text-tg-text"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            ThreatGlobe <span className="text-tg-accent">AI</span>
          </span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm text-tg-muted hover:text-tg-text transition-colors"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            Overview
          </button>
          <button
            onClick={() => scrollTo("threat-globe")}
            className="text-sm text-tg-muted hover:text-tg-text transition-colors"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            Threat Globe
          </button>
          <button
            onClick={() => scrollTo("telemetry-stats")}
            className="text-sm text-tg-muted hover:text-tg-text transition-colors"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            Telemetry
          </button>
        </nav>

        {/* Reduced Motion Toggle */}
        <button
          onClick={onToggleReducedMotion}
          title={reducedMotion ? "Enable full animations" : "Enable reduced motion"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-tg-border bg-tg-surface text-tg-muted hover:text-tg-text transition-colors text-xs"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {reducedMotion ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Motion off</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Motion on</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
