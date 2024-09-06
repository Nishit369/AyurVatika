import * as THREE from "three";
import { PointerLockControls } from "three-stdlib";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import gsap from "gsap";

const loadingManager = new THREE.LoadingManager();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const gltfLoader = new GLTFLoader();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-18, -3, 8).normalize();
scene.add(light);

scene.add(camera);

// const setupAudio = (camera) => {
//     const listener = new THREE.AudioListener();
//     camera.add(listener);
//     const sound = new THREE.Audio(listener);
//     const audioLoader = new THREE.AudioLoader();
//     let bufferLoaded = false;

//     audioLoader.load('/garden.ogg', function(buffer) {
//         sound.setBuffer(buffer);
//         sound.setLoop(true);
//         sound.setVolume(0.5);
//         bufferLoaded = true;
//     });

//     const startAudio = () => {
//         if (sound && bufferLoaded && !sound.isPlaying) {
//             sound.play();
//             console.log("Audio started");
//         } else if (!bufferLoaded) {
//             console.log("Audio buffer not yet loaded");
//         } else if (sound.isPlaying) {
//             console.log("Audio is already playing");
//         }
//     };

//     const stopAudio = () => {
//         if (sound && sound.isPlaying) {
//             sound.pause();
//             console.log("Audio stopped");
//         } else {
//             console.log("Audio is not playing");
//         }
//     };

//     return { startAudio, stopAudio };
// };

// const { startAudio, stopAudio } = setupAudio(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
renderer.shadows = true;
renderer.shadowType = 1;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelratio);
renderer.toneMapping = 0;
renderer.toneMappingExposure = 1;
renderer.useLegacyLights = false;
renderer.toneMapping = THREE.NoMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x101010, 255);
scene.add(ambientLight);

let sunLight = new THREE.DirectionalLight(0xdddddd, 1.0);
sunLight.position.set(10, 15, 10);
scene.add(sunLight);

// Key press handling
const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key in keysPressed) {
      keysPressed[event.key] = true;
    }
    if (event.key === "Enter" && controls.isLocked) {
      startAudio();
    }
  },
  false
);

document.addEventListener(
  "keyup",
  (event) => {
    if (event.key in keysPressed) {
      keysPressed[event.key] = false;
    }
  },
  false
);

const clock = new THREE.Clock();

// Textures and materials
const textureLoader = new THREE.TextureLoader(loadingManager);

// Load the textures
const floorTexture = textureLoader.load("/grass4.jpg");
const patchTexture = textureLoader.load("/patch2.jpeg");

// Configure texture properties
floorTexture.minFilter = THREE.LinearFilter;
floorTexture.magFilter = THREE.LinearFilter;
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(20, 20); // Adjust repeat for better appearance

// lamp

gltfLoader.load(
  "street_lamp.glb", // Replace with the path to your GLTF/GLB file
  (gltf) => {
    const model1 = gltf.scene;
    model1.position.set(-42.5, -3, -42.5);
    model1.scale.set(0.02, 0.02, 0.02);
    const model2 = model1.clone();
    model2.position.set(-42.5, -3, 42.5);
    model2.scale.set(0.02, 0.02, 0.02);
    const model3 = model1.clone();
    model3.position.set(42.5, -3, -42.5);
    model3.scale.set(0.02, 0.02, 0.02);
    const model4 = model1.clone();
    model4.position.set(42.5, -3, 42.5);
    model4.scale.set(0.02, 0.02, 0.02);
    scene.add(model1, model2, model3, model4);
  }
);

// fountain

// bench

gltfLoader.load(
  "bench.glb", // Replace with the path to your GLTF/GLB file
  (gltf) => {
    const model1 = gltf.scene;
    model1.position.set(-42.5, -3, -3.5);
    model1.scale.set(4, 4, 4);
    const model2 = model1.clone();
    model2.position.set(-42.5, -3, 15);
    model2.scale.set(4, 4, 4);
    const model3 = model1.clone();
    model3.rotation.y = Math.PI;
    model3.position.set(42.5, -3, -15);
    model3.scale.set(4, 4, 4);
    const model4 = model1.clone();
    model4.rotation.y = Math.PI;
    model4.position.set(42.5, -3, 3.5);
    model4.scale.set(4, 4, 4);
    scene.add(model1, model2, model3, model4);
  }
);

