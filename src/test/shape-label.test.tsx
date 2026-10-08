import { StrictMode } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as THREE from "three";

const scene = vi.hoisted(() => ({
  state: {} as {
    gl: { domElement: HTMLCanvasElement };
    camera: THREE.PerspectiveCamera;
    size: { width: number; height: number };
  },
  frames: [] as Array<() => void>,
}));
vi.mock("@react-three/fiber", () => ({
  useThree: () => scene.state,
  useFrame: (callback: () => void) => {
    scene.frames.push(callback);
  },
}));
import { ShapeLabel } from "@/components/ShapeLabel";

let canvasContainer: HTMLDivElement;
beforeEach(() => {
  canvasContainer = document.createElement("div");
  const canvas = document.createElement("canvas");
  canvasContainer.appendChild(canvas);
  document.body.appendChild(canvasContainer);
  const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
  camera.position.z = 10;
  camera.updateMatrixWorld();
  scene.state = { gl: { domElement: canvas }, camera, size: { width: 400, height: 200 } };
  scene.frames = [];
});
afterEach(() => {
  cleanup();
  canvasContainer.remove();
});

describe("3D dimension labels", () => {
  it("cleans up labels under Strict Mode when changing a challenge", () => {
    const { rerender, unmount } = render(
      <StrictMode>
        <ShapeLabel p={[0, 0, 0]} t="a = 4" />
      </StrictMode>,
    );
    expect(canvasContainer.querySelectorAll("span")).toHaveLength(1);
    rerender(
      <StrictMode>
        <ShapeLabel key="next-challenge" p={[0, 0, 0]} t="r = 3" />
      </StrictMode>,
    );
    expect(canvasContainer.querySelectorAll("span")).toHaveLength(1);
    expect(canvasContainer.textContent).toBe("r = 3");
    unmount();
    expect(canvasContainer.querySelectorAll("span")).toHaveLength(0);
  });
  it("positions the label in the canvas and hides it behind the camera", () => {
    render(<ShapeLabel p={[0, 0, 0]} t="h = 10" />);
    const label = canvasContainer.querySelector("span")!;
    scene.frames.at(-1)!();
    expect(label.style.visibility).toBe("visible");
    expect(label.style.transform).toBe("translate3d(200px,100px,0) translate(-50%,-50%)");
    scene.state.camera.position.z = -10;
    scene.state.camera.updateMatrixWorld();
    scene.frames.at(-1)!();
    expect(label.style.visibility).toBe("hidden");
  });
});
