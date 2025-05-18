import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import { VFXEmitter, VFXParticles } from "wawa-vfx";

const tmpVector = new Vector3();

export const StretchedBillboard = () => {
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
          gravity: [0, -10, 0],
          fadeSize: [0, 0],
          fadeOpacity: [0, 0],
          renderMode: "stretchBillboard",
          intensity: 6,
          stretchScale: 0.4,
        }}
      />

      <group ref={emitter}>
        <mesh>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="red"
            emissive={"red"}
            emissiveIntensity={8}
          />
        </mesh>
        <VFXEmitter
          // debug
          emitter="particles"
          settings={{
            loop: true,
            duration: 1,
            nbParticles: 500,
            particlesLifetime: [0.1, 1],
            startPositionMin: [-0.1, -0.1, -0.1],
            startPositionMax: [0.1, 0.1, 0.1],
            directionMin: [-0.5, 0, -0.5],
            directionMax: [0.5, 1, 0.5],
            size: [0.01, 0.1],
            speed: [3, 8],
            colorStart: ["red", "pink", "mediumpurple"],
          }}
        />
      </group>
    </>
  );
};
