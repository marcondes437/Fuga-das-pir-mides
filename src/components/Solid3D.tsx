import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Edges, Environment, Lightformer } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import type { Shape } from "@/game/data";
import { ShapeLabel as Label } from "@/components/ShapeLabel";

type Dims = { a: number; b: number; c: number; h: number; r: number; hc: number };
const STONE = "#c9a46a";
const GOLD = "#e6bf72";

function Mat({ wire, opacity = 1 }: { wire: boolean; opacity?: number }) {
  return (
    <meshStandardMaterial
      color={STONE}
      roughness={0.75}
      metalness={0.15}
      transparent={opacity < 1 || wire}
      opacity={wire ? 0.18 : opacity}
      side={THREE.DoubleSide}
    />
  );
}
const E = () => <Edges color={GOLD} threshold={15} />;

function Body({ shape, wire }: { shape: Shape; wire: boolean }) {
  const d = shape.d as Dims;
  switch (shape.kind) {
    case "cube":
      return (
        <>
          <mesh>
            <boxGeometry args={[d.a, d.a, d.a]} />
            <Mat wire={wire} />
            <E />
          </mesh>
          <Label p={[0, -d.a / 2 - 0.4, d.a / 2]} t={`a = ${d.a}`} />
        </>
      );
    case "box":
      return (
        <>
          <mesh>
            <boxGeometry args={[d.a, d.b, d.c]} />
            <Mat wire={wire} />
            <E />
          </mesh>
          <Label p={[0, -d.b / 2 - 0.4, d.c / 2]} t={`${d.a}`} />
          <Label p={[d.a / 2 + 0.4, 0, d.c / 2]} t={`${d.b}`} />
          <Label p={[d.a / 2 + 0.3, -d.b / 2 - 0.3, 0]} t={`${d.c}`} />
        </>
      );
    case "prism3": {
      const s = new THREE.Shape();
      s.moveTo(0, 0);
      s.lineTo(d.a, 0);
      s.lineTo(0, d.b);
      s.lineTo(0, 0);
      return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[-d.a / 3, -d.h / 2, d.b / 3]}>
          <mesh>
            <extrudeGeometry args={[s, { depth: d.h, bevelEnabled: false }]} />
            <Mat wire={wire} />
            <E />
          </mesh>
          <Label p={[d.a / 2, -0.5, 0]} t={`${d.a}`} />
          <Label p={[-0.5, d.b / 2, 0]} t={`${d.b}`} />
          <Label p={[-0.4, 0, d.h / 2]} t={`h = ${d.h}`} />
        </group>
      );
    }
    case "prism6":
      return (
        <>
          <mesh>
            <cylinderGeometry args={[d.a, d.a, d.h, 6]} />
            <Mat wire={wire} />
            <E />
          </mesh>
          <Label p={[d.a + 0.6, 0, 0]} t={`h = ${d.h}`} />
        </>
      );
    case "pyramid": {
      const r = d.a / Math.SQRT2;
      return (
        <>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[r, d.h, 4]} />
            <Mat wire={wire} />
            <E />
          </mesh>
          <Label p={[0, -d.h / 2 - 0.4, d.a / 2]} t={`a = ${d.a}`} />
          <Label p={[0.3, 0, 0]} t={`h = ${d.h}`} />
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, d.h]} />
            <meshBasicMaterial color={GOLD} />
          </mesh>
        </>
      );
    }
    case "cylinder":
      return (
        <>
          <mesh>
            <cylinderGeometry args={[d.r, d.r, d.h, 48]} />
            <Mat wire={wire} />
            <E />
          </mesh>
          <Label p={[d.r / 2, d.h / 2 + 0.3, 0]} t={`r = ${d.r}`} />
          <Label p={[d.r + 0.6, 0, 0]} t={`h = ${d.h}`} />
        </>
      );
    case "cone":
      return (
        <>
          <mesh>
            <coneGeometry args={[d.r, d.h, 48]} />
            <Mat wire={wire} />
            <E />
          </mesh>
          <Label p={[d.r / 2, -d.h / 2 - 0.3, 0]} t={`r = ${d.r}`} />
          <Label p={[0.3, 0, 0]} t={`h = ${d.h}`} />
        </>
      );
    case "sphere":
      return (
        <>
          <mesh>
            <sphereGeometry args={[d.r, 48, 32]} />
            <Mat wire={wire} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[d.r, 0.03, 8, 64]} />
            <meshBasicMaterial color={GOLD} />
          </mesh>
          <Label p={[d.r / 2, 0.3, 0]} t={`r = ${d.r}`} />
        </>
      );
    case "hemisphere":
      return (
        <group position={[0, -d.r / 3, 0]}>
          <mesh>
            <sphereGeometry args={[d.r, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Mat wire={wire} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[d.r, 48]} />
            <Mat wire={wire} />
          </mesh>
          <Label p={[d.r / 2, 0.3, 0]} t={`r = ${d.r}`} />
        </group>
      );
    case "silo":
      return (
        <group position={[0, -2, 0]}>
          <mesh>
            <cylinderGeometry args={[d.r, d.r, d.h, 48]} />
            <Mat wire={wire} />
            <E />
          </mesh>
          <mesh position={[0, d.h / 2 + d.hc / 2, 0]}>
            <coneGeometry args={[d.r, d.hc, 48]} />
            <Mat wire={wire} />
            <E />
          </mesh>
          <Label p={[d.r + 0.6, 0, 0]} t={`h = ${d.h}`} />
          <Label p={[d.r + 0.6, d.h / 2 + d.hc / 2, 0]} t={`${d.hc}`} />
        </group>
      );
    case "cubeHole":
      return (
        <>
          <mesh>
            <boxGeometry args={[d.a, d.a, d.a]} />
            <Mat wire opacity={0.3} />
            <E />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[d.r, d.r, d.a + 0.02, 32]} />
            <meshStandardMaterial color="#2a2016" />
            <E />
          </mesh>
          <Label p={[0, -d.a / 2 - 0.4, d.a / 2]} t={`a = ${d.a}`} />
        </>
      );
    case "tower":
      return (
        <group position={[0, -1, 0]}>
          <mesh>
            <boxGeometry args={[d.a, d.a, d.a]} />
            <Mat wire={wire} />
            <E />
          </mesh>
          <mesh position={[0, d.a / 2 + d.h / 2, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[d.a / Math.SQRT2, d.h, 4]} />
            <Mat wire={wire} />
            <E />
          </mesh>
        </group>
      );
    case "capsule":
      return (
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[d.r, d.r, d.h, 48]} />
            <Mat wire={wire} />
            <E />
          </mesh>
          <mesh position={[0, d.h / 2, 0]}>
            <sphereGeometry args={[d.r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Mat wire={wire} />
          </mesh>
          <mesh position={[0, -d.h / 2, 0]} rotation={[Math.PI, 0, 0]}>
            <sphereGeometry args={[d.r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Mat wire={wire} />
          </mesh>
        </group>
      );
    case "cylSpheres":
      return (
        <group scale={0.6}>
          <mesh>
            <cylinderGeometry args={[d.r, d.r, d.r * 6, 48, 1, true]} />
            <Mat wire opacity={0.25} />
            <E />
          </mesh>
          {[-1, 0, 1].map((k) => (
            <mesh key={k} position={[0, k * d.r * 2, 0]}>
              <sphereGeometry args={[d.r * 0.98, 32, 24]} />
              <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
            </mesh>
          ))}
        </group>
      );
    case "sphereInCube":
      return (
        <>
          <mesh>
            <boxGeometry args={[d.a, d.a, d.a]} />
            <Mat wire opacity={0.2} />
            <E />
          </mesh>
          <mesh>
            <sphereGeometry args={[d.a / 2, 48, 32]} />
            <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
          </mesh>
        </>
      );
    case "cubePyramid":
      return (
        <>
          <mesh>
            <boxGeometry args={[d.a, d.a, d.a]} />
            <Mat wire opacity={0.22} />
            <E />
          </mesh>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[d.a / Math.SQRT2, d.a, 4]} />
            <meshStandardMaterial color="#5a3f28" />
            <E />
          </mesh>
        </>
      );
  }
}

function Spinner({ children, spin }: { children: React.ReactNode; spin: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spin && g.current) g.current.rotation.y += Math.min(dt, 0.05) * 0.35;
  });
  return <group ref={g}>{children}</group>;
}

