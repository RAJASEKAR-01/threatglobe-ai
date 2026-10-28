"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { GLOBAL_NODES } from "@/lib/geoData";
import { latLngToVector3 } from "@/lib/utils";

interface EarthSphereProps {
  radius?: number;
}

export default function EarthSphere({ radius = 2.6 }: EarthSphereProps) {
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Generate editorial earth grid — warm whites and muted tones only
  const { positions, colors } = useMemo(() => {
    const coords: number[] = [];
    const colList: number[] = [];

    // Warm white for accent lines
    const colorAccent = new THREE.Color("#EDE9E3");
    // Muted grey for standard grid
    const colorMuted  = new THREE.Color("#3A3A3E");
    // Dimmer base
    const colorDim    = new THREE.Color("#222225");

    const latSteps = 36;
    const lngSteps = 72;

    for (let i = 0; i <= latSteps; i++) {
      const lat = (i / latSteps) * 180 - 90;
      for (let j = 0; j <= lngSteps; j++) {
        const lng = (j / lngSteps) * 360 - 180;
        const v = latLngToVector3(lat, lng, radius);
        coords.push(v.x, v.y, v.z);

        // Accent lines at equator and prime meridian
        if (Math.abs(lat) < 3 || Math.abs(lng) < 3) {
          colList.push(colorAccent.r, colorAccent.g, colorAccent.b);
        } else if (i % 6 === 0 || j % 12 === 0) {
          colList.push(colorMuted.r, colorMuted.g, colorMuted.b);
        } else {
          colList.push(colorDim.r, colorDim.g, colorDim.b);
        }
      }
    }

    // Landmass scatter points around major hubs
    GLOBAL_NODES.forEach((node) => {
      for (let k = 0; k < 18; k++) {
        const dLat = (Math.random() - 0.5) * 14;
        const dLng = (Math.random() - 0.5) * 18;
        const v = latLngToVector3(node.lat + dLat, node.lng + dLng, radius + 0.015);
        coords.push(v.x, v.y, v.z);
        // Alternate between accent and muted
        const c = Math.random() > 0.5 ? colorAccent : colorMuted;
        colList.push(c.r * 0.6, c.g * 0.6, c.b * 0.6);
      }
    });

    return {
      positions: new Float32Array(coords),
      colors:    new Float32Array(colList),
    };
  }, [radius]);

  // Node pins
  const nodePins = useMemo(() => {
    return GLOBAL_NODES.map((node) => ({
      ...node,
      pos: latLngToVector3(node.lat, node.lng, radius + 0.02),
    }));
  }, [radius]);

  // Very subtle globe pulse
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (atmosphereRef.current) {
      atmosphereRef.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.008);
    }
  });

  return (
    <group>
      {/* Inner dark sphere */}
      <mesh>
        <sphereGeometry args={[radius * 0.995, 64, 64]} />
        <meshStandardMaterial
          color="#0E0E10"
          roughness={0.9}
          metalness={0.2}
        />
      </mesh>

      {/* Point cloud earth surface */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      {/* Subtle outer shell — warm tint, very low opacity */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[radius * 1.04, 32, 32]} />
        <meshBasicMaterial
          color="#EDE9E3"
          transparent
          opacity={0.018}
          side={THREE.BackSide}
        />
      </mesh>

      {/* City hub pins */}
      {nodePins.map((node) => (
        <group key={node.city} position={node.pos}>
          {/* Flat pin dot — warm white */}
          <mesh>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshBasicMaterial color="#EDE9E3" />
          </mesh>
          {/* Thin ring */}
          <mesh>
            <ringGeometry args={[0.025, 0.038, 16]} />
            <meshBasicMaterial
              color="#8A8A90"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
