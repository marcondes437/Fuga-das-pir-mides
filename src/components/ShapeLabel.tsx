"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// Keep the label outside React's nested renderers: Drei Html creates a separate
// React root whose synchronous cleanup can collide with a Canvas scene change.
export function ShapeLabel({ p, t }: { p: [number, number, number]; t: string }) {
  const { gl, camera, size } = useThree();
  const anchor = useMemo(() => new THREE.Group(), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const elementRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const container = gl.domElement.parentElement;
    if (!container) return;
    const element = document.createElement("span");
    element.className =
      "pointer-events-none whitespace-nowrap rounded bg-background/85 px-1.5 py-0.5 font-mono text-[11px] text-gold-light";
    element.textContent = t;
    Object.assign(element.style, {
      position: "absolute",
      top: "0",
      left: "0",
      pointerEvents: "none",
      visibility: "hidden",
    });
    container.appendChild(element);
    elementRef.current = element;
    return () => {
      element.remove();
      if (elementRef.current === element) elementRef.current = null;
    };
  }, [gl, t]);

  useFrame(() => {
    const element = elementRef.current;
    if (!element) return;
    camera.updateMatrixWorld();
    anchor.updateWorldMatrix(true, false);
    anchor.getWorldPosition(projected).project(camera);
    element.style.visibility = projected.z >= -1 && projected.z <= 1 ? "visible" : "hidden";
    element.style.transform = `translate3d(${((projected.x + 1) * size.width) / 2}px,${((1 - projected.y) * size.height) / 2}px,0) translate(-50%,-50%)`;
  });

  return <primitive object={anchor} position={p} />;
}
