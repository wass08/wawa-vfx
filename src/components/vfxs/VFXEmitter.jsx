import { useFrame } from "@react-three/fiber";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Euler, Quaternion, Vector3 } from "three";
import { randFloat, randInt } from "three/src/math/MathUtils.js";
import { VFXBuilderEmitter } from "./VFXBuilder";
import { useVFX } from "./VFXStore";

const worldPosition = new Vector3();
const worldQuaternion = new Quaternion();
const worldEuler = new Euler();
const worldRotation = new Euler();
const worldScale = new Vector3();

/**
 * @typedef {Object} VFXEmitterSettings
 * @property {number} [duration=1]
 * @property {number} [nbParticles=1000]
 * @property {"time"|"burst"} [spawnMode="time"]
 * @property {boolean} [loop=false]
 * @property {number} [delay=0]
 * @property {string[]} [colorStart=["white", "skyblue"]]
 * @property {string[]} [colorEnd=[]]
 * @property {[number, number]} [particlesLifetime=[0.1, 1]]
 * @property {[number, number]} [speed=[5, 20]]
 * @property {[number, number]} [size=[0.1, 1]]
 * @property {[number, number, number]} [startPositionMin=[-1, -1, -1]]
 * @property {[number, number, number]} [startPositionMax=[1, 1, 1]]
 * @property {[number, number, number]} [startRotationMin=[0, 0, 0]]
 * @property {[number, number, number]} [startRotationMax=[0, 0, 0]]
 * @property {[number, number, number]} [rotationSpeedMin=[0, 0, 0]]
 * @property {[number, number, number]} [rotationSpeedMax=[0, 0, 0]]
 * @property {[number, number, number]} [directionMin=[0, 0, 0]]
 * @property {[number, number, number]} [directionMax=[0, 0, 0]]
 */

/**
 * @typedef {Object} VFXEmitterProps
 * @property {boolean} [debug]
 * @property {VFXEmitterSettings} [settings]
 * @property {string} emitter
 * @property {React.RefObject<THREE.Object3D>} [ref]
 */

/**
 * @type React.FC<VFXEmitterProps>
 */
const VFXEmitter = forwardRef(
  ({ debug, emitter, settings = {}, ...props }, forwardedRef) => {
    const [
      {
        duration = 1,
        nbParticles = 1000,
        spawnMode = "time", // time, burst
        loop = false,
        delay = 0,
        colorStart = ["white", "skyblue"],
        colorEnd = [],
        particlesLifetime = [0.1, 1],
        speed = [5, 20],
        size = [0.1, 1],
        startPositionMin = [-1, -1, -1],
        startPositionMax = [1, 1, 1],
        startRotationMin = [0, 0, 0],
        startRotationMax = [0, 0, 0],
        rotationSpeedMin = [0, 0, 0],
        rotationSpeedMax = [0, 0, 0],
        directionMin = [0, 0, 0],
        directionMax = [0, 0, 0],
      },
      setSettings,
    ] = useState(settings);

    const emit = useVFX((state) => state.emit);

    const ref = useRef();
    useImperativeHandle(forwardedRef, () => ref.current);

    const emitted = useRef(0);
    const elapsedTime = useRef(0);

    useFrame(({ clock }, delta) => {
      const time = clock.getElapsedTime();

      if (emitted.current < nbParticles || loop) {
        if (!ref) {
          return;
        }
        const particlesToEmit =
          spawnMode === "burst"
            ? nbParticles
            : Math.max(
                0,
                Math.floor(
                  ((elapsedTime.current - delay) / duration) * nbParticles
                )
              );

        const rate = particlesToEmit - emitted.current;
        if (rate > 0 && elapsedTime.current >= delay) {
          emit(emitter, rate, () => {
            ref.current.updateWorldMatrix(true);
            const worldMatrix = ref.current.matrixWorld;
            worldMatrix.decompose(worldPosition, worldQuaternion, worldScale);
            worldEuler.setFromQuaternion(worldQuaternion);
            worldRotation.setFromQuaternion(worldQuaternion);

            const randSize = randFloat(size[0], size[1]);
            const color = colorStart[randInt(0, colorStart.length - 1)];
            return {
              position: [
                worldPosition.x +
                  randFloat(startPositionMin[0], startPositionMax[0]),
                worldPosition.y +
                  randFloat(startPositionMin[1], startPositionMax[1]),
                worldPosition.z +
                  randFloat(startPositionMin[2], startPositionMax[2]),
              ],
              direction: [
                randFloat(directionMin[0], directionMax[0]),
                randFloat(directionMin[1], directionMax[1]),
                randFloat(directionMin[2], directionMax[2]),
              ],
              scale: [randSize, randSize, randSize],
              rotation: [
                worldRotation.x +
                  randFloat(startRotationMin[0], startRotationMax[0]),
                worldRotation.y +
                  randFloat(startRotationMin[1], startRotationMax[1]),
                worldRotation.z +
                  randFloat(startRotationMin[2], startRotationMax[2]),
              ],
              rotationSpeed: [
                randFloat(rotationSpeedMin[0], rotationSpeedMax[0]),
                randFloat(rotationSpeedMin[1], rotationSpeedMax[1]),
                randFloat(rotationSpeedMin[2], rotationSpeedMax[2]),
              ],
              lifetime: [
                time,
                randFloat(particlesLifetime[0], particlesLifetime[1]),
              ],
              colorStart: color,
              colorEnd: colorEnd?.length
                ? colorEnd[randInt(0, colorEnd.length - 1)]
                : color,
              speed: [randFloat(speed[0], speed[1])],
            };
          });
          emitted.current += rate;
        }
      }
      elapsedTime.current += delta;
    });

    const onRestart = useCallback(() => {
      emitted.current = 0;
      elapsedTime.current = 0;
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
