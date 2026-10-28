"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ThreatAttack } from "@/types";
import { latLngToVector3, ATTACK_TYPE_COLORS } from "@/lib/utils";

interface AttackArcsProps {
  attacks: ThreatAttack[];
  radius?: number;
  selectedAttackId?: string | null;
  onSelectAttack: (attack: ThreatAttack) => void;
}

interface SingleArcProps {
  attack: ThreatAttack;
  radius: number;
  isSelected: boolean;
  onSelect: (attack: ThreatAttack) => void;
}

/**
 * Each attack type gets a distinct tube radius for shape differentiation:
 * DDoS       → thick  (0.022 base)
 * Ransomware → medium (0.016 base) — always orange
 * Malware    → thin   (0.012 base)
 * Phishing   → hairline (0.008 base)
 */
const TUBE_RADIUS: Record<string, number> = {
  DDoS:       0.022,
  Ransomware: 0.016,
  Malware:    0.012,
  Phishing:   0.008,
};

function SingleArc({ attack, radius, isSelected, onSelect }: SingleArcProps) {
  const [hovered, setHovered] = useState(false);
  const headParticleRef = useRef<THREE.Mesh>(null);
  const targetRingRef = useRef<THREE.Mesh>(null);

  const { curve, tubeGeometry, baseColor, startPos, endPos } = useMemo(() => {
    const start = latLngToVector3(attack.source.lat, attack.source.lng, radius);
    const end   = latLngToVector3(attack.target.lat, attack.target.lng, radius);

    const distance = start.distanceTo(end);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const altitude = radius + Math.min(distance * 0.38, 1.3);
    mid.normalize().multiplyScalar(altitude);

    const bezCurve = new THREE.QuadraticBezierCurve3(start, mid, end);

    const tubeR = TUBE_RADIUS[attack.type] ?? 0.013;
    const selR  = tubeR * (isSelected ? 1.6 : 1.0);
    const geometry = new THREE.TubeGeometry(bezCurve, 44, selR, 8, false);

    // Use orange accent for high-severity attacks; otherwise use type color
    const isHighSeverity = attack.severity === "High" || attack.severity === "Critical";
    const hex = isHighSeverity ? "#FF5A36" : (ATTACK_TYPE_COLORS[attack.type] || "#EDE9E3");
    const color = new THREE.Color(hex);

    return {
      curve:         bezCurve,
      tubeGeometry:  geometry,
      baseColor:     color,
      startPos:      start,
      endPos:        end,
    };
  }, [attack, radius, isSelected]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = 0.45 + (attack.id.charCodeAt(attack.id.length - 1) % 5) * 0.1;
    const progress = (t * speed) % 1;

    if (headParticleRef.current) {
      const currentPoint = curve.getPoint(progress);
      headParticleRef.current.position.copy(currentPoint);
    }

    if (targetRingRef.current) {
      const ringScale = 1 + ((t * 1.8) % 1) * 2.0;
      targetRingRef.current.scale.set(ringScale, ringScale, ringScale);
      const mat = targetRingRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 0.6 - ((t * 1.8) % 1));
      }
    }
  });

  // Normal opacity: lower than the original for a calmer look
  const arcOpacity = isSelected ? 0.9 : hovered ? 0.8 : 0.55;

  return (
    <group>
      {/* Clickable arc tube */}
      <mesh
        geometry={tubeGeometry}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(attack);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <meshBasicMaterial
          color={isSelected || hovered ? "#EDE9E3" : baseColor}
          transparent
          opacity={arcOpacity}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Traveling packet dot */}
      <mesh ref={headParticleRef}>
        <sphereGeometry args={[isSelected ? 0.04 : 0.028, 10, 10]} />
        <meshBasicMaterial
          color={isSelected ? "#EDE9E3" : baseColor}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Origin dot */}
      <mesh position={startPos}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={baseColor} />
      </mesh>

      {/* Target dot + expanding ring */}
      <group position={endPos}>
        <mesh>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshBasicMaterial color={baseColor} />
        </mesh>
        <mesh ref={targetRingRef} lookAt={() => new THREE.Vector3(0, 0, 0)}>
          <ringGeometry args={[0.025, 0.055, 16]} />
          <meshBasicMaterial
            color={baseColor}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            blending={THREE.NormalBlending}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function AttackArcs({
  attacks,
  radius = 2.6,
  selectedAttackId,
  onSelectAttack,
}: AttackArcsProps) {
  return (
    <group>
      {attacks.map((attack) => (
        <SingleArc
          key={attack.id}
          attack={attack}
          radius={radius}
          isSelected={selectedAttackId === attack.id}
          onSelect={onSelectAttack}
        />
      ))}
    </group>
  );
}