// side flowers
gltfLoader.load(
  "flower_stand_filled.glb", // Replace with the path to your GLTF/GLB file
  (gltf) => {
    const model5 = gltf.scene;
    model5.rotation.y = -Math.PI;
    model5.position.set(25,-3,42.5 );
    model5.scale.set(0.06,0.06,0.06);
    scene.add(model5)
  },
  (xhr) => {
    console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`); // Track loading progress
  },
  (error) => {
    console.error("Error loading model:", error); // Capture any errors
  }
);

// vase

gltfLoader.load(
  "flower_vase.glb", // Replace with the path to your GLTF/GLB file
  (gltf) => {
    const model5 = gltf.scene;
    model5.position.set(-45,-3,35 );
    model5.scale.set(5,5,5);
    scene.add(model5)
  },
  (xhr) => {
    console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`); // Track loading progress
  },
  (error) => {
    console.error("Error loading model:", error); // Capture any errors
  }
);


// fountain
const fbxLoader = new FBXLoader();
fbxLoader.load(
  "zsolnay-fountain/source/фонтан3.fbx", // Replace with the path to your GLTF/GLB file
  (model) => {
    model.position.set(0,4,0 );
    model.scale.set(0.04,0.04,0.04);
    scene.add(model)
  },
  (xhr) => {
    console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`); // Track loading progress
  },
  (error) => {
    console.error("Error loading model:", error); // Capture any errors
  }
);

// gltfLoader.load(
//   "gazebo.glb", // Replace with the path to your GLTF/GLB file
//   (gltf) => {
//     const model = gltf.scene;
//     model.position.set(0,6,0 );
//     model.scale.set(10,10,10);
//     scene.add(model)
//   },
//   (xhr) => {
//     console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`); // Track loading progress
//   },
//   (error) => {
//     console.error("Error loading model:", error); // Capture any errors
//   }
// );





// Floor geometry and material
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const patchGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({
  map: floorTexture,
  side: THREE.DoubleSide,
});
const patchMaterial = new THREE.MeshStandardMaterial({
  map: patchTexture,
  side: THREE.DoubleSide,
});
patchMaterial.depthTest = true;
patchMaterial.depthWrite = true;

// Create and position the floor
const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);
floorPlane.rotation.x = -Math.PI / 2;
floorPlane.position.y = -3;
floorPlane.receiveShadow = true; // Make sure shadows are enabled
const patchPlane1 = new THREE.Mesh(patchGeometry, patchMaterial);
const patchPlane2 = new THREE.Mesh(patchGeometry, patchMaterial);
const patchPlane3 = new THREE.Mesh(patchGeometry, patchMaterial);
const patchPlane4 = new THREE.Mesh(patchGeometry, patchMaterial);
const patchPlane5 = new THREE.Mesh(patchGeometry, patchMaterial);
patchPlane1.position.set(-20, -2.999, 20);
patchPlane1.rotation.set(Math.PI / 2, 0, 0);
patchPlane2.position.set(20, -2.999, -20);
patchPlane2.rotation.set(Math.PI / 2, 0, 0);
patchPlane3.position.set(-20, -2.999, -20);
patchPlane3.rotation.set(Math.PI / 2, 0, 0);
patchPlane4.position.set(20, -2.999, 20);
patchPlane4.rotation.set(Math.PI / 2, 0, 0);
patchPlane5.position.set(0, -2.999, -35);
patchPlane5.rotation.set(Math.PI / 2, 0, 0);

// Add the floor to the scene
scene.add(floorPlane);
scene.add(patchPlane1, patchPlane2, patchPlane3, patchPlane4, patchPlane5);

// Camera positioning
camera.position.set(0, 3, 45);

// Sky setup
const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

const skyUniforms = sky.material.uniforms;
skyUniforms["turbidity"].value = 5;
skyUniforms["rayleigh"].value = 2;
skyUniforms["mieCoefficient"].value = 0.005;
skyUniforms["mieDirectionalG"].value = 0.8;

const sun = new THREE.Vector3();
const phi = THREE.MathUtils.degToRad(90 - 30);
const theta = THREE.MathUtils.degToRad(60);
sun.setFromSphericalCoords(1, phi, theta);
skyUniforms["sunPosition"].value.copy(sun);

// Animation variables
let time = 0;

// Animation loop for sky
function animateSky() {
  requestAnimationFrame(animateSky);

  time += 0.01;
  skyUniforms["turbidity"].value = 10 + 5 * Math.sin(time);
  skyUniforms["rayleigh"].value = 2 + 1 * Math.sin(time);

  sun.setFromSphericalCoords(1, phi, theta);
  skyUniforms["sunPosition"].value.copy(sun);

  renderer.render(scene, camera);
}

