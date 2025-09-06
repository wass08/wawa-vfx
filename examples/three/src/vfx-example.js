import * as THREE from "three";
import {
  AppearanceMode,
  RenderMode,
  VFXEmitter,
  VFXParticles,
} from "wawa-vfx-vanilla";

export function setupVFXExample(scene) {
  // Create particles system
  const particlesSettings = {
    nbParticles: 10000,
    intensity: 1.5,
    renderMode: RenderMode.Billboard,
    fadeSize: [0, 0],
    fadeAlpha: [0, 0.5],
    gravity: [0, -9.8, 0],
    appearance: AppearanceMode.Circular,
    easeFunction: "easeOutQuad",
    blendingMode: THREE.AdditiveBlending,
  };

  const particles = new VFXParticles("mainParticles", particlesSettings);

  // Add particles mesh to scene
  scene.add(particles.getMesh());

  // Create emitter
  const emitterSettings = {
    duration: 1,
    nbParticles: 1000,
    spawnMode: "time",
    loop: true,
    delay: 0,
    colorStart: ["orange", "#ffffff"],
    colorEnd: ["pink", "#ffffff"],
    particlesLifetime: [0.5, 2],
    speed: [1, 10],
    size: [0.1, 0.3],
    startPositionMin: [-0.1, -0.1, -0.1],
    startPositionMax: [0.1, 0.1, 0.1],
    directionMin: [-1, 0, -1],
    directionMax: [1, 2, 1],
  };

  const emitter = new VFXEmitter("mainParticles", emitterSettings);

  // Position the emitter
  emitter.position.set(0, 0, 0);
  scene.add(emitter);

  // Return update function for animation loop
  return {
    update: (time, delta) => {
      emitter.update(time, delta);
      particles.update(time);
    },
    emitter,
    particles,
  };
}
