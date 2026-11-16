"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { CATALOG, iconUrl } from "@/lib/design/catalog";
import type { Design, DesignNode, NodeLoad, Shape } from "@/lib/design/types";

const SPACING = 2.4;
const NODE_Y = 0.6;

export interface SceneProps {
  design: Design;
  loads: Record<string, NodeLoad>;
  highlight: Record<string, "warn" | "fail">;
  selectedId: string | null;
  focusedIds: string[];
  connectSourceId: string | null;
  animate: boolean;
  dark: boolean;
  onSelectNode: (id: string) => void;
  onMoveNode: (id: string, x: number, z: number) => void;
  onBackground: () => void;
}

function worldOf(n: DesignNode): [number, number, number] {
  return [n.x * SPACING, NODE_Y, n.z * SPACING];
}

function Geometry({ shape }: { shape: Shape }) {
  switch (shape) {
    case "sphere": return <sphereGeometry args={[0.55, 24, 24]} />;
    case "octahedron": return <octahedronGeometry args={[0.65]} />;
    case "dodecahedron": return <dodecahedronGeometry args={[0.6]} />;
    case "icosahedron": return <icosahedronGeometry args={[0.62]} />;
    case "cone": return <coneGeometry args={[0.55, 1, 24]} />;
    case "wide-box": return <boxGeometry args={[1.3, 0.5, 0.7]} />;
    case "cube": return <boxGeometry args={[0.85, 0.85, 0.85]} />;
    case "capsule": return <capsuleGeometry args={[0.35, 0.6, 8, 16]} />;
    case "cylinder": return <cylinderGeometry args={[0.5, 0.5, 0.9, 24]} />;
    case "hex-cylinder": return <cylinderGeometry args={[0.6, 0.6, 0.7, 6]} />;
    case "long-box": return <boxGeometry args={[1.5, 0.4, 0.5]} />;
    case "bucket": return <cylinderGeometry args={[0.6, 0.45, 0.8, 20]} />;
    case "torus-knot": return <torusKnotGeometry args={[0.38, 0.14, 64, 10]} />;
    case "ring": return <torusGeometry args={[0.5, 0.18, 16, 28]} />;
    case "dome": return <sphereGeometry args={[0.6, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />;
    case "puck": return <cylinderGeometry args={[0.6, 0.6, 0.35, 28]} />;
    default: return <boxGeometry args={[0.8, 0.8, 0.8]} />;
  }
}

function NodeMesh({
  node, load, hl, selected, focused, isSource, dark, onDown, onClick,
}: {
  node: DesignNode; load?: NodeLoad; hl?: "warn" | "fail"; selected: boolean;
  focused: boolean; isSource: boolean; dark: boolean;
  onDown: (e: ThreeEvent<PointerEvent>) => void; onClick: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const entry = CATALOG[node.type];
  const ringRef = useRef<THREE.Mesh>(null);
  const base = new THREE.Color(entry.color);
  // Tint toward red as utilization climbs.
  const overl = load && load.util > 0 ? Math.min(1, load.util) : 0;
  const color = base.clone().lerp(new THREE.Color("#ef4444"), overl * 0.55);
  const emissive = hl === "fail" ? "#ef4444" : hl === "warn" ? "#f59e0b" : selected ? "#22d3ee" : color.getStyle();
  const emissiveIntensity = hl ? 0.55 : selected ? 0.4 : dark ? 0.18 : 0.05;

  useFrame(({ clock }) => {
    if (ringRef.current && hl) {
      const s = 1 + Math.sin(clock.elapsedTime * 4) * 0.12;
      ringRef.current.scale.set(s, s, s);
    }
  });

  const [wx, wy, wz] = worldOf(node);
  return (
    <group position={[wx, wy, wz]}>
      <mesh
        castShadow
        onPointerDown={onDown}
        onClick={onClick}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}
        scale={focused ? 1.12 : 1}
      >
        <Geometry shape={entry.shape} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} metalness={0.25} roughness={0.5} />
      </mesh>

      {/* replica stack indicator */}
      {node.replicas > 1 && (
        <>
          <mesh position={[0.12, -0.12, -0.12]} scale={0.96}>
            <Geometry shape={entry.shape} />
            <meshStandardMaterial color={color} transparent opacity={0.35} />
          </mesh>
          {node.replicas > 2 && (
            <mesh position={[0.24, -0.24, -0.24]} scale={0.92}>
              <Geometry shape={entry.shape} />
              <meshStandardMaterial color={color} transparent opacity={0.22} />
            </mesh>
          )}
        </>
      )}

      {/* highlight / selection ring on the floor */}
      {(hl || selected || isSource) && (
        <mesh ref={ringRef} position={[0, -NODE_Y + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.07, 10, 36]} />
          <meshBasicMaterial color={hl === "fail" ? "#ef4444" : hl === "warn" ? "#f59e0b" : isSource ? "#34d399" : "#22d3ee"} />
        </mesh>
      )}

      <Label
        text={`${node.label}${node.replicas > 1 ? ` ×${node.replicas}` : ""}`}
        icon={iconUrl(node.type)}
        color={entry.color}
        dark={dark}
        y={1.25}
      />
    </group>
  );
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// In-canvas text label as a camera-facing sprite (no DOM portal → no reconciler teardown errors).
// Draws the AWS architecture icon onto the texture next to the component name.
function Label({ text, icon, color, dark, y }: { text: string; icon: string; color: string; dark: boolean; y: number }) {
  const [data, setData] = useState<{ tex: THREE.CanvasTexture; w: number; h: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let done = false;
    const img = new Image();

    const build = () => {
      const fontSize = 46;
      const padX = 20;
      const padY = 16;
      const iconSize = 54;
      const gap = 14;
      const font = `700 ${fontSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
      const hasIcon = img.naturalWidth > 0;

      const measure = document.createElement("canvas").getContext("2d");
      if (!measure) return;
      measure.font = font;
      const textW = Math.ceil(measure.measureText(text).width);
      const iconSpace = hasIcon ? iconSize + gap : 0;

      const canvas = document.createElement("canvas");
      canvas.width = padX * 2 + iconSpace + textW;
      canvas.height = Math.max(fontSize, iconSize) + padY * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // card background + accent border
      roundRectPath(ctx, 1.5, 1.5, canvas.width - 3, canvas.height - 3, 16);
      ctx.fillStyle = dark ? "rgba(14,11,22,0.88)" : "rgba(255,255,255,0.92)";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();

      // AWS icon on a white tile (keeps the dark client glyph visible in dark mode)
      if (hasIcon) {
        const iy = (canvas.height - iconSize) / 2;
        roundRectPath(ctx, padX, iy, iconSize, iconSize, 8);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.drawImage(img, padX, iy, iconSize, iconSize);
      }

      ctx.font = font;
      ctx.textBaseline = "middle";
      ctx.fillStyle = dark ? "#ece9fb" : "#14121a";
      ctx.fillText(text, padX + iconSpace, canvas.height / 2 + 1);

      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 4;
      tex.needsUpdate = true;
      setData({ tex, w: canvas.width, h: canvas.height });
    };

    const finish = () => { if (done || cancelled) return; done = true; build(); };
    img.onload = finish;
    img.onerror = finish; // fall back to a text-only card
    img.src = icon;
    if (img.complete) finish();

    return () => { cancelled = true; };
  }, [text, icon, color, dark]);

  useEffect(() => () => { data?.tex.dispose(); }, [data]);

  if (!data) return null;
  const scale = 0.011;
  return (
    <sprite position={[0, y, 0]} scale={[data.w * scale, data.h * scale, 1]} renderOrder={10}>
      <spriteMaterial map={data.tex} transparent depthTest={false} depthWrite={false} />
    </sprite>
  );
}

function Edge({ a, b, animate, rate, dark }: { a: DesignNode; b: DesignNode; animate: boolean; rate: number; dark: boolean }) {
  const from = new THREE.Vector3(...worldOf(a));
  const to = new THREE.Vector3(...worldOf(b));
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = dir.length();
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  const packetRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!animate || !packetRef.current) return;
    const t = (clock.elapsedTime * (0.15 + rate * 0.5)) % 1;
    packetRef.current.position.copy(from).lerp(to, t);
  });

  const lineColor = dark ? "#5b6480" : "#94a3b8";
  return (
    <group>
      <mesh position={mid} quaternion={quat}>
        <cylinderGeometry args={[0.03, 0.03, len, 6]} />
        <meshBasicMaterial color={lineColor} transparent opacity={0.8} />
      </mesh>
      {/* arrowhead near the target */}
      <mesh position={new THREE.Vector3().copy(to).addScaledVector(dir.clone().normalize(), -0.75)} quaternion={quat}>
        <coneGeometry args={[0.12, 0.28, 10]} />
        <meshBasicMaterial color={lineColor} />
      </mesh>
      {animate && (
        <mesh ref={packetRef} position={from}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      )}
    </group>
  );
}

function SceneContents(props: SceneProps) {
  const { design, loads, highlight, selectedId, focusedIds, connectSourceId, animate, dark } = props;
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const movedRef = useRef(false);
  const controlsEnabled = draggingId === null;

  const focusedSet = useMemo(() => new Set(focusedIds), [focusedIds]);

  const onFloorMove = (e: ThreeEvent<PointerEvent>) => {
    if (!draggingId) return;
    const gx = Math.round(e.point.x / SPACING);
    const gz = Math.round(e.point.z / SPACING);
    const node = design.nodes.find((n) => n.id === draggingId);
    if (node && (node.x !== gx || node.z !== gz)) {
      movedRef.current = true;
      props.onMoveNode(draggingId, gx, gz);
    }
  };
  const endDrag = () => { if (draggingId) setDraggingId(null); };

  return (
    <>
      <ambientLight intensity={dark ? 0.55 : 0.8} />
      <directionalLight position={[6, 10, 6]} intensity={dark ? 1.1 : 1.3} castShadow />
      <directionalLight position={[-6, 6, -4]} intensity={0.35} color="#a78bfa" />

      {/* invisible drag/background plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onPointerMove={onFloorMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClick={() => props.onBackground()}
      >
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <gridHelper args={[60, 50, dark ? "#2a2440" : "#cbd5e1", dark ? "#1c1830" : "#e2e8f0"]} position={[0, 0.01, 0]} />

      {design.edges.map((e) => {
        const a = design.nodes.find((n) => n.id === e.from);
        const b = design.nodes.find((n) => n.id === e.to);
        if (!a || !b) return null;
        return <Edge key={e.id} a={a} b={b} animate={animate} rate={Math.min(1, (loads[b.id]?.util ?? 0))} dark={dark} />;
      })}

      {design.nodes.map((n) => (
        <NodeMesh
          key={n.id}
          node={n}
          load={loads[n.id]}
          hl={highlight[n.id]}
          selected={selectedId === n.id}
          focused={focusedSet.has(n.id)}
          isSource={connectSourceId === n.id}
          dark={dark}
          onDown={(e) => { e.stopPropagation(); movedRef.current = false; setDraggingId(n.id); }}
          onClick={(e) => {
            e.stopPropagation();
            if (movedRef.current) return; // was a drag, not a click
            props.onSelectNode(n.id);
          }}
        />
      ))}

      <OrbitControls enabled={controlsEnabled} enablePan makeDefault minDistance={4} maxDistance={40} maxPolarAngle={Math.PI / 2.05} />
    </>
  );
}

export default function Scene3D(props: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [7, 8, 11], fov: 42 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[props.dark ? "#0b0912" : "#eef1f6"]} />
      <SceneContents {...props} />
    </Canvas>
  );
}
