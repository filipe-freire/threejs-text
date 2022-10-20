import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const canvas = document.querySelector("canvas");

const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();
const textMatcapTexture = textureLoader.load("/textures/matcaps/metal.png");
const sphereMatcapTexture = textureLoader.load("/textures/matcaps/gold.png");

// Font
const fontLoader = new FontLoader();

const input = document.getElementById("name");
let name = input.value;

function createTextureMesh(font) {
  const textGeometry = new TextGeometry(name, {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  textGeometry.center();
  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: textMatcapTexture,
  });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.name = "text";

  scene.remove(scene.getObjectByName("text")).add(text);
}

input.addEventListener("input", () => {
  name = input.value;
  fontLoader.load("/fonts/gentilis_regular.typeface.json", createTextureMesh);
});

fontLoader.load("/fonts/gentilis_regular.typeface.json", createTextureMesh);

// Spheres
const sphereGeometry = new THREE.SphereGeometry(0.3, 50, 16);
const sphereMaterial = new THREE.MeshMatcapMaterial({
  matcap: sphereMatcapTexture,
});

for (let i = 0; i < 100; i++) {
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  sphere.position.x = (Math.random() - 0.5) * 10;
  sphere.position.y = (Math.random() - 0.5) * 10;
  sphere.position.z = (Math.random() - 0.5) * 10;

  const scale = Math.random();

  sphere.scale.set(scale, scale, scale);
  scene.add(sphere);
}

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();
const cameraDistanceLimit = 1;
const cameraMovementSpeed = 0.2;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  camera.position.x =
    Math.sin(elapsedTime * cameraMovementSpeed) * cameraDistanceLimit;
  camera.position.y =
    Math.cos(elapsedTime * cameraMovementSpeed) * cameraDistanceLimit;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
