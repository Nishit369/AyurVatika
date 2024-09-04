import * as THREE from 'three'
import { PointerLockControls } from 'three-stdlib';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import gsap from 'gsap';

const loadingManager = new THREE.LoadingManager()

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const gltfLoader = new GLTFLoader();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-18, -3, 8).normalize();
scene.add(light);

scene.add(camera)
camera.position.z = 5;

const setupAudio = (camera) => {
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    let bufferLoaded = false;

    audioLoader.load('/garden.ogg', function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        bufferLoaded = true;
    });

    const startAudio = () => {
        if (sound && bufferLoaded && !sound.isPlaying) {
            sound.play();
            console.log("Audio started");
        } else if (!bufferLoaded) {
            console.log("Audio buffer not yet loaded");
        } else if (sound.isPlaying) {
            console.log("Audio is already playing");
        }
    };

    const stopAudio = () => {
        if (sound && sound.isPlaying) {
            sound.pause();
            console.log("Audio stopped");
        } else {
            console.log("Audio is not playing");
        }
    };

    return { startAudio, stopAudio };
};

const { startAudio, stopAudio } = setupAudio(camera);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xffffff, 1);
renderer.shadows = true;
renderer.shadowType= 1;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelratio)
renderer.toneMapping = 0;
renderer.toneMappingExposure = 1;
renderer.useLegacyLights = false;
renderer.toneMapping  = THREE.NoMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace
document.body.appendChild(renderer.domElement)

// Lighting
const ambientLight = new THREE.AmbientLight(0x101010, 255);
scene.add(ambientLight);

let sunLight = new THREE.DirectionalLight(0xdddddd, 1.0)
sunLight.position.set(10, 15, 10)
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
}

document.addEventListener('keydown', 
(event) => {
    if(event.key in keysPressed){
        keysPressed[event.key] = true;
    }
    if (event.key === 'Enter' && controls.isLocked) {
        startAudio();
    }
}, false)

document.addEventListener('keyup', 
(event) => {
    if(event.key in keysPressed){
        keysPressed[event.key] = false;
    }
}, false)

const clock = new THREE.Clock();

function updateMovement(delta) {
    const moveSpeed = 5 * delta
    if (keysPressed.ArrowRight || keysPressed.d){
        controls.moveRight(moveSpeed)
    }
    if (keysPressed.ArrowLeft || keysPressed.a){
        controls.moveRight(-moveSpeed)
    }
    if (keysPressed.ArrowUp || keysPressed.w){
        controls.moveForward(moveSpeed)
    }
    if (keysPressed.ArrowDown || keysPressed.s){
        controls.moveForward(-moveSpeed)
    }
}

// Textures and materials
const textureLoader = new THREE.TextureLoader(loadingManager);

// Load the textures
const floorTexture = textureLoader.load('/grass4.jpg');
const patchTexture = textureLoader.load('/patch2.jpeg');



// Configure texture properties
floorTexture.minFilter = THREE.LinearFilter;
floorTexture.magFilter = THREE.LinearFilter;
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(20,20); // Adjust repeat for better appearance

