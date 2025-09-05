import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { VFXParticlesCore, VFXParticlesSettings } from "./core";
import { AppearanceMode, RenderMode } from "./types";

export { AppearanceMode, RenderMode };
export type { VFXParticlesSettings };

interface VFXParticlesProps {
  name: string;
  settings?: VFXParticlesSettings;
  alphaMap?: THREE.Texture;
  geometry?: React.ReactElement;
}

const VFXParticles: React.FC<VFXParticlesProps> = ({
  name,
  settings = {},
  alphaMap,
  geometry,
}) => {
  const particlesCoreRef = useRef<VFXParticlesCore | null>(null);
  const [mesh, setMesh] = useState<THREE.InstancedMesh | null>(null);

  useEffect(() => {
    if (!particlesCoreRef.current) {
      let bufferGeometry: THREE.BufferGeometry | undefined;
      if (geometry && "props" in geometry) {
        const props = (geometry as any).props;
        if (props?.args && Array.isArray(props.args)) {
          bufferGeometry = new THREE.PlaneGeometry(...props.args);
        }
      }

      particlesCoreRef.current = new VFXParticlesCore(
        name,
        settings,
        undefined, // Will use the global store
        alphaMap,
        bufferGeometry
      );

      setMesh(particlesCoreRef.current.getMesh());
    }

    return () => {
      if (particlesCoreRef.current) {
        particlesCoreRef.current.dispose();
        particlesCoreRef.current = null;
        setMesh(null);
      }
    };
  }, [name, alphaMap]);

  useEffect(() => {
    if (particlesCoreRef.current) {
      particlesCoreRef.current.updateSettings(settings);
    }
  }, [settings]);

  useFrame(({ clock }) => {
    if (particlesCoreRef.current) {
      particlesCoreRef.current.update(clock.getElapsedTime());
    }
  });

  return mesh ? <primitive object={mesh} /> : null;
};

export default VFXParticles;
