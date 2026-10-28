"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import EarthSphere from "./EarthSphere";
import AttackArcs from "./AttackArcs";
import AIAnalystPanel from "./AIAnalystPanel";
import { ThreatAttack, AttackType } from "@/types";
import { getInitialAttacks, generateRandomAttack } from "@/lib/geoData";
import { ATTACK_TYPE_COLORS, SEVERITY_COLORS } from "@/lib/utils";
import { Globe, Play, Pause, Filter } from "lucide-react";

// Shape legend for each attack type
const ATTACK_SHAPES: Record<AttackType, string> = {
  DDoS:       "● thick",
  Ransomware: "● medium",
  Malware:    "● thin",
  Phishing:   "● hairline",
};

export default function ThreatGlobe() {
  const [attacks, setAttacks] = useState<ThreatAttack[]>([]);
  const [selectedAttack, setSelectedAttack] = useState<ThreatAttack | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<AttackType | "ALL">("ALL");
  const [isStreamPaused, setIsStreamPaused] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  useEffect(() => {
    setAttacks(getInitialAttacks(7));
  }, []);

  useEffect(() => {
    if (isStreamPaused) return;
    const interval = setInterval(() => {
      setAttacks((prev) => {
        const newAttack = generateRandomAttack();
        return [...prev.slice(-7), newAttack];
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [isStreamPaused]);

  const handleSelectAttack = (attack: ThreatAttack) => {
    setSelectedAttack(attack);
    setIsPanelOpen(true);
    setAutoRotate(false);
  };

  const filteredAttacks =
    activeFilter === "ALL"
      ? attacks
      : attacks.filter((a) => a.type === activeFilter);

  const filters: (AttackType | "ALL")[] = ["ALL", "DDoS", "Phishing", "Malware", "Ransomware"];

  return (
    <section
      id="threat-globe"
      className="relative w-full min-h-screen bg-tg-bg py-20 px-4 sm:px-6 lg:px-8 flex flex-col"
    >
      {/* Section header */}
      <div className="max-w-7xl mx-auto w-full mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-tg-border pb-8">
          <div>
            <div
              className="text-xs text-tg-muted uppercase tracking-widest mb-3"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Interactive 3D Threat Globe
            </div>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl text-tg-text leading-none"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Live Threat <span className="text-tg-accent italic">Matrix</span>
            </h2>
            <p
              className="mt-3 text-tg-muted text-sm sm:text-base max-w-xl leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Real-time geospatial adversarial telemetry. Click any arc to dispatch the Gemini AI analyst.
            </p>
          </div>

          {/* Controls */}
          <div
            className="flex flex-wrap items-center gap-2 text-xs"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <button
              onClick={() => setIsStreamPaused(!isStreamPaused)}
              className="px-3 py-1.5 rounded border border-tg-border bg-tg-surface text-tg-muted hover:text-tg-text flex items-center gap-1.5 transition-colors"
            >
              {isStreamPaused ? (
                <><Play className="w-3.5 h-3.5" /> Resume</>
              ) : (
                <><Pause className="w-3.5 h-3.5" /> Pause</>
              )}
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="px-3 py-1.5 rounded border border-tg-border bg-tg-surface text-tg-muted hover:text-tg-text flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {autoRotate ? "Auto-rotate" : "Manual"}
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div
          className="mt-5 flex flex-wrap items-center gap-2 text-xs"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span className="text-tg-muted flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {filters.map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded border transition-all duration-150 flex items-center gap-1.5 ${
                  isSelected
                    ? "border-tg-accent text-tg-accent bg-tg-surface"
                    : "border-tg-border text-tg-muted bg-tg-bg hover:border-tg-muted"
                }`}
              >
                {filter !== "ALL" && (
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: ATTACK_TYPE_COLORS[filter as AttackType] }}
                  />
                )}
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Globe container */}
      <div className="relative max-w-7xl mx-auto w-full h-[600px] sm:h-[660px] lg:h-[700px] rounded-lg bg-tg-bg border border-tg-border overflow-hidden">

        {/* Top-left telemetry overlay */}
        <div
          className="absolute top-4 left-4 z-20 pointer-events-none hidden sm:block text-xs space-y-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <div className="px-3 py-2 rounded border border-tg-border bg-tg-surface/90 space-y-0.5">
            <div className="text-tg-muted text-[10px] uppercase">Telemetry</div>
            <div className="text-tg-text font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-tg-accent inline-block" />
              18,490 EPS
              <span className="text-tg-muted font-normal text-[10px]">/ global</span>
            </div>
          </div>
          <div className="px-3 py-2 rounded border border-tg-border bg-tg-surface/90">
            <div className="text-tg-muted text-[10px] uppercase">Active arcs</div>
            <div className="text-tg-text font-semibold">{filteredAttacks.length}</div>
          </div>
        </div>

        {/* Top-right hint */}
        <div
          className="absolute top-4 right-4 z-20 px-3 py-2 rounded border border-tg-border bg-tg-surface/90 text-xs text-tg-muted"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Click an arc → AI analysis
        </div>

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 0, 6.2], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.0} color="#ffffff" />
          <pointLight position={[-8, -8, -8]} intensity={0.3} color="#EDE9E3" />

          <Suspense fallback={null}>
            <EarthSphere radius={2.6} />
            <AttackArcs
              attacks={filteredAttacks}
              radius={2.6}
              selectedAttackId={selectedAttack?.id}
              onSelectAttack={handleSelectAttack}
            />
          </Suspense>

          <OrbitControls
            enablePan={false}
            minDistance={4.2}
            maxDistance={8.5}
            enableDamping
            dampingFactor={0.05}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
          />
        </Canvas>

        {/* Attack ticker */}
        <div className="absolute bottom-0 inset-x-0 z-20 bg-tg-surface/95 border-t border-tg-border p-3 sm:p-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            <div
              className="flex-shrink-0 flex items-center gap-2 text-xs text-tg-muted"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-tg-accent inline-block" />
              <span className="text-tg-text font-semibold">Live intercepts</span>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto">
              {attacks.slice(-5).reverse().map((atk) => {
                const isHighSev = atk.severity === "High" || atk.severity === "Critical";
                const dotColor = isHighSev ? "#FF5A36" : ATTACK_TYPE_COLORS[atk.type];
                const sev = SEVERITY_COLORS[atk.severity];
                const isSelected = selectedAttack?.id === atk.id;
                return (
                  <button
                    key={atk.id}
                    onClick={() => handleSelectAttack(atk)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded border text-left text-xs flex items-center gap-2 transition-all ${
                      isSelected
                        ? "border-tg-accent bg-tg-surface text-tg-text"
                        : "border-tg-border bg-tg-bg text-tg-muted hover:border-tg-muted hover:text-tg-text"
                    }`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: dotColor }}
                    />
                    <span className="font-semibold text-tg-text">{atk.type}</span>
                    <span className="text-tg-muted hidden sm:inline">
                      {atk.source.countryCode} → {atk.target.countryCode}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${sev.bg} ${sev.text} ${sev.border}`}
                    >
                      {atk.severity}
                    </span>
                    <span className="text-tg-muted text-[10px] hidden md:inline">
                      {atk.bandwidth}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Attack type legend */}
      <div className="max-w-7xl mx-auto w-full mt-5">
        <div
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-tg-muted"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span className="uppercase tracking-wider">Arc shapes:</span>
          {(["DDoS", "Ransomware", "Malware", "Phishing"] as AttackType[]).map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: ATTACK_TYPE_COLORS[t] }}
              />
              {t} — {ATTACK_SHAPES[t]}
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-tg-accent" />
            High / Critical severity always in orange
          </span>
        </div>
      </div>

      {/* AI Analyst Panel */}
      <AIAnalystPanel
        attack={selectedAttack}
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
          setAutoRotate(true);
        }}
      />
    </section>
  );
}
