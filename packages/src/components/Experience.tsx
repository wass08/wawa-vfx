import { Environment, OrbitControls, Stats } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { button, useControls } from "leva";
import { useRef } from "react";
import VFXEmitter, { VFXEmitterRef } from "./vfxs/VFXEmitter";
import VFXParticles from "./vfxs/VFXParticles";

export const Experience = () => {
  const emitterBlue = useRef<VFXEmitterRef>(null);

  useControls("Emitter External Controls", {
    start: button(() => {
      emitterBlue.current?.startEmitting();
    }),
    startWithReset: button(() => {
      emitterBlue.current?.startEmitting(true);
    }),
    stop: button(() => {
      emitterBlue.current?.stopEmitting();
    }),
  });

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (emitterBlue.current) {
      emitterBlue.current.position.x = Math.cos(time * 6) * 1.5;
      emitterBlue.current.position.y = Math.sin(time * 3) * 1.5;
      emitterBlue.current.position.z = Math.cos(time * 4) * 1.5;

      // now you can stop or start emitting using the methods stopEmitting or startEmitting by accessing the emitterBlue ref.current object
    }
  });

  return (
    <>
      <Stats />
      <OrbitControls enablePan={false} />
      <Environment preset="sunset" />
      <VFXParticles
        name="sparks"
        geometry={<capsuleGeometry args={[0.02, 0.2, 1, 8]} />}
        settings={{
          nbParticles: 100000,
          intensity: 1.5,
          renderMode: "mesh",
          fadeSize: [0, 1],
          fadeAlpha: [0.5, 0.5],
          gravity: [0, -10, 0],
        }}
      />
      <VFXEmitter
        debug
        ref={emitterBlue}
        emitter="sparks"
        settings={{
          duration: 4,
          delay: 0,
          nbParticles: 5000,
          spawnMode: "time",
          loop: false,
          startPositionMin: [0, 0, 0],
          startPositionMax: [0, 0, 0],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          particlesLifetime: [0.1, 1],
          speed: [1, 5],
          directionMin: [-0.5, 0, -0.5],
          directionMax: [0.5, 1, 0.5],
          rotationSpeedMin: [10, 0, 10],
          rotationSpeedMax: [10, 0, 10],
          colorStart: ["#50ff7c"],
          colorEnd: ["#ffffff"],
          size: [0.1, 1],
        }}
      />
      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={1} mipmapBlur />
      </EffectComposer>
    </>
  );
};
