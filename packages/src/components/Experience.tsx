import { Environment, OrbitControls, Stats } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { button, useControls } from "leva";
import { useRef } from "react";
import VFXEmitter, { VFXEmitterRef } from "./vfxs/VFXEmitter";
import VFXParticles from "./vfxs/VFXParticles";
import {
  AppearanceMode,
  EaseFunction,
  easeFunctionList,
  RenderMode,
} from "./vfxs/types";
import { Group } from "three";

export const Experience = () => {
  const { component } = useControls("Component", {
    component: {
      label: "Component",
      options: ["BaseVFX", "StretchBillboard"],
      value: "StretchBillboard",
    },
  });
  return (
    <>
      <Stats />
      <OrbitControls enablePan={false} />
      <Environment preset="sunset" />
      {component === "BaseVFX" && <BaseVFX />}
      {component === "StretchBillboard" && <StretchBillboard />}
      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={1} mipmapBlur />
      </EffectComposer>
    </>
  );
};

function StretchBillboard() {
  const emitterBlue = useRef<VFXEmitterRef>(null);
  const groupRef = useRef<Group>(null);

  const { easing, renderMode } = useControls("Emitter External Controls", {
    start: button(() => {
      emitterBlue.current?.startEmitting();
    }),
    startWithReset: button(() => {
      emitterBlue.current?.startEmitting(true);
    }),
    stop: button(() => {
      emitterBlue.current?.stopEmitting();
    }),
    easing: {
      label: "Easing",
      options: easeFunctionList,
      value: "easeLinear",
    },
    renderMode: {
      label: "renderMode",
      options: ["mesh", "billboard", "stretchBillboard"],
      value: "stretchBillboard",
    },
  });

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (emitterBlue.current && groupRef.current) {
      groupRef.current.rotation.z += delta * 10;
    }
  });
  return (
    <>
      <VFXParticles
        name="sparks"
        settings={{
          nbParticles: 200000,
          intensity: 0.5,
          renderMode: renderMode as RenderMode,
          stretchScale: 0.2,
          fadeSize: [0, 0],
          fadeAlpha: [0, 0],
          gravity: [0, 0, 0],
          appearance: AppearanceMode.Circular,
          easeFunction: easing as EaseFunction,
        }}
      />
      <group ref={groupRef}>
        <group position={[2, 0, 0]}><VFXEmitter
          debug
          ref={emitterBlue}
          emitter="sparks"
          localDirection={true}
          settings={{
            duration: 0.0001,
            delay: 0,
            nbParticles: 5,
            spawnMode: "time",
            loop: true,
            startPositionMin: [0, -0.2, -0.2],
            startPositionMax: [0, 0.2, 0.2],
            startRotationMin: [0, 0, 0],
            startRotationMax: [0, 0, 0],
            particlesLifetime: [0.5, 1],
            speed: [4, 5],
            directionMin: [0., 0.7, 0],
            directionMax: [0.5, 1, 0.5],
            rotationSpeedMin: [0, 0, 0],
            rotationSpeedMax: [0, 0, 0],
            colorStart: ["#ffa600"],
            colorEnd: ["#000000"],
            size: [0.04, 0.1],
          }}
        />
      
        </group> 
      </group>
    </>
  );
}

function BaseVFX() {
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
      emitterBlue.current.position.x = Math.cos(time * 3) * 1.5;
      emitterBlue.current.position.y = Math.sin(time * 3) * 1.5;
      // emitterBlue.current.position.z = Math.cos(time * 4) * 1.5;

      // now you can stop or start emitting using the methods stopEmitting or startEmitting by accessing the emitterBlue ref.current object
    }
  });
  return (
    <>
      <VFXParticles
        name="sparks"
        geometry={<capsuleGeometry args={[0.02, 0.2, 1, 8]} />}
        settings={{
          nbParticles: 100000,
          intensity: 1.5,
          renderMode: RenderMode.Billboard,
          fadeSize: [0, 1],
          fadeAlpha: [0.5, 0.5],
          gravity: [, -10, 0],
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
          loop: true,
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
    </>
  );
}
