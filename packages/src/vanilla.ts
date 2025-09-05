// Vanilla Three.js exports (no React dependencies)
export { 
  VFXEmitterCore as VFXEmitter, 
  VFXParticlesCore as VFXParticles
} from "./components/vfxs/core";

export type { 
  VFXEmitterSettings,
  VFXParticlesSettings,
  EmitCallbackSettings,
  EmitCallbackSettingsFn
} from "./components/vfxs/core";

// Types and enums
export { AppearanceMode, RenderMode } from "./components/vfxs/types";
export type { EaseFunction } from "./components/vfxs/types";

// Store (works without React)
export { useVFX } from "./components/vfxs/VFXStore";