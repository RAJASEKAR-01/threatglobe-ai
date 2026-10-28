"use client";

import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import HeroScrubCanvas from "@/components/HeroScrubCanvas";
import ThreatGlobe from "@/components/ThreatGlobe";
import StatsSection from "@/components/StatsSection";
import LoadingScreen from "@/components/LoadingScreen";
import Footer from "@/components/Footer";

export default function Home() {
  const [preloadProgress, setPreloadProgress] = useState<number>(0);
  const [isPreloadComplete, setIsPreloadComplete] = useState<boolean>(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Check initial system prefers-reduced-motion and skip_loading
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("skip_loading") === "1") {
        setShowLoadingScreen(false);
      }

      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Auto-dismiss loading screen once ready or after graceful boot sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
      ScrollTrigger.refresh();
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handlePreloadComplete = () => {
    setIsPreloadComplete(true);
    setTimeout(() => {
      setShowLoadingScreen(false);
      ScrollTrigger.refresh();
    }, 400);
  };

  const handleManualEnter = () => {
    setShowLoadingScreen(false);
    ScrollTrigger.refresh();
  };

  return (
    <SmoothScroll reducedMotion={reducedMotion}>
      {/* Loading Overlay */}
      {showLoadingScreen && (
        <LoadingScreen
          progress={preloadProgress}
          isReady={isPreloadComplete || preloadProgress >= 90}
          onEnter={handleManualEnter}
        />
      )}

      {/* Persistent Navigation */}
      <Navbar
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
      />

      <main className="relative min-h-screen bg-tg-bg overflow-x-hidden text-tg-text">
        {/* Hero Section: Sticky scrub canvas with frame sequence */}
        <HeroScrubCanvas
          onPreloadProgress={setPreloadProgress}
          onPreloadComplete={handlePreloadComplete}
          reducedMotion={reducedMotion}
        />

        {/* 3D Interactive Threat Globe */}
        <ThreatGlobe />

        {/* Dynamic Telemetry Stats Section */}
        <StatsSection reducedMotion={reducedMotion} />
      </main>

      {/* Global Footer */}
      <Footer />
    </SmoothScroll>
  );
}
