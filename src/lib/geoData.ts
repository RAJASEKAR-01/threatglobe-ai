import { AttackType, GeoLocation, SeverityLevel, ThreatAttack } from "@/types";

export const GLOBAL_NODES: GeoLocation[] = [
  { city: "San Jose (Silicon Valley)", country: "United States", countryCode: "US", lat: 37.3382, lng: -121.8863 },
  { city: "Ashburn (AWS US-East)", country: "United States", countryCode: "US", lat: 39.0438, lng: -77.4874 },
  { city: "Frankfurt", country: "Germany", countryCode: "DE", lat: 50.1109, lng: 8.6821 },
  { city: "London", country: "United Kingdom", countryCode: "GB", lat: 51.5074, lng: -0.1278 },
  { city: "Tokyo", country: "Japan", countryCode: "JP", lat: 35.6762, lng: 139.6503 },
  { city: "Singapore", country: "Singapore", countryCode: "SG", lat: 1.3521, lng: 103.8198 },
  { city: "Sydney", country: "Australia", countryCode: "AU", lat: -33.8688, lng: 151.2093 },
  { city: "São Paulo", country: "Brazil", countryCode: "BR", lat: -23.5505, lng: -46.6333 },
  { city: "Mumbai", country: "India", countryCode: "IN", lat: 19.076, lng: 72.8777 },
  { city: "Seoul", country: "South Korea", countryCode: "KR", lat: 37.5665, lng: 126.978 },
  { city: "Reykjavik", country: "Iceland", countryCode: "IS", lat: 64.1466, lng: -21.9426 },
  { city: "Johannesburg", country: "South Africa", countryCode: "ZA", lat: -26.2041, lng: 28.0473 },
  { city: "Tel Aviv", country: "Israel", countryCode: "IL", lat: 32.0853, lng: 34.7818 },
  { city: "Toronto", country: "Canada", countryCode: "CA", lat: 43.6532, lng: -79.3832 },
  { city: "Zurich", country: "Switzerland", countryCode: "CH", lat: 47.3769, lng: 8.5417 },
  { city: "Stockholm", country: "Sweden", countryCode: "SE", lat: 59.3293, lng: 18.0686 },
  { city: "Warsaw", country: "Poland", countryCode: "PL", lat: 52.2297, lng: 21.0122 },
  { city: "Taipei", country: "Taiwan", countryCode: "TW", lat: 25.033, lng: 121.5654 },
];

const ATTACK_TYPES: AttackType[] = ["DDoS", "Phishing", "Malware", "Ransomware"];
const SEVERITIES: SeverityLevel[] = ["Low", "Medium", "High", "Critical"];

const COMMON_PORTS = [
  { port: 443, proto: "HTTPS" },
  { port: 80, proto: "HTTP" },
  { port: 22, proto: "SSH" },
  { port: 53, proto: "DNS" },
  { port: 3389, proto: "RDP" },
  { port: 8080, proto: "HTTP-ALT" },
  { port: 445, proto: "SMB" },
  { port: 21, proto: "FTP" },
];

export function generateRandomAttack(): ThreatAttack {
  const sourceIdx = Math.floor(Math.random() * GLOBAL_NODES.length);
  let targetIdx = Math.floor(Math.random() * GLOBAL_NODES.length);
  while (targetIdx === sourceIdx) {
    targetIdx = Math.floor(Math.random() * GLOBAL_NODES.length);
  }

  const source = GLOBAL_NODES[sourceIdx];
  const target = GLOBAL_NODES[targetIdx];
  const type = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];

  // Weigh severities realistically
  const sevRand = Math.random();
  let severity: SeverityLevel = "Medium";
  if (sevRand < 0.25) severity = "Low";
  else if (sevRand < 0.65) severity = "Medium";
  else if (sevRand < 0.90) severity = "High";
  else severity = "Critical";

  const portInfo = COMMON_PORTS[Math.floor(Math.random() * COMMON_PORTS.length)];

  const bandwidth = type === "DDoS"
    ? `${(Math.random() * 450 + 20).toFixed(1)} Gbps`
    : `${(Math.random() * 12 + 1).toFixed(1)} MB/s`;

  const packetRate = type === "DDoS"
    ? `${Math.floor(Math.random() * 850 + 50)}k pps`
    : `${Math.floor(Math.random() * 1200 + 50)} req/s`;

  const cves = [
    "CVE-2024-38077",
    "CVE-2024-21413",
    "CVE-2023-4863",
    "CVE-2024-6387",
    "CVE-2023-22515",
  ];

  return {
    id: `atk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    source,
    target,
    type,
    severity,
    timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
    port: portInfo.port,
    protocol: portInfo.proto,
    bandwidth,
    packetRate,
    cve: Math.random() > 0.4 ? cves[Math.floor(Math.random() * cves.length)] : undefined,
  };
}

export function getInitialAttacks(count: number = 6): ThreatAttack[] {
  return Array.from({ length: count }, () => generateRandomAttack());
}
