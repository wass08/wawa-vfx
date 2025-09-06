# wawa-vfx

A simple and easy-to-use library for creating visual effects in React Three Fiber.

## Installation

```bash
npm install wawa-vfx
```

## Usage

```jsx
import { Canvas } from '@react-three/fiber';
import { VFXEmitter, VFXParticles } from 'wawa-vfx';

function App() {
  return (
    <Canvas>
      <VFXParticles
        name="myParticles"
        settings={{
          size: 0.1,
          color: '#ff0000',
          count: 1000
        }}
      />
      
      <VFXEmitter
        emitter="myEmitter"
        settings={{
          duration: 4,
          nbParticles: 100
        }}
      />
    </Canvas>
  );
}
```

## Features

- React Three Fiber integration
- Declarative API
- Full TypeScript support
- Leva controls for debugging
- Built on top of wawa-vfx-vanilla

## License

MIT