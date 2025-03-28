import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import { VFXEmitter, VFXParticles } from "wawa-vfx";

const tmpVector = new Vector3();

export const Emitter = () => {
  const emitter = useRef();

  useFrame(({ clock }, delta) => {
    if (emitter.current) {
      const time = clock.getElapsedTime();
      tmpVector.set(
        Math.sin(time) * 4,
        Math.cos(time * 2) * 6,
        Math.sin(time * 4) * 8
      );
      emitter.current.position.lerp(tmpVector, delta * 2);
    }
  });
  return (
    <>
      <VFXParticles
        name="particles"
        settings={{
          nbParticles: 100000,
          gravity: [0, -9.8, 0],
          fadeSize: [0, 0],
          fadeOpacity: [0, 0],
          renderMode: "billboard",
          intensity: 6,
        }}
      />

      <group ref={emitter}>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="white"
            emissive={"pink"}
            emissiveIntensity={3}
          />
        </mesh>
        <VFXEmitter
          debug
          emitter="particles"
          settings={{
            loop: true,
            duration: 1,
            nbParticles: 1000,
            startPositionMin: [-0.1, -0.1, -0.1],
            startPositionMax: [0.1, 0.1, 0.1],
            directionMin: [-0.5, 0, -0.5],
            directionMax: [0.5, 1, 0.5],
            size: [0.01, 0.35],
            speed: [1, 12],
            colorStart: ["pink", "skyblue"],
            colorEnd: ["pink", "blue"],
          }}
        />
      </group>
    </>
  );
};