// Floor geometry and material
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const patchGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    side: THREE.DoubleSide
});
const patchMaterial = new THREE.MeshStandardMaterial({
    map: patchTexture,
    side: THREE.DoubleSide
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
patchPlane1.position.set(-20,-2.999,35)
patchPlane1.rotation.set(Math.PI/2,0,0)
patchPlane2.position.set(20,-2.999,35)
patchPlane2.rotation.set(Math.PI/2,0,0)
patchPlane3.position.set(-20,-2.999,10)
patchPlane3.rotation.set(Math.PI/2,0,0)
patchPlane4.position.set(20,-2.999,10)
patchPlane4.rotation.set(Math.PI/2,0,0)
patchPlane5.position.set(0,-2.999,0)
patchPlane5.rotation.set(Math.PI/2,0,0)

// Add the floor to the scene
scene.add(floorPlane);
scene.add(patchPlane1,patchPlane2,patchPlane3,patchPlane4,patchPlane5);

// Camera positioning
camera.position.set(0, 3, 45);

// Sky setup
const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

const skyUniforms = sky.material.uniforms;
skyUniforms['turbidity'].value = 5;
skyUniforms['rayleigh'].value = 2;
skyUniforms['mieCoefficient'].value = 0.005;
skyUniforms['mieDirectionalG'].value = 0.8;

const sun = new THREE.Vector3();
const phi = THREE.MathUtils.degToRad(90 - 30);
const theta = THREE.MathUtils.degToRad(60);
sun.setFromSphericalCoords(1, phi, theta);
skyUniforms['sunPosition'].value.copy(sun);

// Animation variables
let time = 0;

// Animation loop for sky
function animateSky() {
  requestAnimationFrame(animateSky);

  time += 0.01;
  skyUniforms['turbidity'].value = 10 + 5 * Math.sin(time);
  skyUniforms['rayleigh'].value = 2 + 1 * Math.sin(time);

  sun.setFromSphericalCoords(1, phi, theta);
  skyUniforms['sunPosition'].value.copy(sun);

  renderer.render(scene, camera);
}

animateSky();

// Popup element
const popup = document.getElementById('model-info');

// Model data array
const modelData = [
    // 1st set
    {
        path: 'giloye.glb',
        position: { x: -20, y: -3, z: 35 },
        scale: {x:10, y:10, z:10},
        info: { title: 'Model 1', description: 'This is a description for Model 1' }
    },
    {
        path: 'giloye.glb',
        position: { x: -23, y: -3, z: 38 },
        scale: {x:10, y:10, z:10},
        info: { title: 'Model 1', description: 'This is a description for Model 1' }
    },
    {
        path: 'giloye.glb',
        position: { x: -17, y: -3, z: 38 },
        scale: {x:10, y:10, z:10},
        info: { title: 'Model 1', description: 'This is a description for Model 1' }
    },
    {
        path: 'giloye.glb',
        position: { x: -17, y: -3, z: 32 },
        scale: {x:10, y:10, z:10},
        info: { title: 'Model 1', description: 'This is a description for Model 1' }
    },
    {
        path: 'giloye.glb',
        position: { x: -23, y: -3, z: 32 },
        scale: {x:10, y:10, z:10},
        info: { title: 'Model 1', description: 'This is a description for Model 1' }
    },
    // 2nd set
    {
        path: 'giloye.glb',
        position: { x: 20, y: -3, z: 35 },
        scale: {x:10, y:10, z:10},
        info: { title: 'Model 1', description: 'This is a description for Model 1' }
    },
    {
        path: 'giloye.glb',
        position: { x: 23, y: -3, z: 32 },
        scale: {x:10, y:10, z:10},
        info: { title: 'Model 1', description: 'This is a description for Model 1' }
    },
    {
        path: 'giloye.glb',
        position: { x: 17, y: -3, z: 32 },
        scale: {x:10, y:10, z:10},
        info: { title: 'Model 1', description: 'This is a description for Model 1' }
    },
    {
        path: 'giloye.glb',
        position: { x: 23, y: -3, z: 38 },
        scale: {x:10, y:10, z:10},
        info: { title: 'Model 1', description: 'This is a description for Model 1' }
    },
    {
        path: 'giloye.glb',
        position: { x: 17, y: -3, z: 38 },
        scale: {x:10, y:10, z:10},
        info: { title: 'Model 1', description: 'This is a description for Model 1' }
    },

    // Add more models here as needed
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
    popup.classList.add("show")
}

function hideModelInfo() {
    popup.classList.remove("show")
}

// Controls
const controls = new PointerLockControls(camera, document.body)

let lockPointer = true;
let showMenuOnUnlock = false;

// add the controls parameter which is the pointer lock controls and is passed from main.js where setupEventListeners is called
export const setupEventListeners = (controls, camera, scene) => {
  // add the event listeners to the document which is the whole page
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

  // Add event listeners for the audio guide buttons
  document.getElementById("start_audio").addEventListener("click", startAudio);
  document.getElementById("stop_audio").addEventListener("click", stopAudio);
};

// toggle the pointer lock
function togglePointerLock(controls) {
  if (lockPointer) {
    controls.lock();
  } else {
    showMenuOnUnlock = false;
    controls.unlock();
  }
  lockPointer = !lockPointer; // toggle the lockPointer variable
}

function onKeyDown(event, controls) {
  // event is the event object that has the key property
  if (event.key in keysPressed) {
    // check if the key pressed by the user is in the keysPressed object
    keysPressed[event.key] = true; // if yes, set the value of the key pressed to true
  }

  if (event.key === "Escape") {
    // if the "ESC" key is pressed
    showMenu(); // show the menu
    showMenuOnUnlock = true;
    controls.unlock(); // unlock the pointer
    lockPointer = false;
  }

  if (event.key === "p") {
    // if the "SPACE" key is pressed
    controls.unlock(); // unlock the pointer
    lockPointer = false;
  }

  // if key prssed is enter or return for mac
  if (event.key === "Enter" || event.key === "Return") {
    // if the "ENTER" key is pressed
    hideMenu(); // hide the menu
    controls.lock(); // lock the pointer
    lockPointer = true;
  }

  if (event.key === " ") {
    // if the "p" key is pressed
    togglePointerLock(controls); // toggle the pointer lock
  }

  if (event.key === "g") {
    // if the "a" key is pressed
    startAudio(); // start the audio guide
  }

  if (event.key === "p") {
    // if the "s" key is pressed
    stopAudio(); // stop the audio guide
  }

  if (event.key === "m") {
    // if the "h" key is pressed
    showMenu(); // show the menu
    showMenuOnUnlock = true;
    controls.unlock(); // unlock the pointer
    lockPointer = false;
  }

  if (event.key === "r") {
    // if the "r" key is pressed
    location.reload(); // reload the page
  }
  if (event.key === 'c') {
    toggleCrouch();
}
}

const crouchHeight = 1;
const standHeight = 3;
const crouchScale = 0.5;
const standScale = 1;

// Variable to track crouch state
let isCrouching = false;

function toggleCrouch() {
    if (isCrouching) {
        // Transition to standing
        gsap.to(camera.position, {
            y: standHeight,
            duration: 1, // Duration in seconds
            ease: 'power1.out'
        });
        gsap.to(camera.scale, {
            x: standScale,
            y: standScale,
            z: standScale,
            duration: 1, // Duration in seconds
            ease: 'power1.out'
        });
    } else {
        // Transition to crouching
        gsap.to(camera.position, {
            y: crouchHeight,
            duration: 1, // Duration in seconds
            ease: 'power1.out'
        });
        gsap.to(camera.scale, {
            x: crouchScale,
            y: crouchScale,
            z: crouchScale,
            duration: 1, // Duration in seconds
            ease: 'power1.out'
        });
    }

    // Update crouch state
    isCrouching = !isCrouching;
}

function onKeyUp(event, controls) {
  // same but for keyup
  if (event.key in keysPressed) {
    keysPressed[event.key] = false; // set to false when the key is released
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

const playButton = document.getElementById('play_button');
playButton.addEventListener("click", startExperience);

function hideMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = "none";
}

function showMenu() {
    const menu = document.getElementById("menu");
    menu.style.display ="block";
}

controls.addEventListener("unlock", endExperience);

// Setup rendering function
const setupRendering = (scene, camera, renderer, models, controls) => {
  const clock = new THREE.Clock();
  const distanceThreshold = 5; // Adjust this value as needed

  let render = function () {
      const delta = clock.getDelta();

      updateMovement(delta);

      // Check for nearby models only if controls are locked
      if (controls.isLocked) {
          let modelToShow = null;
          let closestDistance = Infinity;

          models.forEach((model) => {
              // Calculate distance ignoring y-axis difference
              const dx = camera.position.x - model.position.x;
              const dz = camera.position.z - model.position.z;
              const distanceToModel = Math.sqrt(dx * dx + dz * dz);
              
              if (distanceToModel < distanceThreshold && distanceToModel < closestDistance) {
                  modelToShow = model;
                  closestDistance = distanceToModel;
              }
          });

          if (modelToShow) {
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

// Start rendering
setupRendering(scene, camera, renderer, models, controls);
setupEventListeners(controls);

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});