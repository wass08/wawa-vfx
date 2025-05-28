import { Environment, OrbitControls, Stats, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { button, useControls } from "leva";
import { useRef } from "react";
import { DoubleSide, Group, Vector3 } from "three";
import VFXEmitter, { VFXEmitterRef } from "./vfxs/VFXEmitter";
import VFXParticles from "./vfxs/VFXParticles";
import {
  AppearanceMode,
  EaseFunction,
  easeFunctionList,
  RenderMode,
} from "./vfxs/types";
import { lerp } from "three/src/math/MathUtils.js";

export const Experience = () => {
  const { component } = useControls("Component", {
    component: {
      label: "Component",
      options: ["Fireworks", "BaseVFX", "StretchBillboard", "RadialVFX"],
      value: "RadialVFX",
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
      {component === "RadialVFX" && <RadialVFX />}
      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={1} mipmapBlur />
      </EffectComposer>
    </>
  );
};

function Fireworks() {
  const emitter = useRef<VFXEmitterRef>(null);

  const lastShotTime = useRef<number>(0);

  const xTarget = useRef<number>((Math.random() - 0.5) * 6);
  const yTarget = useRef<number>(Math.random() * 2 + 1);
  const zTarget = useRef<number>((Math.random() - 0.5) * 6);
  useFrame((_, delta) => {
    if (emitter.current) {
      lastShotTime.current += delta;
      if (lastShotTime.current > (Math.random() * 2) + 0.5) {
            emitter.current.emitAtPos(
              new Vector3(xTarget.current, yTarget.current, zTarget.current),
              true
            );
            lastShotTime.current = 0;

            xTarget.current = (Math.random() - 0.5) * 6;
            yTarget.current = Math.random() * 2 + 1;
            zTarget.current = (Math.random() - 0.5) * 6;
          }
        }
  });

  return (
    <>
      <VFXParticles
        name="fireworks"
        settings={{
          nbParticles: 100000,
          intensity: 0.1,
          renderMode: RenderMode.StretchBillboard,
          stretchScale: 2,
          fadeSize: [0, 0],
          fadeAlpha: [0, 1],
          gravity: [0, 0, 0],
          appearance: AppearanceMode.Circular,
          easeFunction: "easeOutQuint",
        }}
      />


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
          particlesLifetime: [5, 10],
          speed: [0.1, 0.5],
          directionMin: [-1, -1, -1],
          directionMax: [1, 1, 1],
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 0],
          colorStart: ["#FF003C", "#FFA500", "#FF69B4"],
          colorEnd: ["#000000"],
          size: [0.1, 0.3],
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
          renderMode: renderMode as RenderMode,
          stretchScale: 4,
          fadeSize: [0, 0],
          fadeAlpha: [0, 0],
          gravity: [0, -6, 0],
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
              speed: [4, 5],
              directionMin: [0, 1, 0],
              directionMax: [0.5, 1, 0.],
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


function RadialVFX() {
  const emitterBlue = useRef<VFXEmitterRef>(null);
  const groupRef = useRef<Group>(null);
  const materialRef = useRef(null)
  const sphereRef = useRef(null);
  const emitter2 = useRef(null);
  const emitter3 = useRef(null);
  const cylinderMaterialRef = useRef(null);
  const cylinderRef = useRef(null);

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
  
  const vertexShader = `
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float time;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
    }
  `;
  
  const fragmentShader = `
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float time;
    uniform sampler2D noiseTexture;
    vec2 hash(vec2 p) {
      p = vec2(
        dot(p, vec2(127.1, 311.7)),
        dot(p, vec2(269.5, 183.3))
      );
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }

    float noise(in vec2 p) {
      const float K1 = 0.366025404;
      const float K2 = 0.211324865;
    
      vec2 i = floor(p + (p.x + p.y) * K1);
      vec2 a = p - i + (i.x + i.y) * K2;
      vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec2 b = a - o + K2;
      vec2 c = a - 1.0 + 2.0 * K2;
    
      vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
      vec3 n = h * h * h * h * vec3(
        dot(a, hash(i + 0.0)),
        dot(b, hash(i + o)),
        dot(c, hash(i + 1.0))
      );
    
      return dot(n, vec3(70.0));
    }

    void main() {
      vec2 noiseUv = fract(vec2(vUv.x, vUv.y));
      float n = texture2D(noiseTexture, noiseUv * 1.0 - (time * 0.1)).r;
    
      float threshold = time * 3.; 
    
      float dissolve = smoothstep(threshold - 1.0, threshold, n);
    

    
      vec3 baseColor = vec3(1.0);
      vec3 edgeColor = vec3(1.0, 0.3, 0.0) * 5.0 + time * 50.;
    
      vec3 finalColor = baseColor;
    
      float alpha = dissolve;
      if (alpha < 0.001) discard;
    
      gl_FragColor = vec4(finalColor + edgeColor * alpha, alpha);
    }
  `;

  const noise = useTexture('./noise.png');
  useFrame(({ pointer, camera, clock}, delta) => {
    const time = clock.getElapsedTime();
    if (!emitterBlue.current) return;
    
    if(materialRef.current && sphereRef.current){
            // materialRef.current.uniforms.time.value += delta

      // materialRef.current.uniforms.time.value += delta;
      // 
      if(time > 6){
        const lerpingValue = lerp(sphereRef.current.scale.x, 2, 12 * delta);
        const cylinderLerpingValue = lerp(cylinderRef.current.scale.x, 6, 2 * delta);

        sphereRef.current.scale.x = lerpingValue;
        sphereRef.current.scale.y = lerpingValue;
        sphereRef.current.scale.z = lerpingValue;
        materialRef.current.uniforms.time.value += delta
        cylinderMaterialRef.current.uniforms.time.value += delta * 0.8;
        cylinderRef.current.scale.x = cylinderLerpingValue ;
        cylinderRef.current.scale.y = cylinderLerpingValue ;
        cylinderRef.current.scale.z = cylinderLerpingValue ; 
        emitter2.current.startEmitting();
        emitter3.current.startEmitting();

        
      }
      if(time > 5 && time < 6) {
        const lerpingValue = lerp(sphereRef.current.scale.x, 0, 12 * delta);
        sphereRef.current.scale.x = lerpingValue;
        sphereRef.current.scale.y = lerpingValue;
        sphereRef.current.scale.z = lerpingValue;
        // emitterBlue.current.stopEmitting();
      }
      if(time > 1 && time < 5){
        console.log(sphereRef.current.scale)
        const increase = delta * 0.1 + Math.sin(time * 99) * 0.1
        sphereRef.current.scale.x += increase;
        sphereRef.current.scale.y += increase;
        sphereRef.current.scale.z += increase;
        if(time > 4.4){
          emitterBlue.current.stopEmitting();
        }

      }
    }
  });
  return (
    <>
      <VFXParticles
        name="sparks"
        settings={{
          nbParticles: 10000,
          intensity: 5,
          renderMode: renderMode as RenderMode,
          stretchScale: 4,
          fadeSize: [1, 1],
          fadeAlpha: [0, 0],
          gravity: [0, 0, 0],
          appearance: AppearanceMode.Circular,
          radial: true,
          easeFunction: "easeInPower2",
        }}
      />
      <VFXParticles
        name="explode"
        settings={{
          nbParticles: 150,
          intensity: 30,
          renderMode: renderMode as RenderMode,
          stretchScale: 2,
          fadeSize: [1, 1],
          fadeAlpha: [0, 0],
          gravity: [0, 0, 0],
          appearance: AppearanceMode.Circular,
          // easeFunction: "easeOutPower4",
        }}
      />
      <VFXParticles
        name="explode-2"
        settings={{
          nbParticles: 150,
          intensity: 30,
          renderMode: RenderMode.Billboard,
          fadeSize: [1, 1],
          fadeAlpha: [0, 0],
          gravity: [0, 0, 0],
          appearance: AppearanceMode.Circular,
          // easeFunction: "easeOutPower4",
        }}
      />
      <VFXParticles
        name="test"
        geometry={<octahedronGeometry args={[0.1, 2]} />}
        settings={{
          nbParticles: 15,
          intensity: 1,
          renderMode: RenderMode.Mesh,
          stretchScale: 2,
          fadeSize: [1, 1],
          fadeAlpha: [0, 0],
          gravity: [0, 0, 0],
          // appearance: AppearanceMode.Circular,
          // easeFunction: "easeOu",
        }}
      />
      <group ref={groupRef}>
        <group position={[0, 0, 0]}>
          <mesh rotation={[1, 0, -0.1]} ref={cylinderRef} scale={[0, 0, 0]}>
            <cylinderGeometry args={[1, 1, 0.005, 128, 128, true]} />
          <shaderMaterial 
            ref={cylinderMaterialRef}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={{
                time: {value : 0},
                noiseTexture: {value: noise}
              }}
              side={DoubleSide}
            />          </mesh>
          <mesh ref={sphereRef} scale={[0, 0, 0]}>
            <sphereGeometry args={[1., 32, 32]}/>
            <shaderMaterial 
            ref={materialRef}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={{
                time: {value : 0},
                noiseTexture: {value: noise}
              }}
            />
          </mesh>
          <VFXEmitter
            // debug
            ref={emitterBlue}
            emitter="sparks"
            localDirection={true}
            settings={{
              duration: 0.01,
              delay: 0,
              nbParticles: 1,
              spawnMode: "time",
              loop: true,
              startPositionMin: [-2, -2, 0],
              startPositionMax: [2, 2, 0],
              startRotationMin: [0, 0, 0],
              startRotationMax: [0, 0, 0],
              particlesLifetime: [0.5, 1],
              speed: [0, 1],
              directionMin: [0, 0, 0],
              directionMax: [0, 0, 0],
              rotationSpeedMin: [0, 0, 0],
              rotationSpeedMax: [0, 0, 0],
              colorStart: ["#ffffff"],
              colorEnd: ["#ffffff"],
              size: [0.04, 0.1],
            }}
          />
          <VFXEmitter
            // debug
            // ref={emitterBlue}
            ref={emitter2}
            emitter="explode"
            localDirection={true}
            autoStart={false}
            settings={{
              duration: 0.01,
              delay: 0,
              nbParticles: 150,
              spawnMode: "burst",
              loop: false,
              startPositionMin: [0, 0, 0],
              startPositionMax: [0, 0, 0],
              startRotationMin: [0, 0, 0],
              startRotationMax: [0, 0, 0],
              particlesLifetime: [0.7, 1.2],
              speed: [4, 8],
              directionMin: [-2, -2, -2],
              directionMax: [2,2, 2],
              rotationSpeedMin: [0, 0, 0],
              rotationSpeedMax: [0, 0, 0],
              colorStart: ["#ff4400"],
              colorEnd: ["#ffffff"],
              size: [0.001, 0.1],
            }}
          />
                    <VFXEmitter
            // debug
            // ref={emitterBlue}
            ref={emitter3}
            emitter="explode-2"
            localDirection={true}
            autoStart={false}
            settings={{
              duration: 0.01,
              delay: 0,
              nbParticles: 150,
              spawnMode: "burst",
              loop: false,
              startPositionMin: [0, 0, 0],
              startPositionMax: [0, 0, 0],
              startRotationMin: [0, 0, 0],
              startRotationMax: [0, 0, 0],
              particlesLifetime: [0.7, 1.2],
              speed: [4, 8],
              directionMin: [-2, -2, -2],
              directionMax: [2,2, 2],
              rotationSpeedMin: [0, 0, 0],
              rotationSpeedMax: [0, 0, 0],
              colorStart: ["#ff4400"],
              colorEnd: ["#ffffff"],
              size: [0.001, 0.1],
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