animateSky();

// Popup element
const popup = document.getElementById("model-info");

// Model data array
const modelData = [
  // Your model data here
  {
    path: 'giloye.glb',
    position: { x: -20, y: -3, z: 20 },
    scale: {x:10, y:10, z:10},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
{
    path: 'giloye.glb',
    position: { x: -23, y: -3, z: 17 },
    scale: {x:10, y:10, z:10},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
{
    path: 'giloye.glb',
    position: { x: -23, y: -3, z: 23 },
    scale: {x:10, y:10, z:10},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
{
    path: 'giloye.glb',
    position: { x: -17, y: -3, z: 23 },
    scale: {x:10, y:10, z:10},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
{
    path: 'giloye.glb',
    position: { x: -17, y: -3, z: 17 },
    scale: {x:10, y:10, z:10},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
// 2nd set
{
    path: 'golumolu.glb',
    position: { x: 6.5, y: -3, z: 20 },
    scale: {x:20, y:20, z:20},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
  
{
    path: 'golumolu.glb',
    position: { x: 3, y: -3, z: 17 },
    scale: {x:20, y:20, z:20},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
{
    path: 'golumolu.glb',
    position: { x: 3, y: -3, z: 23 },
    scale: {x:20, y:20, z:20},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
{
    path: 'golumolu.glb',
    position: { x: 10, y: -3, z: 23 },
    scale: {x:20, y:20, z:20},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
{
    path: 'golumolu.glb',
    position: { x: 10, y: -3, z: 17 },
    scale: {x:20, y:20, z:20},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},

// 3rd set
{
    path: 'aloe-vera-final.glb',
    position: { x:20, y: -4, z: -20 },
    scale: {x:5, y:5, z:5},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
  
{
    path: 'aloe-vera-final.glb',
    position: { x: 17, y: -4, z: -23 },
    scale: {x:5, y:5, z:5},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
{
    path: 'aloe-vera-final.glb',
    position: { x: 17, y: -4, z:  -17},
    scale: {x:5, y:5, z:5},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
{
    path: 'aloe-vera-final.glb',
    position: { x: 23, y: -4, z: -23 },
    scale: {x:5, y:5, z:5},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
{
    path: 'aloe-vera-final.glb',
    position: { x: 23, y: -4, z: -17 },
    scale: {x:5, y:5, z:5},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},

// 4th set
{
    path: 'Tulsi.glb',
    position: { x: -20, y: -3, z:-20 },
    scale: {x:8, y:8, z:8},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
  
{
    path: 'Tulsi.glb',
    position: { x: -23, y: -3, z: -23 },
    scale: {x:8, y:8, z:8},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
{
    path: 'Tulsi.glb',
    position: { x: -23, y: -3, z: -17},
    scale: {x:8, y:8, z:8},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
{
    path: 'Tulsi.glb',
    position: { x: -17, y: -3, z: -17 },
    scale: {x:8, y:8, z:8},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},
{
    path: 'Ashwagandha.glb',
    position: { x: -17, y: -3, z: -23 },
    scale: {x:8, y:8, z:8},
    info: { title: 'Model 1', description: 'This is a description for Model 1' }
},


// 5th set
// {
//     path: 'Nilgiri-final.glb',
//     position: { x: 0, y: 0, z: 40 },
//     scale: {x:10, y:10, z:10},
//     info: { title: 'Model 1', description: 'This is a description for Model 1' }
// },
  
// {
//     path: 'Nilgiri-final.glb',
//     position: { x: 3, y: -3, z: -32 },
//     scale: {x:4, y:4, z:4},
//     info: { title: 'Model 1', description: 'This is a description for Model 1' }
// },
// {
//     path: 'Nilgiri-final.glb',
//     position: { x: 3, y: -3, z: -38 },
//     scale: {x:4, y:4, z:4},
//     info: { title: 'Model 1', description: 'This is a description for Model 1' }
// },
// {
//     path: 'Nilgiri-final.glb',
//     position: { x: -3, y: -3, z: -32 },
//     scale: {x:4, y:4, z:4},
//     info: { title: 'Model 1', description: 'This is a description for Model 1' }
// },
// {
//     path: 'Nilgiri-final.glb',
//     position: { x: -3, y: -3, z: -38 },
//     scale: {x:4, y:4, z:4},
//     info: { title: 'Model 1', description: 'This is a description for Model 1' }
// },




];

// Load models and add to scene
const loader = new GLTFLoader();
const models = [];
modelData.forEach((data) => {
  loader.load(data.path, (gltf) => {
    const model = gltf.scene;
    model.position.set(data.position.x, data.position.y, data.position.z);
    model.scale.set(data.scale.x, data.scale.y, data.scale.z);
    model.userData = { info: data.info };
    models.push(model);
    scene.add(model);
  });
});

function displayModelInfo(info) {
  console.log("Displaying model info:", info);
  popup.innerHTML = `
        <h2>${info.title}</h2>
        <p><strong>Description:</strong> ${info.description}</p>
    `;
  popup.classList.add("show");
}

function hideModelInfo() {
  popup.classList.remove("show");
}

// Controls
const controls = new PointerLockControls(camera, document.body);

let lockPointer = true;
let showMenuOnUnlock = false;

// Fence loading and collision detection
const fenceLoader = new GLTFLoader();
const fences = [];

// Load fence model and position around the plane
function loadFences() {
  const fencePositions = [
    { x: -50, z: 0 },
    { x: 0, z: -50 },
    { x: 0, z: 50 },
    { x: 50, z: 0 },
  ];

  fencePositions.forEach((pos, index) => {
    fenceLoader.load("wallfence.glb", (gltf) => {
      const fence = gltf.scene;
      fence.position.set(pos.x, -3, pos.z);
      fence.scale.set(30, 10, 10); // Adjust scale as needed

      // Rotate fence to face inward
      if (index === 0 || index === 3) {
        fence.rotation.y = Math.PI / 2;
      }

      fences.push(fence);
      scene.add(fence);
    });
  });
}

loadFences();

// Collision detection
const fountainRadius = 15; // Adjust this value based on your fountain size
const fountainPosition = new THREE.Vector3(0, 0, 0); // Adjust this to match your fountain's position

function checkCollision(newPosition) {
  // Check collision with fences
  for (let fence of fences) {
    const fenceBoundingBox = new THREE.Box3().setFromObject(fence);
    const playerBoundingBox = new THREE.Box3().setFromCenterAndSize(
      newPosition,
      new THREE.Vector3(1, 3, 1) // Adjust size based on your player's dimensions
    );

    if (fenceBoundingBox.intersectsBox(playerBoundingBox)) {
      return true; // Collision detected
    }
  }

  // Check collision with fountain
  const distanceToFountain = newPosition.distanceTo(fountainPosition);
  if (distanceToFountain < fountainRadius) {
    return true; // Collision detected
  }

  return false; // No collision
}

// Modify the updateMovement function
function updateMovement(delta) {
  const moveSpeed = 25 * delta;
  const newPosition = new THREE.Vector3();
  camera.getWorldPosition(newPosition);

  if (keysPressed.ArrowRight || keysPressed.d) {
    controls.moveRight(moveSpeed);
    camera.getWorldPosition(newPosition);
    if (checkCollision(newPosition)) {
      controls.moveRight(-moveSpeed); // Move back if collision detected
    }
  }
  if (keysPressed.ArrowLeft || keysPressed.a) {
    controls.moveRight(-moveSpeed);
    camera.getWorldPosition(newPosition);
    if (checkCollision(newPosition)) {
      controls.moveRight(moveSpeed); // Move back if collision detected
    }
  }
  if (keysPressed.ArrowUp || keysPressed.w) {
    controls.moveForward(moveSpeed);
    camera.getWorldPosition(newPosition);
    if (checkCollision(newPosition)) {
      controls.moveForward(-moveSpeed); // Move back if collision detected
    }
  }
  if (keysPressed.ArrowDown || keysPressed.s) {
    controls.moveForward(-moveSpeed);
    camera.getWorldPosition(newPosition);
    if (checkCollision(newPosition)) {
      controls.moveForward(moveSpeed); // Move back if collision detected
    }
  }
}

export const setupEventListeners = (controls, camera, scene) => {
  document.addEventListener(
    "keydown",
    (event) => onKeyDown(event, controls),
    false
  );
  document.addEventListener(
    "keyup",
    (event) => onKeyUp(event, controls),
    false
  );

  controls.addEventListener("unlock", () => {
    if (showMenuOnUnlock) {
      showMenu();
    }
    showMenuOnUnlock = false;
  });

  document.getElementById("start_audio").addEventListener("click", startAudio);
  document.getElementById("stop_audio").addEventListener("click", stopAudio);
};

function togglePointerLock(controls) {
  if (lockPointer) {
    controls.lock();
  } else {
    showMenuOnUnlock = false;
    controls.unlock();
  }
  lockPointer = !lockPointer;
}

function onKeyDown(event, controls) {
  if (event.key in keysPressed) {
    keysPressed[event.key] = true;
  }

  if (event.key === "Escape") {
    showMenu();
    showMenuOnUnlock = true;
    controls.unlock();
    lockPointer = false;
  }

  if (event.key === "p") {
    controls.unlock();
    lockPointer = false;
  }

  if (event.key === "Enter" || event.key === "Return") {
    hideMenu();
    controls.lock();
    lockPointer = true;
  }

  if (event.key === " ") {
    togglePointerLock(controls);
  }

  if (event.key === "g") {
    startAudio();
  }

  if (event.key === "p") {
    stopAudio();
  }

  if (event.key === "m") {
    showMenu();
    showMenuOnUnlock = true;
    controls.unlock();
    lockPointer = false;
  }

  if (event.key === "r") {
    location.reload();
  }
  if (event.key === "c") {
    toggleCrouch();
  }
}

const crouchHeight = 1;
const standHeight = 3;
const crouchScale = 0.5;
const standScale = 1;

let isCrouching = false;

function toggleCrouch() {
  if (isCrouching) {
    gsap.to(camera.position, {
      y: standHeight,
      duration: 1,
      ease: "power1.out",
    });
    gsap.to(camera.scale, {
      x: standScale,
      y: standScale,
      z: standScale,
      duration: 1,
      ease: "power1.out",
    });
  } else {
    gsap.to(camera.position, {
      y: crouchHeight,
      duration: 1,
      ease: "power1.out",
    });
    gsap.to(camera.scale, {
      x: crouchScale,
      y: crouchScale,
      z: crouchScale,
      duration: 1,
      ease: "power1.out",
    });
  }

  isCrouching = !isCrouching;
}

function onKeyUp(event, controls) {
  if (event.key in keysPressed) {
    keysPressed[event.key] = false;
  }
}

document.getElementById("toggle-info").addEventListener("click", () => {
  document.getElementById("info-panel").classList.toggle("collapsed");
  document.getElementById("toggle-info").innerText = document
    .getElementById("info-panel")
    .classList.contains("collapsed")
    ? "Show"
    : "Hide";
});

document.getElementById("about_button").addEventListener("click", function () {
  document.getElementById("about-overlay").classList.add("show");
});

document.getElementById("close-about").addEventListener("click", function () {
  document.getElementById("about-overlay").classList.remove("show");
});

function startExperience() {
  controls.lock();
  hideMenu();
  startAudio();
}

function endExperience() {
  controls.unlock();
  showMenu();
  stopAudio();
}

const playButton = document.getElementById("play_button");
playButton.addEventListener("click", startExperience);

function hideMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = "none";
}

function showMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = "block";
}

controls.addEventListener("unlock", endExperience);

const setupRendering = (scene, camera, renderer, models, controls) => {
  const clock = new THREE.Clock();
  const distanceThreshold = 5;
  const raycaster = new THREE.Raycaster();

  let render = function () {
    const delta = clock.getDelta();

    updateMovement(delta);

    if (controls.isLocked) {
      let modelToShow = null;
      let closestDistance = Infinity;

      models.forEach((model) => {
        const dx = camera.position.x - model.position.x;
        const dz = camera.position.z - model.position.z;
        const distanceToModel = Math.sqrt(dx * dx + dz * dz);

        if (
          distanceToModel < distanceThreshold &&
          distanceToModel < closestDistance
        ) {
          raycaster.set(
            camera.position,
            camera.getWorldDirection(new THREE.Vector3())
          );
          const intersections = raycaster.intersectObject(model, true);
          if (intersections.length > 0) {
            modelToShow = model;
            closestDistance = distanceToModel;
          }
        }
      });

      if (modelToShow && closestDistance <= distanceThreshold) {
        console.log("Model in range:", modelToShow.userData.info);
        displayModelInfo(modelToShow.userData.info);
      } else {
        hideModelInfo();
      }
    } else {
      hideModelInfo();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render();
};

setupRendering(scene, camera, renderer, models, controls);
setupEventListeners(controls);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
