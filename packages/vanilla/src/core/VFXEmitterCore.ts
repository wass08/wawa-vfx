import * as THREE from "three";
import { useVFX } from "../VFXStore";

export interface VFXEmitterSettings {
  duration?: number;
  nbParticles?: number;
  spawnMode?: "time" | "burst";
  loop?: boolean;
  delay?: number;
  colorStart?: string[];
  colorEnd?: string[];
  particlesLifetime?: [number, number];
  speed?: [number, number];
  size?: [number, number];
  startPositionMin?: [number, number, number];
  startPositionMax?: [number, number, number];
  startRotationMin?: [number, number, number];
  startRotationMax?: [number, number, number];
  rotationSpeedMin?: [number, number, number];
  rotationSpeedMax?: [number, number, number];
  directionMin?: [number, number, number];
  directionMax?: [number, number, number];
}

const worldPosition = new THREE.Vector3();
const worldQuaternion = new THREE.Quaternion();
const worldEuler = new THREE.Euler();
const worldRotation = new THREE.Euler();
const worldScale = new THREE.Vector3();

export class VFXEmitterCore extends THREE.Object3D {
  private settings: Required<VFXEmitterSettings>;
  private emitted: number = 0;
  private elapsedTime: number = 0;
  private currentTime: number = 0;
  private shouldEmit: boolean;
  private emitterName: string;
  private localDirection: boolean;
  private store: ReturnType<typeof useVFX.getState>;

  constructor(
    emitterName: string,
    settings: VFXEmitterSettings = {},
    store?: ReturnType<typeof useVFX.getState>,
    localDirection: boolean = false,
    autoStart: boolean = true
  ) {
    super();
    this.emitterName = emitterName;
    this.localDirection = localDirection;
    this.shouldEmit = autoStart;
    this.store = store || useVFX.getState();

    this.settings = {
      duration: settings.duration ?? 1,
      nbParticles: settings.nbParticles ?? 1000,
      spawnMode: settings.spawnMode ?? "time",
      loop: settings.loop ?? false,
      delay: settings.delay ?? 0,
      colorStart: settings.colorStart ?? ["white", "skyblue"],
      colorEnd: settings.colorEnd ?? [],
      particlesLifetime: settings.particlesLifetime ?? [0.1, 1],
      speed: settings.speed ?? [5, 20],
      size: settings.size ?? [0.1, 1],
      startPositionMin: settings.startPositionMin ?? [-1, -1, -1],
      startPositionMax: settings.startPositionMax ?? [1, 1, 1],
      startRotationMin: settings.startRotationMin ?? [0, 0, 0],
      startRotationMax: settings.startRotationMax ?? [0, 0, 0],
      rotationSpeedMin: settings.rotationSpeedMin ?? [0, 0, 0],
      rotationSpeedMax: settings.rotationSpeedMax ?? [0, 0, 0],
      directionMin: settings.directionMin ?? [0, 0, 0],
      directionMax: settings.directionMax ?? [0, 0, 0],
    };
  }

  private randFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public stopEmitting(): void {
    this.shouldEmit = false;
  }

  public startEmitting(reset: boolean = false): void {
    if (reset) {
      this.emitted = 0;
      this.elapsedTime = 0;
    }
    this.shouldEmit = true;
  }

  public emitAtPos(position: THREE.Vector3 | null, reset: boolean = false): void {
    if (this.settings.spawnMode !== "burst") {
      console.error("This function is meant to be used with burst spawn mode only.");
      return;
    }

    const rate = this.settings.nbParticles - this.emitted;
    if (reset) {
      this.emitted = 0;
      this.elapsedTime = 0;
    }

    if (position) {
      this.position.copy(position);
    }

    this.updateWorldMatrix(true, true);
    const worldMatrix = this.matrixWorld;
    worldMatrix.decompose(worldPosition, worldQuaternion, worldScale);
    worldEuler.setFromQuaternion(worldQuaternion);
    worldRotation.setFromQuaternion(worldQuaternion);

    this.store.emit(this.emitterName, rate, () => {
      const randSize = this.randFloat(this.settings.size[0], this.settings.size[1]);
      const color = this.settings.colorStart[
        this.randInt(0, this.settings.colorStart.length - 1)
      ];

      const dir = new THREE.Vector3(
        this.randFloat(this.settings.directionMin[0], this.settings.directionMax[0]),
        this.randFloat(this.settings.directionMin[1], this.settings.directionMax[1]),
        this.randFloat(this.settings.directionMin[2], this.settings.directionMax[2])
      );
      if (this.localDirection) {
        dir.applyQuaternion(worldQuaternion);
      }

      return {
        position: [
          worldPosition.x + this.randFloat(this.settings.startPositionMin[0], this.settings.startPositionMax[0]),
          worldPosition.y + this.randFloat(this.settings.startPositionMin[1], this.settings.startPositionMax[1]),
          worldPosition.z + this.randFloat(this.settings.startPositionMin[2], this.settings.startPositionMax[2]),
        ] as [number, number, number],
        direction: [dir.x, dir.y, dir.z] as [number, number, number],
        scale: [randSize, randSize, randSize] as [number, number, number],
        rotation: [
          worldRotation.x + this.randFloat(this.settings.startRotationMin[0], this.settings.startRotationMax[0]),
          worldRotation.y + this.randFloat(this.settings.startRotationMin[1], this.settings.startRotationMax[1]),
          worldRotation.z + this.randFloat(this.settings.startRotationMin[2], this.settings.startRotationMax[2]),
        ] as [number, number, number],
        rotationSpeed: [
          this.randFloat(this.settings.rotationSpeedMin[0], this.settings.rotationSpeedMax[0]),
          this.randFloat(this.settings.rotationSpeedMin[1], this.settings.rotationSpeedMax[1]),
          this.randFloat(this.settings.rotationSpeedMin[2], this.settings.rotationSpeedMax[2]),
        ] as [number, number, number],
        lifetime: [
          this.currentTime,
          this.randFloat(this.settings.particlesLifetime[0], this.settings.particlesLifetime[1]),
        ] as [number, number],
        colorStart: color,
        colorEnd: this.settings.colorEnd?.length
          ? this.settings.colorEnd[this.randInt(0, this.settings.colorEnd.length - 1)]
          : color,
        speed: [this.randFloat(this.settings.speed[0], this.settings.speed[1])] as [number],
      };
    });
  }

