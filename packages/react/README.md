# wawa-vfx

A simple and easy-to-use library for creating visual effects in React Three Fiber.

[Live demo](https://wawa-vfx.wawasensei.dev/) - [Fireworks demo](https://fireworks.wawasensei.dev/) - [Wizard Game demo](https://wizard.wawasensei.dev/)

> This powerful VFX particle system was developed as part of the comprehensive **VFX & Advanced Rendering Chapter** in my [React Three Fiber: The Ultimate Guide to 3D Web Development](https://lessons.wawasensei.dev/courses/react-three-fiber/) course.
>
> In the course, we break down every aspect of this system, explaining the mathematics, optimization techniques, and design patterns that make it work.

## Installation

```bash
npm install wawa-vfx
```

or

```bash
yarn add wawa-vfx
```

## Usage

Wawa VFX uses a two-component system:
- `VFXParticles`: Defines the particle system and its rendering properties
- `VFXEmitter`: Controls how and when particles are emitted into the scene

### Basic Example

```jsx
import { Canvas } from '@react-three/fiber';
import { VFXEmitter, VFXParticles, AppearanceMode } from 'wawa-vfx';

const MyEffect = () => {
  return (
    <>
      {/* Step 1: Define your particle system */}
      <VFXParticles
        name="particles" // A unique identifier for this particle system
        settings={{
          nbParticles: 100000, // Maximum number of particles to allocate
          gravity: [0, -9.8, 0], // Apply gravity (x, y, z)
          fadeSize: [0, 0], // Size fade in/out settings
          fadeAlpha: [0, 0], // Opacity fade in/out settings
          renderMode: "billboard", // "billboard" or "mesh" or "stretchBillboard"
          intensity: 3, // Brightness multiplier
          appearance: AppearanceMode.Circular, // Define the default appearance to be plane (default) or circular
          easeFunction: "easeLinear", // add easing to the particle animations
        }}
      />

      {/* Step 2: Define your emitter */}
      <VFXEmitter
        debug // Show debug visualization
        emitter="particles" // Target the particle system by name
        settings={{
          loop: true, // Continuously emit particles (only if `spawnMode` is 'time')
          duration: 1, // Emission cycle duration in seconds
          nbParticles: 100, // Number of particles to emit per cycle
          spawnMode: "time", // Emission mode: 'time' or 'burst'
          delay: 0, // Time delay before starting emission

          // Particle lifetime range [min, max]
          particlesLifetime: [0.1, 1],

          // Position range (min/max)
          startPositionMin: [-0.1, -0.1, -0.1],
          startPositionMax: [0.1, 0.1, 0.1],

          // Rotation range (min/max)
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          // Rotation speed range (min/max)
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 0],

          // Direction range (min/max)
          directionMin: [-1, 0, -1],
          directionMax: [1, 1, 1],

          // Particle size range [min, max]
          size: [0.01, 0.25],

          // Particle speed range [min, max]
          speed: [1, 12],

          // Color at start - an array of strings for random selection
          colorStart: ["white", "skyblue"],

          // Color at end - an array of strings for random selection
          colorEnd: ["white", "pink"],

          // When true, the emitter will emit particles using its local axes (transformed by its world rotation)
          useLocalDirection: true,
        }}
      />
    </>
  );
};

function App() {
  return (
    <Canvas>
      <MyEffect />
    </Canvas>
  );
}
```

### Custom Geometry Example

You can use custom geometries for your particles:

```jsx
import { useGLTF } from '@react-three/drei';

const CustomParticles = () => {
  const { nodes } = useGLTF('/models/sword.glb');
  
  return (
    <>
      <VFXParticles
        name="swords"
        geometry={<primitive object={nodes.Sword.geometry} />}
        settings={{
          nbParticles: 1000,
          renderMode: "mesh",
          intensity: 2,
        }}
      />
      
      <VFXEmitter
        emitter="swords"
        settings={{
          spawnMode: "burst",
          nbParticles: 100,
          // ... other settings
        }}
      />
    </>
  );
};
```

## API Reference

### VFXParticles Component

| Property   | Type          | Description                                      |
| ---------- | ------------- | ------------------------------------------------ |
| `name`     | string        | Unique identifier for this particle system       |
| `settings` | object        | Configuration options for particles              |
| `alphaMap` | THREE.Texture | Optional texture for particle alpha/transparency |
| `geometry` | ReactElement  | Optional custom geometry for particles           |

#### VFXParticles Settings

| Setting       | Type                    | Default           | Description                                                    |
| ------------- | ----------------------- | ----------------- | -------------------------------------------------------------- |
| nbParticles   | number                  | 1000              | Maximum number of particles                                   |
| intensity     | number                  | 1                 | Brightness multiplier                                         |
| renderMode    | 'billboard' \| 'mesh' \| 'stretchBillboard' | 'mesh' | How particles are rendered              |
| stretchScale  | number                  | 1.0               | Stretch factor for stretchBillboard mode                      |
| fadeSize      | [number, number]        | [0.1, 0.9]        | Size fade in/out range (0-1 of lifetime)                      |
| fadeAlpha     | [number, number]        | [0, 1.0]          | Opacity fade in/out range                                     |
| gravity       | [number, number, number]| [0, 0, 0]         | Gravity force applied to particles                            |
| frustumCulled | boolean                 | true              | Whether particles are frustum culled                          |
| appearance    | AppearanceMode          | AppearanceMode.Square | Particle appearance (Square or Circular)                 |
| easeFunction  | EaseFunction            | 'easeLinear'      | Easing function for particle animations                       |
| blendingMode  | THREE.Blending          | AdditiveBlending  | How particles blend with the scene                            |

### VFXEmitter Component

| Property        | Type    | Description                                 |
| --------------- | ------- | ------------------------------------------- |
| `emitter`       | string  | Name of the target particle system          |
| `settings`      | object  | Configuration options for emission behavior |
| `debug`         | boolean | Show Leva controls to adjust settings       |
| `autoStart`     | boolean | Automatically start emitting                |
| `localDirection`| boolean | Use emitter's local space for directions    |

#### VFXEmitter Settings

| Setting           | Type                       | Default    | Description                                      |
| ----------------- | -------------------------- | ---------- | ------------------------------------------------ |
| loop              | boolean                    | true       | Continuously emit particles                     |
| duration          | number                     | 1          | Emission cycle duration in seconds              |
| nbParticles       | number                     | 100        | Number of particles to emit per cycle           |
| spawnMode         | 'time' \| 'burst'          | 'time'     | How particles are spawned                       |
| delay             | number                     | 0          | Time delay before starting emission             |
| particlesLifetime | [number, number]           | [0.1, 1]   | Particle lifetime range [min, max]              |
| startPositionMin  | [number, number, number]   | [-0.1, -0.1, -0.1] | Minimum start position                  |
| startPositionMax  | [number, number, number]   | [0.1, 0.1, 0.1]    | Maximum start position                  |
| startRotationMin  | [number, number, number]   | [0, 0, 0]  | Minimum start rotation                          |
| startRotationMax  | [number, number, number]   | [0, 0, 0]  | Maximum start rotation                          |
| rotationSpeedMin  | [number, number, number]   | [0, 0, 0]  | Minimum rotation speed                          |
| rotationSpeedMax  | [number, number, number]   | [0, 0, 0]  | Maximum rotation speed                          |
| directionMin      | [number, number, number]   | [-1, 0, -1]| Minimum emission direction                      |
| directionMax      | [number, number, number]   | [1, 1, 1]  | Maximum emission direction                      |
| size              | [number, number]           | [0.01, 0.25] | Particle size range [min, max]                |
| speed             | [number, number]           | [1, 12]    | Particle speed range [min, max]                 |
| colorStart        | string[]                   | ['white']  | Colors at start (randomly selected)             |
| colorEnd          | string[]                   | ['white']  | Colors at end (randomly selected)               |
| useLocalDirection | boolean                    | false      | Use emitter's local space for directions        |

### Controlling Emitters with useVFX Hook

You can programmatically control emitters using the `useVFX` hook:

```jsx
import { useVFX } from 'wawa-vfx';

const ControlledEffect = () => {
  const { emit } = useVFX();
  
  const handleClick = () => {
    // Emit particles programmatically
    emit('myParticles', 10, () => ({
      position: [0, 0, 0],
      direction: [0, 1, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      rotationSpeed: [0, 0, 0],
      lifetime: [1, 2],
      colorStart: '#ff0000',
      colorEnd: '#0000ff',
      speed: [5],
    }));
  };
  
  return (
    <>
      <VFXParticles name="myParticles" settings={{ nbParticles: 1000 }} />
      <mesh onClick={handleClick}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    </>
  );
};
```

### Using with VFXEmitterRef

You can control emitters through refs:

```jsx
import { useRef } from 'react';
import { VFXEmitter, VFXEmitterRef } from 'wawa-vfx';

const RefControlledEffect = () => {
  const emitterRef = useRef<VFXEmitterRef>(null);
  
  const handleStart = () => {
    emitterRef.current?.startEmitting(true); // true to reset
  };
  
  const handleStop = () => {
    emitterRef.current?.stopEmitting();
  };
  
  const handleEmitAt = (position: THREE.Vector3) => {
    emitterRef.current?.emitAtPos(position, true);
  };
  
  return (
    <>
      <VFXParticles name="controlled" settings={{ nbParticles: 5000 }} />
      <VFXEmitter
        ref={emitterRef}
        emitter="controlled"
        autoStart={false}
        settings={{ /* ... */ }}
      />
    </>
  );
};
```

## Features

### ✨ New Features

#### Stretch Billboard Mode
A new renderMode that renders particles as billboards that stretch along their velocity direction, ideal for effects like trails, speed lines, or fire streaks.

```jsx
<VFXParticles
  name="trails"
  settings={{
    renderMode: "stretchBillboard",
    stretchScale: 2.0,
    // ...
  }}
/>
```

#### Particle Easings
Apply easing functions for smooth transitions over the particle's lifetime. Includes 42 easing functions with TypeScript autocomplete support.

```jsx
<VFXParticles
  name="smooth"
  settings={{
    easeFunction: "easeInOutCubic", // TypeScript will suggest all 42 options
    // ...
  }}
/>
```

#### Explicit Appearance Mode
Define whether particles appear as planes (default) or circular.

```jsx
import { AppearanceMode } from 'wawa-vfx';

<VFXParticles
  name="circles"
  settings={{
    appearance: AppearanceMode.Circular,
    // ...
  }}
/>
```

#### Local Direction Control
Control whether particles emit in the emitter's local space or world space.

```jsx
<VFXEmitter
  emitter="particles"
  settings={{
    useLocalDirection: true, // Particles follow emitter rotation
    // ...
  }}
/>
```

## Key Benefits

- 🚀 **Easy to Use**: Create complex particle effects with minimal code
- 🎨 **Flexible Customization**: Extensive settings for fine-tuning visual effects
- ⚡ **Performance Optimized**: Uses instanced rendering for efficient particle systems
- 🔧 **TypeScript Support**: Full type definitions for better development experience
- 🎮 **Debug Mode**: Built-in Leva controls for real-time tweaking
- 📦 **Custom Geometry**: Support for any Three.js geometry as particles
- 🎯 **Programmatic Control**: Full control through hooks and refs

## Examples

Check out the `examples` directory in the repository for more complex implementations:
- Fire effects
- Fireworks
- Magic spells
- Environmental effects
- Custom geometry particles

## For Vanilla Three.js

If you're using vanilla Three.js without React, check out our companion package: [wawa-vfx-vanilla](https://www.npmjs.com/package/wawa-vfx-vanilla)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.