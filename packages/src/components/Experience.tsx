import { Environment, OrbitControls, Stats } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { button, useControls } from "leva";
import { useRef } from "react";
import { Group, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils.js";
import VFXEmitter, { VFXEmitterRef } from "./vfxs/VFXEmitter";
import VFXParticles from "./vfxs/VFXParticles";
import {
  AppearanceMode,
  EaseFunction,
  easeFunctionList,
  RenderMode,
} from "./vfxs/types";

export const Experience = () => {
  const { component } = useControls("Component", {
    component: {
      label: "Component",
      options: ["Fireworks", "BaseVFX", "StretchBillboard"],
      value: "Fireworks",
    },
  });
  return (
    <>
      <Stats />
      <OrbitControls enablePan={false} />
      <Environment preset="sunset" />
      {component === "BaseVFX" && <BaseVFX />}
      {component === "StretchBillboard" && <StretchBillboard />}
      {component === "Fireworks" && <Fireworks />}
      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={1} mipmapBlur />
      </EffectComposer>
    </>
  );
};

function Fireworks() {
  const emitter = useRef<VFXEmitterRef>(null);
  const groupRef = useRef<Group>(null);
  const lastShotTime = useRef<number>(0);
  const missileRef = useRef<VFXEmitterRef>(null);

  const xTarget = useRef<number>((Math.random() - 0.5) * 6);
  const yTarget = useRef<number>(Math.random() * 2 + 1);
  const zTarget = useRef<number>((Math.random() - 0.5) * 6);
  useFrame((_, delta) => {
    if (emitter.current && groupRef.current && missileRef.current) {
      lastShotTime.current += delta;
      if (lastShotTime.current > 1) {
        missileRef.current.startEmitting();
        groupRef.current.position.y = lerp(
          groupRef.current.position.y,
          yTarget.current,
          2 * delta
        );
        groupRef.current.position.x = lerp(
          groupRef.current.position.x,
          xTarget.current,
          1 * delta
        );
        groupRef.current.position.z = lerp(
          groupRef.current.position.z,
          zTarget.current,
          2 * delta
        );
        if (groupRef.current.position.y > yTarget.current - 1) {
          missileRef.current.stopEmitting();
          if (groupRef.current.position.y > yTarget.current - 0.1) {
            emitter.current.emitAtPos(
              groupRef.current.getWorldPosition(new Vector3()),
              true
            );
            lastShotTime.current = 0;
            groupRef.current.position.y = -2;
            groupRef.current.position.x = 0;
            xTarget.current = (Math.random() - 0.5) * 6;
            yTarget.current = Math.random() * 2 + 1;
            zTarget.current = (Math.random() - 0.5) * 6;
          }
        }
      }
    }
  });

  return (
    <>
      <VFXParticles
        name="fireworks"
        settings={{
          nbParticles: 100000,
          intensity: 10,
          renderMode: RenderMode.Billboard,
          stretchScale: 1,
          fadeSize: [0, 0],
          fadeAlpha: [0, 1],
          gravity: [0, 0, 0],
          appearance: AppearanceMode.Circular,
          easeFunction: "easeOutQuint",
        }}
      />
      <VFXParticles
        name="fireworks-missile"
        settings={{
          nbParticles: 10000,
          intensity: 3,
          renderMode: RenderMode.Billboard,
          fadeSize: [0, 0],
          fadeAlpha: [0, 1],
          gravity: [0, 0, 0],
          appearance: AppearanceMode.Circular,
          // easeFunction: "easeInPower3",
        }}
      />
      <group ref={groupRef} position-y={-3}>
        <VFXEmitter
          emitter="fireworks-missile"
          // debug
          autoStart={false}
          ref={missileRef}
          settings={{
            duration: 0.0001,
            delay: 0,
            nbParticles: 1,
            spawnMode: "time",
            loop: true,
            startPositionMin: [-0.01, -0.01, -0.01],
            startPositionMax: [0.01, 0.01, 0.01],
            startRotationMin: [0, 0, 0],
            startRotationMax: [0, 0, 0],
            particlesLifetime: [0.5, 0.8],
            speed: [0.1, 0.2],
            directionMin: [-1, 0, -1],
            directionMax: [1, -1, 1],
            rotationSpeedMin: [0, 0, 0],
            rotationSpeedMax: [0, 0, 0],
            colorStart: ["#FF003C", "#FFA500", "#FF69B4"],
            colorEnd: ["#000000"],
            size: [0.01, 0.04],
          }}
        />
      </group>
      <VFXEmitter
        emitter="fireworks"
        ref={emitter}
        // debug
        autoStart={false}
        localDirection={true}
        settings={{
          duration: 4,
          delay: 0,
          nbParticles: 10000,
          spawnMode: "burst",
          loop: true,
          startPositionMin: [0, 0, 0],
          startPositionMax: [0, 0, 0],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          particlesLifetime: [2, 5],
          speed: [1, 2],
          directionMin: [-1, -1, -1],
          directionMax: [1, 1, 1],
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 0],
          colorStart: ["#FF003C", "#FFA500", "#FF69B4"],
          colorEnd: ["#000000"],
          size: [0.1, 0.2],
        }}
      />
    </>
  );
}

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

  useFrame((_, delta) => {
    if (emitterBlue.current && groupRef.current) {
      groupRef.current.rotation.z += delta * 20;
    }
  });
  return (
    <>
      <VFXParticles
        name="sparks"
        settings={{
          nbParticles: 500000,
          intensity: 0.5,
          renderMode: renderMode as RenderMode,
          stretchScale: 0.1,
          fadeSize: [0, 0],
          fadeAlpha: [0, 0],
          gravity: [0, 0, 0],
          appearance: AppearanceMode.Circular,
          easeFunction: easing as EaseFunction,
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
              duration: 0.001,
              delay: 0,
              nbParticles: 1,
              spawnMode: "time",
              loop: true,
              startPositionMin: [0, 0, -0.2],
              startPositionMax: [0, 0, 0.2],
              startRotationMin: [0, 0, 0],
              startRotationMax: [0, 0, 0],
              particlesLifetime: [0.5, 1],
              speed: [4, 5],
              directionMin: [0, 1, 0],
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
