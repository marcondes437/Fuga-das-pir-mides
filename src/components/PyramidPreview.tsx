"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Pyramid3D = dynamic(() => import("./Pyramid3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-xs text-sand" role="status">
      Preparando a pirâmide…
    </div>
  ),
});

export function PyramidPreview({ variant, name }: { variant: number; name: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={container}
      className="mb-7 h-52 w-full"
      role="group"
      aria-label={`Modelo 3D: ${name}`}
    >
      {visible ? (
        <Pyramid3D variant={variant} />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-sand">
          Explore a pirâmide em 3D
        </div>
      )}
    </div>
  );
}