export function Solid3D({ shape }: { shape: Shape }) {
  const [wire, setWire] = useState(false);
  const [spin, setSpin] = useState(true);
  const size = Math.max(...Object.values(shape.d), 4);
  const dist = shape.kind === "cylSpheres" ? 18 : size * 2.4;
  return (
    <div className="relative h-full w-full">
      <Canvas dpr={[1, 2]} camera={{ position: [dist * 0.7, dist * 0.5, dist * 0.8], fov: 45 }}>
        <color attach="background" args={["#14100b"]} />
        <ambientLight intensity={0.35} />
        <pointLight
          position={[size, size * 1.5, size]}
          intensity={60}
          color="#ffb766"
          distance={size * 8}
          decay={1.4}
        />
        <directionalLight position={[-5, 8, -4]} intensity={0.6} color="#e9d9b6" />
        <Environment resolution={64}>
          <Lightformer intensity={1.5} position={[0, 5, 0]} scale={[10, 10, 1]} color="#ffd9a0" />
          <Lightformer
            intensity={0.6}
            position={[-5, 1, -1]}
            rotation-y={Math.PI / 2}
            scale={[20, 1, 1]}
            color="#b88a44"
          />
        </Environment>
        <Spinner spin={spin}>
          <Body shape={shape} wire={wire} />
        </Spinner>
        <OrbitControls
          enablePan={false}
          minDistance={size}
          maxDistance={size * 5}
          onStart={() => setSpin(false)}
        />
      </Canvas>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <button
          onClick={() => setWire((w) => !w)}
          className="rounded border border-border bg-background/80 px-3 py-1 text-xs text-gold-light hover:bg-card"
        >
          {wire ? "Sólido" : "Transparente"}
        </button>
        <button
          onClick={() => setSpin((s) => !s)}
          className="rounded border border-border bg-background/80 px-3 py-1 text-xs text-gold-light hover:bg-card"
        >
          {spin ? "Pausar" : "Girar"}
        </button>
      </div>
      <p className="pointer-events-none absolute right-3 top-3 text-[11px] text-muted-foreground">
        Arraste para girar · role para zoom
      </p>
    </div>
  );
}
