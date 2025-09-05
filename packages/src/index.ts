// React Three Fiber exports
export { default as VFXEmitter } from "./components/vfxs/VFXEmitter";
export { default as VFXParticles } from "./components/vfxs/VFXParticles";

// Settings types (useful for TypeScript users)
export type { 
  VFXEmitterSettings,
  VFXParticlesSettings
} from "./components/vfxs/core";

// Types and enums
export { AppearanceMode, RenderMode } from "./components/vfxs/types";
export type { EaseFunction } from "./components/vfxs/types";

// Store hook
export { useVFX } from "./components/vfxs/VFXStore";
