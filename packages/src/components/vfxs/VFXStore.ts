import { create } from "zustand";

interface EmitCallbackSettings {
  position: [number, number, number];
  direction: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  rotationSpeed: [number, number, number];
  lifetime: [number, number];
  colorStart: string;
  colorEnd: string;
  speed: [number];
}

export type EmitCallbackSettingsFn = () => EmitCallbackSettings;

interface VFXStore {
  emitters: Record<string, (...args: any[]) => void>;
  registerEmitter: (name: string, emitter: (...args: any[]) => void) => void;
  unregisterEmitter: (name: string) => void;
  emit: (name: string, rate: number, callback: EmitCallbackSettingsFn) => void;
}

export const useVFX = create<VFXStore>((set, get) => ({
  emitters: {},
  registerEmitter: (name: string, emitter) => {
    if (get().emitters[name]) {
      console.warn(`Emitter ${name} already exists`);
      return;
    }
    set((state) => {
      state.emitters[name] = emitter;
      return state;
    });
  },
  unregisterEmitter: (name) => {
    set((state) => {
      delete state.emitters[name];
      return state;
    });
  },
  emit: (name, ...params) => {
    const emitter = get().emitters[name];
    if (!emitter) {
      console.warn(`Emitter ${name} not found`);
      return;
    }
    emitter(...params);
  },
}));
