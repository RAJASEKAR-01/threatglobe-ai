"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldAlert, Cpu, Activity, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface HeroScrubCanvasProps {
  onPreloadProgress?: (progress: number) => void;
  onPreloadComplete?: () => void;
  reducedMotion?: boolean;
}

export default function HeroScrubCanvas({
  onPreloadProgress,
  onPreloadComplete,
  reducedMotion = false,
}: HeroScrubCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headline1Ref = useRef<HTMLDivElement>(null);
  const headline2Ref = useRef<HTMLDivElement>(null);
  const headline3Ref = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [totalFrames, setTotalFrames] = useState<number>(150);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setTotalFrames(mobile ? 100 : 150);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const count = isMobile ? 100 : 150;
    const folder = isMobile ? "/frames-mobile" : "/frames";
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    imagesRef.current = images;

    for (let i = 1; i <= count; i++) {
      const img = new Image();
      const paddedNum = String(i).padStart(4, "0");
      img.src = `${folder}/f_${paddedNum}.webp`;

      img.onload = () => {
        loaded++;
        const percent = Math.floor((loaded / count) * 100);
        onPreloadProgress?.(percent);
        if (i === 1 && canvasRef.current) {
          drawFrame(img);
        }
        if (loaded === count) {
          onPreloadComplete?.();
          ScrollTrigger.refresh();
        }
      };

      img.onerror = () => {
        loaded++;
        if (loaded === count) {
          onPreloadComplete?.();
          ScrollTrigger.refresh();
        }
      };

      images.push(img);
    }
  }, [isMobile, onPreloadProgress, onPreloadComplete]);

  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    const imgRatio = img.naturalWidth / img.naturalHeight || 16 / 9;
    const canvasRatio = width / height;
    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;
    if (canvasRatio > imgRatio) {
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    const currentImg = imagesRef.current[currentFrameRef.current];
    if (currentImg) {
      drawFrame(currentImg);
    }
  }, [drawFrame]);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const ctx = gsap.context(() => {
      const maxFrameIndex = totalFrames - 1;

      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300vh",
          pin: true,
          scrub: reducedMotion ? false : 0.4,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (reducedMotion) return;
            const targetFrame = Math.round(self.progress * maxFrameIndex);
            if (targetFrame !== currentFrameRef.current) {
              currentFrameRef.current = targetFrame;
              const img = imagesRef.current[targetFrame];
              if (img && img.complete) {
                drawFrame(img);
              }
            }
          },
        },
      });

      if (!reducedMotion) {
        scrubTl.fromTo(
          canvasRef.current,
          { scale: 1.0 },
          { scale: 1.4, ease: "none", duration: 1 },
          0
        );
      }

      scrubTl.fromTo(
        headline1Ref.current,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -30, ease: "power2.inOut", duration: 0.08 },
        0.22
      );

      scrubTl.fromTo(
        headline2Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.08 },
        0.34
      );
      scrubTl.to(
        headline2Ref.current,
        { opacity: 0, y: -30, ease: "power2.in", duration: 0.08 },
        0.58
      );

      scrubTl.fromTo(
        headline3Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.08 },
        0.68
      );
      scrubTl.to(
        headline3Ref.current,
        { opacity: 0, y: -20, ease: "power2.in", duration: 0.06 },
        0.92
      );
    }, containerRef);

    return () => ctx.revert();
  }, [totalFrames, drawFrame, reducedMotion]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-tg-bg flex items-center justify-center"
    >
      {/* Scrubbing Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover transition-transform will-change-transform"
      />

      {/* Dark vignette fade — top and bottom only, no gradient colors */}
      <div className="absolute inset-0 bg-gradient-to-t from-tg-bg via-transparent to-tg-bg/60 pointer-events-none" />

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between pt-24 pb-8 px-6 sm:px-10 pointer-events-none z-10">
        {/* Top status strip — minimal */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-tg-border bg-tg-surface/80 text-tg-muted text-[11px]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-tg-accent inline-block" />
            LIVE · {totalFrames} frames
          </div>
        </div>

        {/* Center Storytelling Text */}
        <div className="relative w-full max-w-4xl mx-auto text-center px-4 my-auto">
          {/* Story Milestone 1 */}
          <div
            ref={headline1Ref}
            className="flex flex-col items-center justify-center pointer-events-auto"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded border border-tg-border bg-tg-surface/80 text-tg-muted text-xs"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <ShieldAlert className="w-3 h-3 text-tg-accent" />
              Global threat monitoring active
            </div>
            <h1
              className="text-5xl sm:text-7xl md:text-8xl text-tg-text leading-none"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              ThreatGlobe <span className="text-tg-accent italic">AI</span>
            </h1>
            <p
              className="mt-5 max-w-xl text-tg-muted text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Real-time autonomous cyber defense. Scrubbing global threat vectors,
              MITRE ATT&CK kill-chains, and planetary telemetry at machine speed.
            </p>
            <div
              className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs text-tg-muted"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span className="px-2.5 py-1 rounded border border-tg-border bg-tg-surface/70">
                100k+ events/sec
              </span>
              <span className="px-2.5 py-1 rounded border border-tg-border bg-tg-surface/70">
                Gemini-powered triage
              </span>
              <span className="px-2.5 py-1 rounded border border-tg-border bg-tg-surface/70">
                18 global backbones
              </span>
            </div>
          </div>

          {/* Story Milestone 2 */}
          <div
            ref={headline2Ref}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto opacity-0"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded border border-tg-border bg-tg-surface/80 text-tg-muted text-xs"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <Activity className="w-3 h-3 text-tg-accent" />
              Geospatial attack vectors
            </div>
            <h2
              className="text-4xl sm:text-6xl md:text-7xl text-tg-text leading-none"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Planetary Threat <span className="text-tg-accent italic">Telemetry</span>
            </h2>
            <p
              className="mt-5 max-w-xl text-tg-muted text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Monitoring DDoS floods, ransomware staging, phishing AiTM reverse-proxies,
              and polymorphic payloads across borders.
            </p>
          </div>

          {/* Story Milestone 3 */}
          <div
            ref={headline3Ref}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto opacity-0"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded border border-tg-border bg-tg-surface/80 text-tg-muted text-xs"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <Cpu className="w-3 h-3 text-tg-accent" />
              Autonomous triage core
            </div>
            <h2
              className="text-4xl sm:text-6xl md:text-7xl text-tg-text leading-none"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Cognitive Incident <span className="text-tg-accent italic">Synthesis</span>
            </h2>
            <p
              className="mt-5 max-w-xl text-tg-muted text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Click any intercepted trajectory on the 3D globe to trigger instant
              Gemini AI adversary profiling, risk classification, and tactical countermeasures.
            </p>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div className="flex flex-col items-center mx-auto text-tg-muted animate-bounce">
          <span
            className="text-[11px] mb-1"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Scroll to explore
          </span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}
