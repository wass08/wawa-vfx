// Vanilla Three.js exports (no React dependencies)
// Export with aliases for vanilla users
export { 
  VFXEmitterCore as VFXEmitter, 
  VFXParticlesCore as VFXParticles
} from "./core";

// Also export the Core versions directly for the React package
export { 
  VFXEmitterCore,
  VFXParticlesCore
} from "./core";

export type { 
  VFXEmitterSettings,
  VFXParticlesSettings,
  EmitCallbackSettings,
  EmitCallbackSettingsFn
} from "./core";

// Types and enums
export { AppearanceMode, RenderMode } from "./types";
export type { EaseFunction } from "./types";

// Store (works without React)
export { vfxStore } from "./VFXStore";