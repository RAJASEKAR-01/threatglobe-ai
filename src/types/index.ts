export type AttackType = "DDoS" | "Phishing" | "Malware" | "Ransomware";
export type SeverityLevel = "Low" | "Medium" | "High" | "Critical";

export interface GeoLocation {
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
}

export interface ThreatAttack {
  id: string;
  source: GeoLocation;
  target: GeoLocation;
  type: AttackType;
  severity: SeverityLevel;
  timestamp: string;
  port: number;
  protocol: string;
  bandwidth: string;
  packetRate: string;
  cve?: string;
}

export interface AIAnalysisResponse {
  summary: string;
  risk_level: SeverityLevel;
  likely_attacker_technique: string;
  defense_steps: [string, string, string];
  isLiveGemini?: boolean;
  analyzedAt: string;
}
