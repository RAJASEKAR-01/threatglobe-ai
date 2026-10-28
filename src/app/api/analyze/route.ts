import { NextRequest, NextResponse } from "next/server";
import { ThreatAttack, AIAnalysisResponse } from "@/types";

export const runtime = "nodejs";

const FALLBACK_INTELLIGENCE: Record<string, (attack: ThreatAttack) => AIAnalysisResponse> = {
  DDoS: (attack) => ({
    summary: `Massive distributed denial-of-service barrage originating from ${attack.source.city}, ${attack.source.country} targeting ${attack.target.city}, ${attack.target.country} on port ${attack.port} (${attack.protocol}). Peak throughput clocked at ${attack.bandwidth} with ${attack.packetRate}. Intent appears to be service exhaustion and infrastructure saturation.`,
    risk_level: attack.severity,
    likely_attacker_technique: `MITRE ATT&CK T1498.001 - Direct Network Denial of Service (UDP/SYN Flood & Amplification)`,
    defense_steps: [
      `Deploy upstream BGP Flowspec route injection and activate Scrubbing Center filtration to shed malicious packets at Tier-1 transit level.`,
      `Implement adaptive rate limiting on edge load balancers for port ${attack.port} with SYN cookies enabled.`,
      `Blackhole rogue CIDR blocks originating from ${attack.source.countryCode} autonomous system numbers (ASNs).`,
    ],
    isLiveGemini: false,
    analyzedAt: new Date().toISOString(),
  }),
  Phishing: (attack) => ({
    summary: `Targeted spear-phishing / credential harvesting campaign detected against enterprise endpoints in ${attack.target.city}, ${attack.target.country}. Traffic indicates malicious payload routing via proxy nodes in ${attack.source.city}, utilizing lookalike domains and weaponized OAuth token grants.`,
    risk_level: attack.severity,
    likely_attacker_technique: `MITRE ATT&CK T1566.002 - Spearphishing Link / Adversary-in-the-Middle (AiTM)`,
    defense_steps: [
      `Revoke active SSO sessions and invalidate OAuth tokens for compromised accounts across the target tenant.`,
      `Enforce FIDO2 WebAuthn hardware-bound passkeys to neutralize AiTM reverse-proxy credential capture.`,
      `Sinkhole associated command-and-control domains at the enterprise DNS gateway and purge email quarantine.`,
    ],
    isLiveGemini: false,
    analyzedAt: new Date().toISOString(),
  }),
  Malware: (attack) => ({
    summary: `Polymorphic malware beaconing and staged C2 payload download directed at ${attack.target.city}, ${attack.target.country} from C2 infrastructure in ${attack.source.city}. Encrypted beaconing on port ${attack.port} indicates early stage host reconnaissance and credential dumping.`,
    risk_level: attack.severity,
    likely_attacker_technique: `MITRE ATT&CK T1059.001 - Command and Scripting Interpreter (PowerShell / In-Memory Beaconing)`,
    defense_steps: [
      `Isolate impacted host nodes immediately via automated EDR network quarantine containment.`,
      `Harvest process memory dumps, inspect parent-child process lineage, and extract C2 beaconing IP IOCs.`,
      `Push emergency Yara rule signatures and block outbound beaconing IP addresses across the perimeter firewall.`,
    ],
    isLiveGemini: false,
    analyzedAt: new Date().toISOString(),
  }),
  Ransomware: (attack) => ({
    summary: `High-urgency pre-ransomware double-extortion activity detected targeting ${attack.target.city}, ${attack.target.country}. Lateral movement telemetry identified SMB/RDP exploitation from ${attack.source.city} staging server, attempting shadow copy deletion and enterprise backup encryption.`,
    risk_level: "Critical",
    likely_attacker_technique: `MITRE ATT&CK T1486 - Data Encrypted for Impact & T1021.002 Remote Services (SMB/RPC)`,
    defense_steps: [
      `Sever all lateral domain interconnects, isolate Active Directory domain controllers, and lock down volume shadow copies.`,
      `Kill unauthenticated RPC and SMB connections across subnets and revoke privileged service account credentials.`,
      `Verify air-gapped immutable backup integrity and trigger incident response disaster recovery failover.`,
    ],
    isLiveGemini: false,
    analyzedAt: new Date().toISOString(),
  }),
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const attack: ThreatAttack = body.attack;

    if (!attack || !attack.type || !attack.source || !attack.target) {
      return NextResponse.json(
        { error: "Invalid attack payload: source, target, and type are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `You are ThreatGlobe AI, a military-grade cyber threat intelligence analyst engine.
Analyze this intercepted real-time cyber attack:
- Attack Type: ${attack.type}
- Severity: ${attack.severity}
- Origin: ${attack.source.city}, ${attack.source.country} (${attack.source.countryCode}) [Lat: ${attack.source.lat}, Lng: ${attack.source.lng}]
- Target: ${attack.target.city}, ${attack.target.country} (${attack.target.countryCode}) [Lat: ${attack.target.lat}, Lng: ${attack.target.lng}]
- Destination Port: ${attack.port} (${attack.protocol})
- Bandwidth / Throughput: ${attack.bandwidth}
- Packet Rate: ${attack.packetRate}
${attack.cve ? `- Exploited CVE: ${attack.cve}` : ""}

Respond STRICTLY with a valid JSON object (no markdown code fences, no extra text) with exactly these fields:
{
  "summary": "Concise 2-3 sentence strategic threat analysis describing the attack vector, origin, target, and threat actor motivation.",
  "risk_level": "Low" | "Medium" | "High" | "Critical",
  "likely_attacker_technique": "Specific MITRE ATT&CK ID and technique name (e.g. MITRE ATT&CK T1498 - Network Denial of Service)",
  "defense_steps": [
    "Step 1: Immediate tactical mitigation (firewall, BGP, or quarantine action)",
    "Step 2: Threat hunting and IOC containment action",
    "Step 3: Long-term posture hardening or policy enforcement"
  ]
}`;

        // Call Gemini API server-side
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.2,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText.replace(/```json/g, "").replace(/```/g, "").trim());
            return NextResponse.json({
              summary: parsed.summary,
              risk_level: parsed.risk_level || attack.severity,
              likely_attacker_technique: parsed.likely_attacker_technique,
              defense_steps: Array.isArray(parsed.defense_steps) ? parsed.defense_steps.slice(0, 3) : [
                "Deploy network filtering rule",
                "Quarantine affected host endpoints",
                "Verify integrity of backup clusters"
              ],
              isLiveGemini: true,
              analyzedAt: new Date().toISOString(),
            });
          }
        } else {
          console.warn("Gemini API call failed with status:", response.status, await response.text());
        }
      } catch (geminiError) {
        console.error("Gemini invocation error, falling back to heuristic engine:", geminiError);
      }
    }

    // Heuristic Fallback
    const generator = FALLBACK_INTELLIGENCE[attack.type] || FALLBACK_INTELLIGENCE.DDoS;
    const fallbackResponse = generator(attack);
    return NextResponse.json(fallbackResponse);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Failed in /api/analyze:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
