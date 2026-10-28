"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BarChart3, Globe2, Shield, Zap, TrendingUp, Server, Clock, Cpu } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface StatsSectionProps {
  reducedMotion?: boolean;
}

export default function StatsSection({ reducedMotion = false }: StatsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<"1h" | "24h" | "7d">("24h");

  const attackTypes = [
    {
      name: "DDoS & Volumetric Floods",
      type: "DDoS",
      percentage: timeframe === "1h" ? 48 : timeframe === "24h" ? 42 : 39,
      events: timeframe === "1h" ? "14.2k" : timeframe === "24h" ? "148.6k" : "1.2M",
      barColor: "#EDE9E3",
    },
    {
      name: "Ransomware & Double Extortion",
      type: "Ransomware",
      percentage: timeframe === "1h" ? 24 : timeframe === "24h" ? 28 : 31,
      events: timeframe === "1h" ? "6.8k" : timeframe === "24h" ? "98.2k" : "840k",
      barColor: "#FF5A36",
    },
    {
      name: "Phishing & AiTM Token Theft",
      type: "Phishing",
      percentage: timeframe === "1h" ? 18 : timeframe === "24h" ? 18 : 17,
      events: timeframe === "1h" ? "5.1k" : timeframe === "24h" ? "63.5k" : "510k",
      barColor: "#8A8A90",
    },
    {
      name: "Polymorphic Malware & C2",
      type: "Malware",
      percentage: timeframe === "1h" ? 10 : timeframe === "24h" ? 12 : 13,
      events: timeframe === "1h" ? "2.9k" : timeframe === "24h" ? "42.1k" : "390k",
      barColor: "#C4BEB6",
    },
  ];

  const regions = [
    { name: "North America (US-East / West)", percentage: 38, blocked: "1.42B pkts", trend: "+12.4%" },
    { name: "Asia-Pacific (APAC / East Asia)",  percentage: 28, blocked: "980M pkts",  trend: "+18.1%" },
    { name: "European Union (Frankfurt / London)", percentage: 21, blocked: "740M pkts", trend: "-3.2%"  },
    { name: "Latin America (São Paulo / Bogotá)", percentage: 8,  blocked: "280M pkts", trend: "+5.7%"  },
    { name: "Middle East & Africa (MEA)",         percentage: 5,  blocked: "160M pkts", trend: "+9.2%"  },
  ];

  useEffect(() => {
    if (!containerRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".stat-bar-fill", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });

      gsap.from(".stat-card", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion, timeframe]);

  return (
    <section
      ref={containerRef}
      id="telemetry-stats"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-tg-bg border-t border-tg-border"
    >
      <div className="relative z-10 max-w-7xl mx-auto space-y-14">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-tg-border pb-10">
          <div>
            <div
              className="text-xs text-tg-muted uppercase tracking-widest mb-3 flex items-center gap-1.5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <TrendingUp className="w-3.5 h-3.5" /> Empirical threat intelligence
            </div>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl text-tg-text leading-none"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Aggregated Threat <span className="text-tg-accent italic">Metrics</span>
            </h2>
            <p
              className="mt-3 text-tg-muted text-sm sm:text-base max-w-xl leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Dynamic telemetric distribution across global autonomous systems, threat
              classifications, and high-frequency target clusters.
            </p>
          </div>

          {/* Timeframe selector */}
          <div
            className="flex items-center gap-1 bg-tg-surface p-1 rounded border border-tg-border text-xs"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="text-tg-muted px-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Window:
            </span>
            {(["1h", "24h", "7d"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded transition-all font-semibold ${
                  timeframe === t
                    ? "bg-tg-accent text-white"
                    : "text-tg-muted hover:text-tg-text"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <Shield className="w-4 h-4 text-tg-accent" />,
              label: "Threat DEFCON",
              value: "DEFCON 2",
              sub: "High readiness",
            },
            {
              icon: <Zap className="w-4 h-4 text-tg-text" />,
              label: "Intercept Rate",
              value: "99.96%",
              sub: "Zero-packet egress loss",
            },
            {
              icon: <Server className="w-4 h-4 text-tg-muted" />,
              label: "Global Sensors",
              value: "54,290",
              sub: "Active BGP peering fabrics",
            },
            {
              icon: <Cpu className="w-4 h-4 text-tg-muted" />,
              label: "Gemini Triage",
              value: "184 ms",
              sub: "Structured JSON playbook latency",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="stat-card p-5 rounded-lg bg-tg-surface border border-tg-border"
            >
              <div
                className="text-[10px] uppercase tracking-wider text-tg-muted mb-1.5 flex items-center gap-1.5"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {card.icon} {card.label}
              </div>
              <div
                className="text-2xl sm:text-3xl font-semibold text-tg-text"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {card.value}
              </div>
              <div
                className="text-[11px] text-tg-muted mt-1.5"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {card.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attack types */}
          <div className="stat-card p-6 sm:p-8 rounded-lg bg-tg-surface border border-tg-border">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-tg-muted" />
                <h3
                  className="text-lg font-semibold text-tg-text"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Top Attack Vectors
                </h3>
              </div>
              <span
                className="text-[10px] text-tg-muted uppercase tracking-wider"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                By volume
              </span>
            </div>

            <div className="space-y-6">
              {attackTypes.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div
                    className="flex items-center justify-between text-xs"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    <span className="text-tg-text flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.barColor }}
                      />
                      {item.name}
                    </span>
                    <div className="flex items-center gap-3 text-tg-muted">
                      <span>{item.events}</span>
                      <span
                        className="font-semibold"
                        style={{ color: item.barColor }}
                      >
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-tg-bg rounded-full overflow-hidden border border-tg-border">
                    <div
                      className="stat-bar-fill h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.barColor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-8 pt-4 border-t border-tg-border flex items-center justify-between text-[10px] text-tg-muted uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span>Source: Distributed BGP packet sniffers</span>
              <span className="text-tg-accent">Updated real-time</span>
            </div>
          </div>

          {/* Targeted regions */}
          <div className="stat-card p-6 sm:p-8 rounded-lg bg-tg-surface border border-tg-border">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-tg-muted" />
                <h3
                  className="text-lg font-semibold text-tg-text"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Top Targeted Regions
                </h3>
              </div>
              <span
                className="text-[10px] text-tg-muted uppercase tracking-wider"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Geopolitical trajectory
              </span>
            </div>

            <div className="space-y-3">
              {regions.map((region, idx) => (
                <div
                  key={region.name}
                  className="p-3.5 rounded border border-tg-border bg-tg-bg hover:border-tg-muted transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <div
                      className="text-sm text-tg-text font-medium"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {region.name}
                    </div>
                    <div
                      className="text-xs text-tg-muted flex items-center gap-3"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      <span>
                        Mitigated:{" "}
                        <strong className="text-tg-text">{region.blocked}</strong>
                      </span>
                      <span
                        className={
                          region.trend.startsWith("+")
                            ? "text-tg-accent"
                            : "text-tg-muted"
                        }
                      >
                        {region.trend}
                      </span>
                    </div>
                  </div>
                  <div
                    className="text-right flex-shrink-0 text-lg font-semibold text-tg-text"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {region.percentage}%
                    <div className="text-[10px] text-tg-muted font-normal uppercase">
                      of traffic
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-6 pt-4 border-t border-tg-border flex items-center justify-between text-[10px] text-tg-muted uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span>Target region clustering: active</span>
              <span>Tier-1 ASNs protected</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
