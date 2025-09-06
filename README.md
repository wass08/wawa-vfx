# Wawa VFX

A simple and easy-to-use library for creating visual effects with vanilla Three.js and React Three Fiber.

[🚀 Live Demo](https://wawa-vfx.wawasensei.dev/) - [🎆 Fireworks Demo](https://fireworks.wawasensei.dev/) - [🧙 Wizard Game Demo](https://wizard.wawasensei.dev/)

> This powerful VFX particle system was developed as part of the comprehensive **VFX & Advanced Rendering Chapter** in my [React Three Fiber: The Ultimate Guide to 3D Web Development](https://lessons.wawasensei.dev/courses/react-three-fiber/) course.

https://github.com/user-attachments/assets/4c00c0e1-ae4f-4501-a648-0811c7a4ca7d

## 📦 Packages

This monorepo contains two packages designed to work with different environments:

### For Vanilla Three.js Projects
**[wawa-vfx-vanilla](./packages/vanilla/README.md)** - Pure Three.js implementation
```bash
npm install wawa-vfx-vanilla
```
- ✅ No React dependencies
- ✅ Clean installation
- ✅ Works with any Three.js project

### For React Three Fiber Projects  
**[wawa-vfx](./packages/react/README.md)** - React Three Fiber components
```bash
npm install wawa-vfx
```
- ✅ Declarative React components
- ✅ Built-in Leva debug controls
- ✅ TypeScript support

## 🎯 Quick Start

Choose your implementation:

<table>
<tr>
<td width="50%">

**Vanilla Three.js**
```javascript
import { VFXEmitter, VFXParticles } from 'wawa-vfx-vanilla';

const particles = new VFXParticles('fire', {
  nbParticles: 1000,
  gravity: [0, -2, 0],
  renderMode: 'billboard'
});
scene.add(particles.getMesh());

const emitter = new VFXEmitter('fire', {
  duration: 2,
  nbParticles: 50
});
scene.add(emitter);
```

</td>
<td width="50%">

**React Three Fiber**
```jsx
import { VFXEmitter, VFXParticles } from 'wawa-vfx';

<Canvas>
  <VFXParticles 
    name="fire"
    settings={{
      nbParticles: 1000,
      gravity: [0, -2, 0],
      renderMode: 'billboard'
    }}
  />
  <VFXEmitter 
    emitter="fire"
    settings={{
      duration: 2,
      nbParticles: 50
    }}
  />
</Canvas>
```

</td>
</tr>
</table>

## 📚 Documentation

- **[Vanilla Three.js Documentation](./packages/vanilla/README.md)** - Complete API reference, examples, and guides
- **[React Three Fiber Documentation](./packages/react/README.md)** - Component props, hooks, and React-specific features
- **[Migration Guide](./MIGRATION.md)** - Upgrading from single package structure

## 🎮 Examples

Explore the `examples/` directory for complete implementations:

- **[React Three Fiber Examples](./examples/react-three-fiber/)** - Interactive demos with source code
- **Fire Effects** - Realistic fire and smoke
- **Fireworks** - Explosive particle displays  
- **Magic Spells** - Fantasy VFX effects
- **Custom Geometry** - Using 3D models as particles

## ✨ Key Features

- 🚀 **Easy to Use**: Create complex particle effects with minimal code
- ⚡ **Performance Optimized**: Instanced rendering for thousands of particles
- 🎨 **Highly Customizable**: 40+ settings for fine-tuning effects
- 🎯 **Dual Architecture**: Same API for both vanilla Three.js and React
- 📐 **Advanced Rendering**: Billboard, mesh, and stretch-billboard modes
- 🌊 **Smooth Animations**: 42 built-in easing functions
- 🔧 **TypeScript**: Full type definitions included
- 📦 **Custom Geometry**: Use any 3D model as particles

## 🆕 Latest Features

- **Stretch Billboard Mode**: Particles that stretch along velocity
- **42 Easing Functions**: Smooth mathematical transitions  
- **Appearance Modes**: Square and circular particle shapes
- **Local Direction Control**: Emit particles in local or world space
- **Custom Geometry Support**: Use any Three.js geometry

## 🔧 Development

This project uses npm workspaces:

```bash
# Install all dependencies
npm install

# Build both packages
npm run build

# Build specific package
npm run build:vanilla
npm run build:react

# Development
npm run dev:vanilla
npm run dev:react
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

MIT © [Wawa Sensei](https://github.com/wass08)

---

**Get started today**: Choose [vanilla](./packages/vanilla/README.md) or [React](./packages/react/README.md) and create amazing particle effects! 🎆