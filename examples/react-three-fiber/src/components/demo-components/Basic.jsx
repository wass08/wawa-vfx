import { VFXEmitter, VFXParticles } from "wawa-vfx";

export const Basic = () => {
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
          intensity: 3,
        }}
      />

      <VFXEmitter
        debug
        emitter="particles"
        settings={{
          loop: true,
          duration: 1,
          nbParticles: 100,
          startPositionMin: [-0.1, -0.1, -0.1],
          startPositionMax: [0.1, 0.1, 0.1],
          directionMin: [-1, 0, -1],
          directionMax: [1, 1, 1],
          size: [0.01, 0.25],
          speed: [1, 12],
          colorStart: ["white", "skyblue"],
          colorEnd: ["white", "pink"],
        }}
      />
    </>
  );
};
