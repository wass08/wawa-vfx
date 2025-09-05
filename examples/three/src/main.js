import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";
import * as THREE from "three";
import "./style.css";
import { setupVFXExample } from "./vfx-example";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("app").appendChild(renderer.domElement);

// Add a simple cube as reference
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const cube = new THREE.Mesh(geometry, material);
cube.position.y = -2;
scene.add(cube);

// Setup VFX
const vfx = setupVFXExample(scene);

// Add some lighting for better visibility
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Setup post-processing with bloom
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomEffect = new BloomEffect({
  intensity: 1.5,
  luminanceThreshold: 0.4,
  luminanceSmoothing: 0.2,
  mipmapBlur: true,
});
composer.addPass(new EffectPass(camera, bloomEffect));

camera.position.z = 10;
camera.position.y = 2;
camera.lookAt(0, 0, 0);

// Clock for delta time
const clock = new THREE.Clock();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", handleWindowResize);

// Animation loop
renderer.setAnimationLoop(animate);

function animate() {
  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  // Update VFX
  vfx.update(elapsedTime, delta);

  // Rotate the cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Render with post-processing
  composer.render();
}
