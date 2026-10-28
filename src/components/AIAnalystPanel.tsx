"use client";

import React, { useEffect, useState } from "react";
import { ThreatAttack, AIAnalysisResponse } from "@/types";
import { SEVERITY_COLORS } from "@/lib/utils";
import {
  X,
  Cpu,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Copy,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Flame,
} from "lucide-react";

interface AIAnalystPanelProps {
  attack: ThreatAttack | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAnalystPanel({ attack, isOpen, onClose }: AIAnalystPanelProps) {
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);

  const runAnalysis = async (targetAttack: ThreatAttack) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setLoadingStep(0);

    const s1 = setTimeout(() => setLoadingStep(1), 500);
    const s2 = setTimeout(() => setLoadingStep(2), 1100);
    const s3 = setTimeout(() => setLoadingStep(3), 1700);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attack: targetAttack }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const data: AIAnalysisResponse = await res.json();
      setAnalysis(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Analysis request failed";
      setError(msg);
    } finally {
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(s3);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (attack && isOpen) {
      runAnalysis(attack);
    }
  }, [attack?.id, isOpen]);

  const copyPlaybook = () => {
    if (!analysis) return;
    const text = `THREAT REPORT: ${attack?.type} (${attack?.severity})
Source: ${attack?.source.city}, ${attack?.source.country}
Target: ${attack?.target.city}, ${attack?.target.country}
Port: ${attack?.port}/${attack?.protocol} | Rate: ${attack?.packetRate} | Throughput: ${attack?.bandwidth}

ANALYSIS SUMMARY:
${analysis.summary}

LIKELY TECHNIQUE:
${analysis.likely_attacker_technique}

DEFENSE STEPS:
1. ${analysis.defense_steps[0]}
2. ${analysis.defense_steps[1]}
3. ${analysis.defense_steps[2]}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !attack) return null;

  const sevStyle = SEVERITY_COLORS[attack.severity] || SEVERITY_COLORS.Medium;
  const isHighSev = attack.severity === "High" || attack.severity === "Critical";

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-tg-surface border-l border-tg-border flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-tg-border flex items-center justify-between bg-tg-bg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded border border-tg-border bg-tg-surface">
            <Cpu className="w-4 h-4 text-tg-accent" />
          </div>
          <div>
            <div
              className="text-[10px] text-tg-muted uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Gemini AI Threat Analyst
            </div>
            <h3
              className="text-base font-medium text-tg-text"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              <span style={{ color: isHighSev ? "#FF5A36" : "#EDE9E3" }}>
                {attack.type}
              </span>{" "}
              Trajectory Incident
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => runAnalysis(attack)}
            disabled={loading}
            title="Re-run AI Analysis"
            className="p-2 rounded border border-tg-border text-tg-muted hover:text-tg-text transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded border border-tg-border text-tg-muted hover:text-tg-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick telemetry banner */}
      <div
        className="px-5 py-3 bg-tg-bg border-b border-tg-border grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div>
          <span className="text-tg-muted block text-[10px] uppercase">Origin</span>
          <span className="text-tg-text font-medium truncate block">{attack.source.city}</span>
          <span className="text-tg-muted text-[10px]">{attack.source.countryCode}</span>
        </div>
        <div>
          <span className="text-tg-muted block text-[10px] uppercase">Target</span>
          <span className="text-tg-text font-medium truncate block">{attack.target.city}</span>
          <span className="text-tg-muted text-[10px]">{attack.target.countryCode}</span>
        </div>
        <div>
          <span className="text-tg-muted block text-[10px] uppercase">Severity</span>
          <span
            className={`inline-block px-2 py-0.5 mt-0.5 rounded text-[10px] font-semibold border ${sevStyle.bg} ${sevStyle.text} ${sevStyle.border}`}
          >
            {attack.severity}
          </span>
        </div>
        <div>
          <span className="text-tg-muted block text-[10px] uppercase">Load</span>
          <span className="text-tg-text font-medium block">{attack.bandwidth}</span>
          <span className="text-tg-muted text-[10px]">{attack.packetRate}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Loading */}
        {loading && (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-t-tg-accent border-r-tg-accent border-b-tg-border border-l-tg-border animate-spin" />
              <Cpu className="w-5 h-5 text-tg-muted absolute" />
            </div>

            <div
              className="space-y-1 text-xs"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <p className="text-tg-text font-semibold mb-2">Synthesising threat intelligence</p>
              {[
                `Intercepting packet telemetry on port ${attack.port}…`,
                "Transmitting vector profile to Gemini AI…",
                "Correlating MITRE ATT&CK techniques…",
                "Formulating mitigation countermeasures…",
              ].map((msg, i) => (
                <p
                  key={i}
                  className={loadingStep >= i ? "text-tg-text" : "text-tg-muted opacity-30"}
                >
                  ▸ {msg}
                </p>
              ))}
            </div>

            <div className="w-full space-y-2 pt-2">
              <div className="h-12 bg-tg-bg rounded border border-tg-border animate-pulse" />
              <div className="h-20 bg-tg-bg rounded border border-tg-border animate-pulse" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="p-4 rounded border border-tg-accent/40 bg-tg-accent/5 space-y-3">
            <div className="flex items-center gap-2 text-tg-accent">
              <AlertTriangle className="w-4 h-4" />
              <span
                className="font-semibold text-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Analysis failed
              </span>
            </div>
            <p
              className="text-xs text-tg-muted leading-relaxed"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {error}
            </p>
            <button
              onClick={() => runAnalysis(attack)}
              className="px-3 py-1.5 rounded border border-tg-accent text-tg-accent text-xs flex items-center gap-1.5 hover:bg-tg-accent/10 transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Analysis */}
        {analysis && !loading && (
          <div className="space-y-4">
            {/* Source indicator */}
            <div
              className="flex items-center justify-between text-xs px-3 py-2 rounded border border-tg-border bg-tg-bg"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span className="flex items-center gap-1.5 text-tg-text">
                <CheckCircle2 className="w-3.5 h-3.5 text-tg-accent" />
                {analysis.isLiveGemini ? "Gemini 2.5 Flash" : "Heuristic engine"}
              </span>
              <span className="text-tg-muted">
                {new Date(analysis.analyzedAt).toLocaleTimeString()}
              </span>
            </div>

            {/* Summary */}
            <div className="p-4 rounded border border-tg-border bg-tg-bg space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] text-tg-muted uppercase tracking-wider flex items-center gap-1.5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <Flame className="w-3 h-3 text-tg-accent" /> Threat actor assessment
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${sevStyle.bg} ${sevStyle.text} ${sevStyle.border}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  RISK: {analysis.risk_level}
                </span>
              </div>
              <p
                className="text-sm text-tg-text leading-relaxed"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {analysis.summary}
              </p>
            </div>

            {/* Technique */}
            <div className="p-4 rounded border border-tg-border bg-tg-bg space-y-1.5">
              <span
                className="text-[10px] text-tg-muted uppercase tracking-wider flex items-center gap-1.5"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <Terminal className="w-3 h-3" /> Likely adversary technique
              </span>
              <p
                className="text-sm text-tg-text font-medium"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {analysis.likely_attacker_technique}
              </p>
            </div>

            {/* Defense steps */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] text-tg-muted uppercase tracking-wider flex items-center gap-1.5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Countermeasure steps
                </span>
                <span
                  className="text-[10px] text-tg-muted uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Prioritised playbook
                </span>
              </div>

              {analysis.defense_steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded border border-tg-border bg-tg-bg hover:border-tg-muted transition-colors flex items-start gap-3"
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded border border-tg-border text-tg-muted text-xs font-semibold flex items-center justify-center"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p
                    className="text-sm text-tg-text leading-relaxed"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Raw telemetry */}
            <div
              className="p-4 rounded border border-tg-border bg-tg-bg text-xs space-y-2"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span className="text-tg-muted block uppercase tracking-wider text-[10px]">
                Raw telemetry signature
              </span>
              <div className="grid grid-cols-2 gap-2 text-tg-muted">
                <div>
                  <span className="text-tg-muted">Port:</span>{" "}
                  <span className="text-tg-text">{attack.port} ({attack.protocol})</span>
                </div>
                <div>
                  <span className="text-tg-muted">Incident ID:</span>{" "}
                  <span className="text-tg-text">{attack.id}</span>
                </div>
                <div>
                  <span className="text-tg-muted">Origin:</span>{" "}
                  <span className="text-tg-text">
                    {attack.source.lat.toFixed(2)}°, {attack.source.lng.toFixed(2)}°
                  </span>
                </div>
                <div>
                  <span className="text-tg-muted">Target:</span>{" "}
                  <span className="text-tg-text">
                    {attack.target.lat.toFixed(2)}°, {attack.target.lng.toFixed(2)}°
                  </span>
                </div>
                {attack.cve && (
                  <div className="col-span-2">
                    <span className="text-tg-muted">CVE:</span>{" "}
                    <span className="text-tg-accent font-semibold">{attack.cve}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="p-4 bg-tg-bg border-t border-tg-border flex items-center justify-between">
        <button
          onClick={copyPlaybook}
          disabled={!analysis}
          className="px-3.5 py-2 rounded border border-tg-border bg-tg-surface text-tg-muted hover:text-tg-text text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-tg-accent" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy report
            </>
          )}
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded border border-tg-accent bg-tg-accent text-white text-xs font-medium flex items-center gap-1.5 hover:bg-[#e04e2d] transition-colors"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          Back to globe <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
