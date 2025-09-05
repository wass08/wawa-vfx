import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import { VFXEmitter, VFXParticles } from "wawa-vfx";

const tmpVector = new Vector3();

export const MultipleEmitters = () => {
  const emitter = useRef();
  const emitter2 = useRef();
  const emitter3 = useRef();
  const emitter4 = useRef();

  useFrame(({ clock }, delta) => {
    if (emitter.current) {
      const distance = 6;
      const time = clock.getElapsedTime();
      tmpVector.set(
        Math.sin(time * 8) * distance,
        Math.sin(time * 2) * 8,
        Math.cos(time * 8) * distance
      );
      emitter.current.position.lerp(tmpVector, delta * 2);
      tmpVector.set(
        Math.cos(time * 8) * distance,
        Math.sin(time * 2 + 50) * 8,
        Math.sin(time * 8) * distance
      );
      emitter2.current.position.lerp(tmpVector, delta * 2);

      tmpVector.set(
        Math.sin(time * 8) * distance,
        Math.sin(time * 2 + 100) * 8,
        Math.cos(time * 8) * distance
      );
      emitter3.current.position.lerp(tmpVector, delta * 2);

      tmpVector.set(
        Math.cos(time * 8) * distance,
        Math.sin(time * 2 + 150) * 8,
        Math.sin(time * 8) * distance
      );
      emitter4.current.position.lerp(tmpVector, delta * 2);
    }
  });

  const sharedSettings = {
    loop: true,
    duration: 1,
    nbParticles: 2000,
    startPositionMin: [0, 0, 0],
    startPositionMax: [0, 0, 0],
    directionMin: [-0.5, 0, -0.5],
    directionMax: [0.5, 0.5, 0.5],
    size: [0.01, 0.15],
    speed: [1, 3],
  };

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
          intensity: 4,
        }}
      />

      <group ref={emitter}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#ffb7e0"
            emissive={"#ffb7e0"}
            emissiveIntensity={3}
          />
        </mesh>
        <VFXEmitter
          emitter="particles"
          settings={{
            ...sharedSettings,
            colorStart: ["#ff41ad", "#ffaedc"],
            colorEnd: ["pink", "#ff39a9"],
          }}
        />
      </group>
      <group ref={emitter2}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#94bfff"
            emissive={"#94bfff"}
            emissiveIntensity={3}
          />
        </mesh>
        <VFXEmitter
          emitter="particles"
          settings={{
            ...sharedSettings,
            colorStart: ["#416bff", "skyblue"],
            colorEnd: ["skyblue", "#94bfff"],
          }}
        />
      </group>
      <group ref={emitter3}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#76ffb0"
            emissive={"#76ffb0"}
            emissiveIntensity={3}
          />
        </mesh>
        <VFXEmitter
          emitter="particles"
          settings={{
            ...sharedSettings,
            colorStart: ["#76ffb0", "#94ffc1"],
            colorEnd: ["#94fff9", "white"],
          }}
        />
      </group>
      <group ref={emitter4}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="white"
            emissive={"white"}
            emissiveIntensity={3}
          />
        </mesh>
        <VFXEmitter
          emitter="particles"
          settings={{
            ...sharedSettings,
            colorStart: ["white", "yellow"],
            colorEnd: ["white", "orange"],
          }}
        />
      </group>
    </>
  );
};
