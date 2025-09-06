import { useFrame } from "@react-three/fiber";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { VFXEmitterCore, VFXEmitterSettings } from "wawa-vfx-vanilla";
import { VFXBuilderEmitter } from "./VFXBuilder";

export type { VFXEmitterSettings };

interface VFXEmitterProps {
  debug?: boolean;
  settings: VFXEmitterSettings;
  emitter: string;
  localDirection?: boolean;
  autoStart?: boolean;
}

export interface VFXEmitterRef extends THREE.Object3D {
  startEmitting: (reset?: boolean) => void;
  stopEmitting: () => void;
  emitAtPos: (position: THREE.Vector3 | null, reset?: boolean) => void;
}

const VFXEmitter = forwardRef<VFXEmitterRef, VFXEmitterProps>(
  (
    {
      debug,
      emitter,
      settings = {},
      localDirection = false,
      autoStart = true,
      ...props
    },
    forwardedRef
  ) => {
    const [currentSettings, setSettings] = useState(settings);
    const ref = useRef<THREE.Object3D>(null!);
    const emitterCoreRef = useRef<VFXEmitterCore | null>(null);

    useEffect(() => {
      if (!emitterCoreRef.current && ref.current) {
        emitterCoreRef.current = new VFXEmitterCore(
          emitter,
          currentSettings,
          undefined, // Will use the global store
          localDirection,
          autoStart
        );
        ref.current.add(emitterCoreRef.current);
      }

      return () => {
        if (emitterCoreRef.current && ref.current) {
          ref.current.remove(emitterCoreRef.current);
          emitterCoreRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      if (emitterCoreRef.current) {
        emitterCoreRef.current.updateSettings(currentSettings);
      }
    }, [currentSettings]);

    const stopEmitting = useCallback(() => {
      if (emitterCoreRef.current) {
        emitterCoreRef.current.stopEmitting();
      }
    }, []);

    const startEmitting = useCallback((reset: boolean = false) => {
      if (emitterCoreRef.current) {
        emitterCoreRef.current.startEmitting(reset);
      }
    }, []);

    const emitAtPos = useCallback(
      (pos: THREE.Vector3 | null, reset: boolean = false) => {
        if (emitterCoreRef.current) {
          emitterCoreRef.current.emitAtPos(pos, reset);
        }
      },
      []
    );

    useImperativeHandle(
      forwardedRef,
      () => {
        const obj = ref.current;
        return Object.assign(obj, {
          stopEmitting,
          startEmitting,
          emitAtPos,
        });
      },
      [stopEmitting, startEmitting, emitAtPos]
    );

    useFrame(({ clock }, delta) => {
      if (emitterCoreRef.current) {
        emitterCoreRef.current.update(clock.getElapsedTime(), delta);
      }
    });

    const onRestart = useCallback(() => {
      if (emitterCoreRef.current) {
        emitterCoreRef.current.restart();
      }
    }, []);

    const settingsBuilder = useMemo(
      () =>
        debug ? (
          <VFXBuilderEmitter
            settings={settings}
            onChange={setSettings}
            onRestart={onRestart}
          />
        ) : null,
      [debug]
    );

    return (
      <>
        {settingsBuilder}
        <object3D {...props} ref={ref} />
      </>
    );
  }
);

export default VFXEmitter;
