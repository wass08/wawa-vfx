// Core vanilla Three.js exports
export { 
  VFXEmitterCore, 
  VFXParticlesCore
} from "./components/vfxs/core";

export type { 
  VFXEmitterSettings,
  VFXParticlesSettings,
  EmitCallbackSettings,
  EmitCallbackSettingsFn
} from "./components/vfxs/core";

// React Three Fiber exports
export { default as VFXEmitter } from "./components/vfxs/VFXEmitter";
export { default as VFXParticles } from "./components/vfxs/VFXParticles";

// Types and enums
export { AppearanceMode, RenderMode } from "./components/vfxs/types";
export type { EaseFunction } from "./components/vfxs/types";

// Store hook
export { useVFX } from "./components/vfxs/VFXStore";
