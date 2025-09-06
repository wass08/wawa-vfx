# wawa-vfx-vanilla

A simple and easy-to-use vanilla Three.js library for creating visual effects.

[Live demo](https://wawa-vfx.wawasensei.dev/) - [Fireworks demo](https://fireworks.wawasensei.dev/) - [Wizard Game demo](https://wizard.wawasensei.dev/)

> This powerful VFX particle system was developed as part of the comprehensive **VFX & Advanced Rendering Chapter** in my [React Three Fiber: The Ultimate Guide to 3D Web Development](https://lessons.wawasensei.dev/courses/react-three-fiber/) course.
>
> In the course, we break down every aspect of this system, explaining the mathematics, optimization techniques, and design patterns that make it work.

## Installation

```bash
npm install wawa-vfx-vanilla
```

## Usage

Wawa VFX Vanilla uses a two-class system:
- `VFXParticles`: Defines the particle system and its rendering properties
- `VFXEmitter`: Controls how and when particles are emitted into the scene

### Basic Example

```javascript
import * as THREE from 'three';
import { VFXEmitter, VFXParticles, AppearanceMode } from 'wawa-vfx-vanilla';

// Create a basic Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create particle system
const particles = new VFXParticles('fireParticles', {
  nbParticles: 10000,
  gravity: [0, -2, 0],
  renderMode: 'billboard',
  intensity: 2,
  appearance: AppearanceMode.Circular,
  easeFunction: 'easeOutCubic',
  fadeAlpha: [0.1, 0.9],
  fadeSize: [0.2, 0.8],
  blendingMode: THREE.AdditiveBlending,
});

// Add to scene
scene.add(particles.getMesh());

// Create emitter
const emitter = new VFXEmitter('fireParticles', {
  loop: true,
  duration: 2,
  nbParticles: 50,
  spawnMode: 'time',
  delay: 0,
  
  // Particle lifetime
  particlesLifetime: [0.5, 2.0],
  
  // Position range
  startPositionMin: [-0.2, 0, -0.2],
  startPositionMax: [0.2, 0.5, 0.2],
  
  // Rotation
  startRotationMin: [0, 0, 0],
  startRotationMax: [Math.PI * 2, 0, 0],
  rotationSpeedMin: [-1, 0, -1],
  rotationSpeedMax: [1, 0, 1],
  
  // Direction and movement
  directionMin: [-0.5, 1, -0.5],
  directionMax: [0.5, 2, 0.5],
  size: [0.02, 0.1],
  speed: [2, 5],
  
  // Colors
  colorStart: ['#ff6b35', '#f7931e'],
  colorEnd: ['#ff0000', '#8b0000'],
  
  // Use local direction
  useLocalDirection: false,
});

// Add emitter to scene
scene.add(emitter);

// Position camera
camera.position.z = 3;

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const deltaTime = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();
  
  // Update VFX system
  emitter.update(elapsedTime, deltaTime);
  particles.update(elapsedTime);
  
  renderer.render(scene, camera);
}

animate();
```

### Custom Geometry Example

You can use any Three.js geometry for your particles:

```javascript
import * as THREE from 'three';
import { VFXEmitter, VFXParticles } from 'wawa-vfx-vanilla';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Load a custom model
const loader = new GLTFLoader();
loader.load('/models/sword.glb', (gltf) => {
  const swordGeometry = gltf.scene.children[0].geometry;
  
  // Create particles with custom geometry
  const swordParticles = new VFXParticles('swords', {
    nbParticles: 1000,
    renderMode: 'mesh',
    intensity: 2,
    gravity: [0, -5, 0],
  }, undefined, undefined, swordGeometry); // Pass geometry as 5th parameter
  
  scene.add(swordParticles.getMesh());
  
  // Create emitter for sword particles
  const swordEmitter = new VFXEmitter('swords', {
    spawnMode: 'burst',
    nbParticles: 100,
    particlesLifetime: [2, 4],
    startPositionMin: [-5, 5, -5],
    startPositionMax: [5, 10, 5],
    directionMin: [-1, -1, -1],
    directionMax: [1, -0.5, 1],
    size: [0.5, 1.5],
    speed: [3, 8],
    colorStart: ['#silver', '#gold'],
    colorEnd: ['#darkgray'],
  });
  
  scene.add(swordEmitter);
});
```

## API Reference

### VFXParticles Constructor

```javascript
new VFXParticles(name, settings, store?, alphaMap?, geometry?)
```

| Parameter  | Type              | Description                                      |
| ---------- | ----------------- | ------------------------------------------------ |
| `name`     | string            | Unique identifier for this particle system      |
| `settings` | object            | Configuration options for particles              |
| `store`    | VFXStore          | Optional store instance (uses global if not provided) |
| `alphaMap` | THREE.Texture     | Optional texture for particle alpha/transparency |
| `geometry` | THREE.BufferGeometry | Optional custom geometry for particles       |

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

### VFXEmitter Constructor

```javascript
new VFXEmitter(targetParticles, settings, store?)
```

| Parameter        | Type      | Description                                 |
| ---------------- | --------- | ------------------------------------------- |
| `targetParticles`| string    | Name of the target particle system          |
| `settings`       | object    | Configuration options for emission behavior |
| `store`          | VFXStore  | Optional store instance (uses global if not provided) |

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

### VFXParticles Methods

| Method                    | Description                               |
| ------------------------- | ----------------------------------------- |
| `getMesh()`               | Get the Three.js mesh for adding to scene|
| `update(elapsedTime)`     | Update particles (call in animation loop)|
| `updateSettings(settings)`| Update particle settings at runtime      |
| `dispose()`               | Clean up resources                        |

### VFXEmitter Methods

| Method                    | Description                               |
| ------------------------- | ----------------------------------------- |
| `update(elapsedTime, deltaTime)` | Update emitter (call in animation loop) |
| `startEmitting(reset?)`   | Start particle emission                   |
| `stopEmitting()`          | Stop particle emission                    |
| `emitAtPos(position, reset?)` | Emit particles at specific position   |

### Using the VFX Store

You can programmatically control emitters using the VFX store:

```javascript
import { useVFX } from 'wawa-vfx-vanilla';

const store = useVFX.getState();

// Emit particles manually
store.emit('myParticles', 10, () => ({
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

// Register/unregister emitters
store.registerEmitter('myEmitter', emitFunction);
store.unregisterEmitter('myEmitter');
```

## Features

### ✨ Advanced Features

#### Stretch Billboard Mode
Render particles as billboards that stretch along their velocity direction, perfect for trails and speed lines:

```javascript
const particles = new VFXParticles('trails', {
  renderMode: 'stretchBillboard',
  stretchScale: 2.0,
  // ...
});
```

#### Particle Easings
Choose from 42 easing functions for smooth particle animations:

```javascript
const particles = new VFXParticles('smooth', {
  easeFunction: 'easeInOutCubic', // Available: easeLinear, easeInQuad, easeOutBounce, etc.
  // ...
});
```

#### Appearance Modes
Control particle shape:

```javascript
import { AppearanceMode } from 'wawa-vfx-vanilla';

const particles = new VFXParticles('circles', {
  appearance: AppearanceMode.Circular, // or AppearanceMode.Square
  // ...
});
```

#### Local Direction Control
Control emission in local vs world space:

```javascript
const emitter = new VFXEmitter('particles', {
  useLocalDirection: true, // Particles follow emitter rotation
  // ...
});
```

## Available Easing Functions

The library includes 42 easing functions:
- Linear: `easeLinear`
- Quad: `easeInQuad`, `easeOutQuad`, `easeInOutQuad`
- Cubic: `easeInCubic`, `easeOutCubic`, `easeInOutCubic`
- Quart: `easeInQuart`, `easeOutQuart`, `easeInOutQuart`
- Quint: `easeInQuint`, `easeOutQuint`, `easeInOutQuint`
- Sine: `easeInSine`, `easeOutSine`, `easeInOutSine`
- Expo: `easeInExpo`, `easeOutExpo`, `easeInOutExpo`
- Circ: `easeInCirc`, `easeOutCirc`, `easeInOutCirc`
- Back: `easeInBack`, `easeOutBack`, `easeInOutBack`
- Elastic: `easeInElastic`, `easeOutElastic`, `easeInOutElastic`
- Bounce: `easeInBounce`, `easeOutBounce`, `easeInOutBounce`

## Key Benefits

- 🚀 **Pure Three.js**: No React dependencies, works with any Three.js project
- 🎨 **Flexible Customization**: Extensive settings for fine-tuning visual effects
- ⚡ **Performance Optimized**: Uses instanced rendering for efficient particle systems
- 🔧 **TypeScript Support**: Full type definitions for better development experience
- 📦 **Custom Geometry**: Support for any Three.js geometry as particles
- 🎯 **Programmatic Control**: Full control through the VFX store
- 🌊 **Advanced Rendering**: Multiple render modes including stretch billboards
- 📐 **Mathematical Precision**: 42 easing functions for smooth animations

## Examples

Check out the [Live demo](https://wawa-vfx.wawasensei.dev/) to see various effects in action:
- Fire effects
- Fireworks
- Magic spells
- Environmental effects
- Custom geometry particles

## For React Three Fiber

If you're using React Three Fiber, check out our React package: [wawa-vfx](https://www.npmjs.com/package/wawa-vfx)

## Performance Tips

1. **Reuse particle systems**: Create one `VFXParticles` instance and multiple emitters
2. **Optimize particle counts**: Start with lower `nbParticles` and increase as needed
3. **Use appropriate render modes**: `billboard` is faster than `mesh` for simple particles
4. **Manage geometry**: Custom geometries should be optimized (low poly count)
5. **Update efficiently**: Only call `update()` methods in your animation loop

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.