import { useTexture } from "@react-three/drei";
import { VFXEmitter, VFXParticles } from "wawa-vfx";

export const AlphaMap = () => {
  const heartTexture = useTexture("/textures/symbol_01.png");
  const starTexture = useTexture("/textures/symbol_02.png");
  return (
    <>
      <VFXParticles
        name="hearts"
        settings={{
          nbParticles: 100000,
          gravity: [0, 0, 0],
          fadeSize: [0.5, 0.5],
          fadeOpacity: [0.5, 0.5],
          renderMode: "billboard",
          intensity: 6,
        }}
        alphaMap={heartTexture}
      />
      <VFXParticles
        name="stars"
        settings={{
          nbParticles: 100000,
          gravity: [0, 0, 0],
          fadeSize: [0.5, 0.5],
          fadeOpacity: [0.5, 0.5],
          renderMode: "billboard",
          intensity: 3,
        }}
        alphaMap={starTexture}
      />
      <VFXEmitter
        emitter="hearts"
        settings={{
          loop: true,
          duration: 1,
          nbParticles: 1000,
          startPositionMin: [-1, -12, -1],
          startPositionMax: [1, 12, 1],
          directionMin: [0, 1, 0],
          directionMax: [2, 1, 0],
          size: [0.01, 2],
          particlesLifetime: [1, 8],
          speed: [1, 5],
          colorStart: ["red", "darkred"],
          startRotationMin: [0, 0, -1],
          startRotationMax: [0, 0, 1],
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 5],
        }}
      />
      <VFXEmitter
        emitter="stars"
        settings={{
          loop: true,
          duration: 1,
          nbParticles: 1000,
          startPositionMin: [-1, -12, -1],
          startPositionMax: [1, 12, 1],
          directionMin: [-2, 1, 0],
          directionMax: [0, 1, 0],
          size: [0.01, 2],
          particlesLifetime: [1, 8],
          speed: [1, 5],
          colorStart: ["orange", "yellow", "white"],
          startRotationMin: [0, 0, -1],
          startRotationMax: [0, 0, 1],
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 5],
        }}
      />
    </>
  );
};

useTexture.preload("/textures/symbol_01.png");
useTexture.preload("/textures/symbol_02.png");
