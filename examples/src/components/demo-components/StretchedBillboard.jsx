import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import { AppearanceMode, RenderMode, VFXEmitter, VFXParticles } from "wawa-vfx";

const tmpVector = new Vector3();

export const StretchedBillboard = () => {
  const emitterBlue = useRef(null);
  const groupRef = useRef(null);

  useFrame((_, delta) => {
    if (emitterBlue.current && groupRef.current) {
      groupRef.current.rotation.z += delta * 10;
    }
  });
  return (
    <>
      <VFXParticles
        name="sparks"
        settings={{
          nbParticles: 500000,
          intensity: 0.5,
          renderMode: RenderMode.StretchBillboard,
          stretchScale: 4,
          fadeSize: [0, 0],
          fadeAlpha: [0, 0],
          gravity: [0, -6, 0],
          appearance: AppearanceMode.Circular,
          easeFunction: "easeLinear",
        }}
      />
      <group ref={groupRef}>
        <group position={[2, 0, 0]}>
          <VFXEmitter
            debug
            ref={emitterBlue}
            emitter="sparks"
            localDirection={true}
            settings={{
              duration: 0.0001,
              delay: 0,
              nbParticles: 1,
              spawnMode: "time",
              loop: true,
              startPositionMin: [0, 0, -0.2],
              startPositionMax: [0, 0, 0.2],
              startRotationMin: [0, 0, 0],
              startRotationMax: [0, 0, 0],
              particlesLifetime: [2, 4],
              speed: [3, 5],
              directionMin: [0, 0.5, 0],
              directionMax: [0.5, 1, 0],
              rotationSpeedMin: [0, 0, 0],
              rotationSpeedMax: [0, 0, 0],
              colorStart: ["#ffa600"],
              colorEnd: ["#555"],
              size: [0.04, 0.1],
            }}
          />
        </group>
      </group>
    </>
  );
};
