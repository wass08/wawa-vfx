// React Three Fiber exports
export { default as VFXEmitter } from "./VFXEmitter";
export { default as VFXParticles } from "./VFXParticles";

// Re-export types from vanilla package
export type { 
  VFXEmitterSettings,
  VFXParticlesSettings,
  EaseFunction
} from "wawa-vfx-vanilla";

// Re-export enums from vanilla package
export { AppearanceMode, RenderMode } from "wawa-vfx-vanilla";

// Re-export store hook from vanilla package
export { useVFX } from "wawa-vfx-vanilla";