  public update(time: number, delta: number): void {
    this.currentTime = time;

    if (this.emitted < this.settings.nbParticles || this.settings.loop) {
      if (!this.shouldEmit) {
        return;
      }

      const particlesToEmit =
        this.settings.spawnMode === "burst"
          ? this.settings.nbParticles
          : Math.max(
              0,
              Math.floor(
                ((this.elapsedTime - this.settings.delay) / this.settings.duration) * this.settings.nbParticles
              )
            );

      const rate = particlesToEmit - this.emitted;
      if (rate > 0 && this.elapsedTime >= this.settings.delay) {
        this.updateWorldMatrix(true, true);
        const worldMatrix = this.matrixWorld;
        worldMatrix.decompose(worldPosition, worldQuaternion, worldScale);
        worldEuler.setFromQuaternion(worldQuaternion);
        worldRotation.setFromQuaternion(worldQuaternion);

        this.store.emit(this.emitterName, rate, () => {
          const randSize = this.randFloat(this.settings.size[0], this.settings.size[1]);
          const color = this.settings.colorStart[
            this.randInt(0, this.settings.colorStart.length - 1)
          ];

          const dir = new THREE.Vector3(
            this.randFloat(this.settings.directionMin[0], this.settings.directionMax[0]),
            this.randFloat(this.settings.directionMin[1], this.settings.directionMax[1]),
            this.randFloat(this.settings.directionMin[2], this.settings.directionMax[2])
          );
          if (this.localDirection) {
            dir.applyQuaternion(worldQuaternion);
          }

          return {
            position: [
              worldPosition.x + this.randFloat(this.settings.startPositionMin[0], this.settings.startPositionMax[0]),
              worldPosition.y + this.randFloat(this.settings.startPositionMin[1], this.settings.startPositionMax[1]),
              worldPosition.z + this.randFloat(this.settings.startPositionMin[2], this.settings.startPositionMax[2]),
            ] as [number, number, number],
            direction: [dir.x, dir.y, dir.z] as [number, number, number],
            scale: [randSize, randSize, randSize] as [number, number, number],
            rotation: [
              worldRotation.x + this.randFloat(this.settings.startRotationMin[0], this.settings.startRotationMax[0]),
              worldRotation.y + this.randFloat(this.settings.startRotationMin[1], this.settings.startRotationMax[1]),
              worldRotation.z + this.randFloat(this.settings.startRotationMin[2], this.settings.startRotationMax[2]),
            ] as [number, number, number],
            rotationSpeed: [
              this.randFloat(this.settings.rotationSpeedMin[0], this.settings.rotationSpeedMax[0]),
              this.randFloat(this.settings.rotationSpeedMin[1], this.settings.rotationSpeedMax[1]),
              this.randFloat(this.settings.rotationSpeedMin[2], this.settings.rotationSpeedMax[2]),
            ] as [number, number, number],
            lifetime: [
              time,
              this.randFloat(this.settings.particlesLifetime[0], this.settings.particlesLifetime[1]),
            ] as [number, number],
            colorStart: color,
            colorEnd: this.settings.colorEnd?.length
              ? this.settings.colorEnd[this.randInt(0, this.settings.colorEnd.length - 1)]
              : color,
            speed: [this.randFloat(this.settings.speed[0], this.settings.speed[1])] as [number],
          };
        });
        this.emitted += rate;
      }
    }
    this.elapsedTime += delta;
  }

  public updateSettings(settings: VFXEmitterSettings): void {
    Object.assign(this.settings, settings);
  }

  public restart(): void {
    this.emitted = 0;
    this.elapsedTime = 0;
  }
}