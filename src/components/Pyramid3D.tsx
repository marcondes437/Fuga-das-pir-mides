"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, OrbitControls } from "@react-three/drei";
import { Pause, Play } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const THEMES = [
  { height: 2.7, stone: "#c9a46a", light: "#ffe1a3" },
  { height: 3.1, stone: "#af7c45", light: "#ffd0a0" },
  { height: 3.5, stone: "#8f7751", light: "#b8cedc" },
];

function Pyramid({ variant, spinning }: { variant: number; spinning: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (spinning && group.current) group.current.rotation.y += Math.min(delta, 0.05) * 0.28;
  });
  const theme = THEMES[variant] ?? THEMES[0]!;
  const base = 3.8;
  const courses = useMemo(() => {
    const points: number[] = [];
    for (let level = 1; level <= 8; level++) {
      const y = (theme.height * level) / 10;
      const half = (base / 2) * (1 - y / theme.height) + 0.006;
      const corners = [
        [-half, y, -half],
        [half, y, -half],
        [half, y, half],
        [-half, y, half],
      ];
      for (let side = 0; side < 4; side++)
        points.push(...corners[side]!, ...corners[(side + 1) % 4]!);
    }
    return new Float32Array(points);
  }, [theme.height]);

  return (
    <group ref={group}>
      <mesh
        position={[0, theme.height / 2, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[base / Math.SQRT2, theme.height, 4]} />
        <meshStandardMaterial color={theme.stone} roughness={0.9} metalness={0.08} />
        <Edges color="#e6bf72" threshold={20} />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[courses, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#e6bf72" transparent opacity={0.3} />
      </lineSegments>
      <mesh
        position={[0, 0.28, (base / 2) * (1 - 0.28 / theme.height) + 0.015]}
        rotation={[-Math.atan(base / (2 * theme.height)), 0, 0]}
      >
        <planeGeometry args={[0.34, 0.53]} />
        <meshStandardMaterial color="#322316" roughness={1} side={THREE.DoubleSide} />
        <Edges color="#e6bf72" />
      </mesh>
    </group>
  );
}

export default function Pyramid3D({ variant }: { variant: number }) {
  const [spinning, setSpinning] = useState(true);
  const theme = THEMES[variant] ?? THEMES[0]!;
  return (
    <div className="relative h-full w-full">
      <Canvas
        frameloop={spinning ? "always" : "demand"}
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [5.5, 3.8, 6], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        fallback={
          <p className="p-4 text-sm text-sand">A visualização 3D requer um navegador com WebGL.</p>
        }
      >
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[4, 7, 5]}
          intensity={2.2}
          color="#ffe0aa"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[-4, 3, -2]} intensity={1.2} color={theme.light} />
        <Pyramid variant={variant} spinning={spinning} />
        <mesh position={[0, -0.055, 0]} receiveShadow>
          <cylinderGeometry args={[2.7, 2.8, 0.1, 48]} />
          <meshStandardMaterial color="#5c452a" roughness={1} transparent opacity={0.65} />
        </mesh>
        <OrbitControls
          target={[0, 1.15, 0]}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={0.5}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
      <p className="pointer-events-none absolute bottom-0 left-0 text-[10px] text-sand/80">
        {spinning ? "Rotação automática" : "Rotação pausada"}
      </p>
      <div className="absolute bottom-0 right-0 flex gap-1">
        <button
          type="button"
          aria-label={spinning ? "Pausar rotação da pirâmide" : "Retomar rotação da pirâmide"}
          onClick={() => setSpinning((value) => !value)}
          className="rounded border border-gold/30 bg-background/80 p-1.5 text-gold-light hover:bg-card focus-visible:outline-2 focus-visible:outline-gold-light"
        >
          {spinning ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
