import { AppearanceMode, VFXEmitter, VFXParticles } from "wawa-vfx";

export const Reverse = () => {
  return (
    <>
      <VFXParticles
        name="particles"
        settings={{
          nbParticles: 100000,
          gravity: [0, -6, 0],
          fadeSize: [0, 0],
          fadeOpacity: [0, 0],
          renderMode: "billboard",
          intensity: 8,
          appearance: AppearanceMode.Circular,
        }}
      />

      <VFXEmitter
        emitter="particles"
        settings={{
          loop: true,
          duration: 1,
          nbParticles: 1000,
          startPositionMin: [-0.1, -0.1, -0.1],
          startPositionMax: [0.1, 0.1, 0.1],
          directionMin: [-1, -1, -1],
          directionMax: [1, 1, 1],
          size: [0.01, 0.35],
          speed: [-1, -18],
          colorStart: ["#bc7eff", "#ffce26"],
        }}
      />
    </>
  );
};
