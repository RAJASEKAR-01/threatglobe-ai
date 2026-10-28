import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as THREE from "three";
import { AttackType, SeverityLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts Latitude and Longitude to 3D Vector3 on a sphere of radius R.
 */
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Matte, shape-differentiated arc colors.
 * High severity uses accent orange (#FF5A36); others use neutral tones.
 * Each type also has a distinct shape (handled in AttackArcs via geometry variation).
 */
export const ATTACK_TYPE_COLORS: Record<AttackType, string> = {
  DDoS:       "#EDE9E3", // warm white — wide volumetric arcs
  Phishing:   "#8A8A90", // muted grey — thin arcs
  Malware:    "#C4BEB6", // warm grey — medium arcs
  Ransomware: "#FF5A36", // accent orange — high severity always orange
};

/**
 * Severity badge styles — flat matte, no glows.
 * Orange accent is reserved for High and Critical.
 */
export const SEVERITY_COLORS: Record<SeverityLevel, { bg: string; text: string; border: string; glow: string }> = {
  Low: {
    bg:     "bg-[#17171A]",
    text:   "text-[#8A8A90]",
    border: "border-[#2A2A2E]",
    glow:   "",
  },
  Medium: {
    bg:     "bg-[#17171A]",
    text:   "text-[#EDE9E3]",
    border: "border-[#2A2A2E]",
    glow:   "",
  },
  High: {
    bg:     "bg-[#FF5A36]/10",
    text:   "text-[#FF5A36]",
    border: "border-[#FF5A36]/40",
    glow:   "",
  },
  Critical: {
    bg:     "bg-[#FF5A36]/20",
    text:   "text-[#FF5A36]",
    border: "border-[#FF5A36]/60",
    glow:   "",
  },
};
