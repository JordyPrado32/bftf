import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const mount = document.getElementById("processThree");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function canUseWebGL() {
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
}

if (mount && canUseWebGL()) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  const home = new THREE.Group();
  const clock = new THREE.Clock();
  let isSceneVisible = true;
  let animationFrame = 0;

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.appendChild(renderer.domElement);
  document.body.classList.add("has-process-three");

  const materials = {
    ground: new THREE.MeshStandardMaterial({ color: 0x33443a, roughness: 0.92 }),
    driveway: new THREE.MeshStandardMaterial({ color: 0xb7b2a3, roughness: 0.78 }),
    foundation: new THREE.MeshStandardMaterial({ color: 0x6f6a61, roughness: 0.72 }),
    wall: new THREE.MeshStandardMaterial({ color: 0xf4eadb, roughness: 0.66 }),
    wallSide: new THREE.MeshStandardMaterial({ color: 0xd9cdbc, roughness: 0.72 }),
    roof: new THREE.MeshStandardMaterial({ color: 0x2e3742, roughness: 0.58 }),
    roofTrim: new THREE.MeshStandardMaterial({ color: 0x17191c, roughness: 0.62 }),
    trim: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.52 }),
    glass: new THREE.MeshStandardMaterial({
      color: 0x8bbbd0,
      emissive: 0x173241,
      emissiveIntensity: 0.12,
      roughness: 0.18,
      metalness: 0.05
    }),
    door: new THREE.MeshStandardMaterial({ color: 0x7a4328, roughness: 0.55 }),
    deck: new THREE.MeshStandardMaterial({ color: 0xa87743, roughness: 0.68 }),
    brick: new THREE.MeshStandardMaterial({ color: 0x8c4d3a, roughness: 0.82 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.36, metalness: 0.08 })
  };

  function addBox(parent, size, position, material, castShadow = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addGable(parent, width, height, depth, position, material) {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(0, height);
    shape.lineTo(width / 2, 0);
    shape.lineTo(-width / 2, 0);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: false
    });
    geometry.translate(0, 0, -depth / 2);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addWindow(parent, x, y, z, width = 0.62, height = 0.62) {
    addBox(parent, [width + 0.18, height + 0.18, 0.08], [x, y, z], materials.trim);
    addBox(parent, [width, height, 0.09], [x, y, z + 0.015], materials.glass);
    addBox(parent, [0.045, height + 0.1, 0.1], [x, y, z + 0.035], materials.trim);
    addBox(parent, [width + 0.1, 0.045, 0.1], [x, y, z + 0.04], materials.trim);
  }

  function addSideWindow(parent, x, y, z, width = 0.08, height = 0.58, depth = 0.56) {
    addBox(parent, [width, height + 0.18, depth + 0.18], [x, y, z], materials.trim);
    addBox(parent, [width + 0.015, height, depth], [x, y, z], materials.glass);
  }

  function addSiding(parent, z) {
    for (let y = 0.55; y <= 2.08; y += 0.24) {
      addBox(parent, [4.32, 0.024, 0.035], [0, y, z], materials.wallSide, false);
    }
  }

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 8.8), materials.ground);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.03;
  ground.receiveShadow = true;
  scene.add(ground);

  const driveway = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 4.2), materials.driveway);
  driveway.rotation.x = -Math.PI / 2;
  driveway.rotation.z = -0.08;
  driveway.position.set(1.15, -0.018, 2.74);
  driveway.receiveShadow = true;
  scene.add(driveway);

  addBox(home, [4.65, 0.32, 3.15], [0, 0.16, 0], materials.foundation);
  addBox(home, [4.32, 1.72, 2.72], [0, 1.16, 0], materials.wall);
  addGable(home, 4.92, 1.12, 3.22, [0, 2.02, 0], materials.roof);
  addBox(home, [5.1, 0.16, 3.45], [0, 2.16, 0], materials.roofTrim);

  addBox(home, [1.35, 1.18, 1.42], [1.4, 1.74, 0.88], materials.wallSide);
  addGable(home, 1.7, 0.7, 1.68, [1.4, 2.32, 0.88], materials.roof);
  addBox(home, [1.86, 0.12, 1.86], [1.4, 2.44, 0.88], materials.roofTrim);

  addSiding(home, 1.395);

  addWindow(home, -1.38, 1.42, 1.4);
  addWindow(home, 1.44, 1.42, 1.4);
  addWindow(home, 1.4, 1.86, 1.61, 0.48, 0.52);
  addSideWindow(home, -2.19, 1.36, -0.72);

  addBox(home, [0.76, 1.18, 0.1], [0, 0.91, 1.43], materials.door);
  addBox(home, [0.88, 0.1, 0.16], [0, 1.54, 1.46], materials.trim);
  addBox(home, [0.11, 1.22, 0.16], [-0.45, 0.91, 1.46], materials.trim);
  addBox(home, [0.11, 1.22, 0.16], [0.45, 0.91, 1.46], materials.trim);

  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), materials.metal);
  knob.position.set(0.25, 0.9, 1.51);
  knob.castShadow = true;
  home.add(knob);

  addBox(home, [1.8, 0.14, 0.85], [0, 0.22, 1.85], materials.deck);
  addBox(home, [1.4, 0.12, 0.38], [0, 0.04, 2.18], materials.deck);
  [-0.78, 0.78].forEach((x) => {
    addBox(home, [0.08, 1.08, 0.08], [x, 0.84, 1.88], materials.trim);
  });
  addBox(home, [1.8, 0.08, 0.08], [0, 1.36, 1.88], materials.trim);

  addBox(home, [0.38, 1.05, 0.4], [1.42, 3.02, -0.64], materials.brick);
  addBox(home, [0.48, 0.14, 0.5], [1.42, 3.62, -0.64], materials.roofTrim);

  const garageDoor = addBox(home, [1.12, 0.82, 0.08], [1.55, 0.82, 1.44], materials.trim);
  garageDoor.receiveShadow = true;
  for (let y = 0.54; y <= 1.1; y += 0.18) {
    addBox(home, [1.02, 0.028, 0.095], [1.55, y, 1.5], materials.foundation, false);
  }

  home.position.set(0, 0, -0.14);
  scene.add(home);

  const hemisphere = new THREE.HemisphereLight(0xfff7dd, 0x20242b, 2.15);
  scene.add(hemisphere);

  const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
  keyLight.position.set(3.6, 6.4, 4.8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(512, 512);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 18;
  keyLight.shadow.camera.left = -6;
  keyLight.shadow.camera.right = 6;
  keyLight.shadow.camera.top = 6;
  keyLight.shadow.camera.bottom = -6;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xffd54f, 1.25);
  rimLight.position.set(-4.8, 3.2, -4.2);
  scene.add(rimLight);

  camera.position.set(5.9, 3.55, 7.25);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.12, 0.35);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.enablePan = false;
  controls.minDistance = 4.8;
  controls.maxDistance = 10.5;
  controls.minPolarAngle = 0.42;
  controls.maxPolarAngle = 1.42;
  controls.autoRotate = !prefersReducedMotion;
  controls.autoRotateSpeed = 0.18;

  renderer.domElement.addEventListener("pointerdown", () => {
    controls.autoRotate = false;
  });

  function resize() {
    const rect = mount.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const scale = Math.max(0.58, Math.min(0.9, Math.min(width, height) / 660));
    home.scale.setScalar(scale);
  }

  function render() {
    animationFrame = 0;
    if (!isSceneVisible) return;

    const elapsed = clock.getElapsedTime();
    keyLight.position.x = 3.6 + Math.sin(elapsed * 0.18) * 0.25;
    controls.update();
    renderer.render(scene, camera);
    animationFrame = window.requestAnimationFrame(render);
  }

  function requestRender() {
    if (!animationFrame && isSceneVisible) {
      animationFrame = window.requestAnimationFrame(render);
    }
  }

  resize();
  requestRender();

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("resize", requestRender, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        isSceneVisible = entries.some((entry) => entry.isIntersecting);
        if (isSceneVisible) {
          requestRender();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(mount);
  }
}
