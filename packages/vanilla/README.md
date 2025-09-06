# wawa-vfx-vanilla

A simple and easy-to-use vanilla Three.js library for creating visual effects.

## Installation

```bash
npm install wawa-vfx-vanilla
```

## Usage

```javascript
import * as THREE from 'three';
import { VFXEmitter, VFXParticles } from 'wawa-vfx-vanilla';

// Create a scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Create VFX particles
const particles = new VFXParticles('myParticles', {
  size: 0.1,
  color: '#ff0000',
  count: 1000
});

// Add to scene
scene.add(particles.mesh);

// Create an emitter
const emitter = new VFXEmitter('myEmitter', particles, {
  duration: 4,
  nbParticles: 100
});

// Start emitting
emitter.startEmitting();

// In your animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update particles
  particles.update(deltaTime);
  
  // Update emitter
  emitter.update(deltaTime);
  
  renderer.render(scene, camera);
}
```

## Features

- No React dependencies required
- Pure Three.js implementation
- Lightweight and performant
- Full TypeScript support

## License

MIT