"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  Box3,
  CanvasTexture,
  Color,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  SRGBColorSpace,
  Vector3,
  type Group,
  type Object3D,
  type Texture,
} from "three";
import { BEATBOT } from "./config";
import { Monogram } from "./monogram";
import { isTalking } from "./signals";

useGLTF.preload(BEATBOT.modelUrl, BEATBOT.dracoPath);

type SceneProps = {
  reduced: boolean;
};

export function BeatBotScene({ reduced }: SceneProps) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <SceneBoundary>
      <Canvas
        className="h-full w-full touch-manipulation"
        dpr={[1, 1.5]}
        frameloop={reduced || hidden ? "demand" : "always"}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        }}
        camera={{
          position: BEATBOT.camera.position,
          fov: BEATBOT.camera.fov,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <ReleaseGpu />
          <Rig />
          <ambientLight intensity={0.85} />
          <directionalLight position={[1.8, 2.6, 2.4]} intensity={1.2} />
          <GoggleLight reduced={reduced} />
          <Character reduced={reduced} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
            <circleGeometry args={[0.42, 24]} />
            <meshBasicMaterial color="#1a1020" transparent opacity={0.2} />
          </mesh>
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}

function ReleaseGpu() {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    return () => {
      gl.dispose();
    };
  }, [gl]);
  return null;
}

function Rig() {
  const camera = useThree((state) => state.camera);
  useLayoutEffect(() => {
    const [x, y, z] = BEATBOT.camera.position;
    const [lx, ly, lz] = BEATBOT.camera.lookAt;
    camera.position.set(x, y, z);
    camera.lookAt(lx, ly, lz);
  }, [camera]);
  return null;
}

function GoggleLight({ reduced }: SceneProps) {
  const light = useRef<PointLight>(null);
  useFrame(({ clock }) => {
    const bulb = light.current;
    if (!bulb || reduced) return;
    const time = clock.elapsedTime;
    const talking = isTalking();
    bulb.intensity = talking
      ? 1.15 + Math.sin(time * 10) * 0.65
      : 0.35 + Math.sin(time * 2.2) * 0.12;
  });
  return (
    <pointLight
      ref={light}
      position={[0, 1.36, 0.9]}
      color="#d6ff6a"
      distance={2.6}
      decay={2}
      intensity={reduced ? 0.45 : 0.35}
    />
  );
}

function Character({ reduced }: SceneProps) {
  const gltf = useGLTF(BEATBOT.modelUrl, BEATBOT.dracoPath);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const group = useRef<Group>(null);
  const glow = useRef<MeshStandardMaterial[]>([]);

  useLayoutEffect(() => {
    const root = scene as Object3D & { userData: { beatbotFit?: boolean } };
    if (root.userData.beatbotFit) return;
    root.userData.beatbotFit = true;
    const box = new Box3().setFromObject(root);
    const size = new Vector3();
    box.getSize(size);
    const scale = BEATBOT.model.fitHeight / Math.max(size.y, 0.0001);
    root.scale.setScalar(scale);
    root.position.set(
      -((box.min.x + box.max.x) / 2) * scale,
      -box.min.y * scale,
      -((box.min.z + box.max.z) / 2) * scale,
    );
    root.rotation.y = BEATBOT.model.facing;
    glow.current = applyGoggleGlow(root);
  }, [scene]);

  useFrame(({ clock }) => {
    const rig = group.current;
    if (!rig || reduced) return;
    const time = clock.elapsedTime;
    const talking = isTalking();
    const hop = talking ? Math.abs(Math.sin(time * 8.5)) * 0.07 : 0;
    rig.position.y = Math.sin(time * 1.7) * 0.028 + hop;
    rig.rotation.z = Math.sin(time * 1.05) * (talking ? 0.07 : 0.028);
    rig.rotation.y = Math.sin(time * 0.45) * 0.16;
    const pulse = talking
      ? 0.65 + Math.sin(time * 10) * 0.45
      : 0.3 + Math.sin(time * 2.2) * 0.12;
    for (const material of glow.current) {
      material.emissiveIntensity = pulse;
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

function applyGoggleGlow(root: Object3D): MeshStandardMaterial[] {
  const materials: MeshStandardMaterial[] = [];
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    list.forEach((material) => {
      if (!(material instanceof MeshStandardMaterial)) return;
      if (material.userData.beatbotGlow) {
        materials.push(material);
        return;
      }
      const emissive = yellowEmissive(material.map);
      if (!emissive) return;
      material.userData.beatbotGlow = true;
      material.emissive = new Color("#ffd24a");
      material.emissiveMap = emissive;
      material.emissiveIntensity = 0.35;
      materials.push(material);
    });
  });
  return materials;
}

function yellowEmissive(map: Texture | null): CanvasTexture | null {
  const source = map?.image as
    | { width?: number; height?: number }
    | undefined;
  const width = source?.width;
  const height = source?.height;
  if (
    !source ||
    typeof width !== "number" ||
    typeof height !== "number" ||
    width < 1 ||
    height < 1
  ) {
    return null;
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.drawImage(source as CanvasImageSource, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = pixels.data;
  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const yellow = red > 170 && green > 110 && blue < 90;
    data[index] = yellow ? 255 : 0;
    data[index + 1] = yellow ? 214 : 0;
    data[index + 2] = yellow ? 40 : 0;
    data[index + 3] = yellow ? 255 : 0;
  }
  context.putImageData(pixels, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = false;
  texture.needsUpdate = true;
  return texture;
}

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <Monogram className="h-full w-full" />;
    }
    return this.props.children;
  }
}
