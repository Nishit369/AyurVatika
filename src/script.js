import * as THREE from "three";
import { PointerLockControls } from "three-stdlib";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import gsap from "gsap";
import { giloy_info, gotukola_info, tulsiInfo, aloeVeraInfo } from "./plants_info";

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
  j: false
};

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key in keysPressed) {
      keysPressed[event.key] = true;
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
floorTexture.repeat.set(20, 20);

// Load other models (lamp, bench, fountain, etc.) as before
// ...
// let model1,model2,model3,model4;
// gltfLoader.load(
//   "street_lamp.glb", // Replace with the path to your GLTF/GLB file
//   (gltf) => {
//     model1 = gltf.scene;
//     model1.position.set(-42.5, -3, -42.5);
//     model1.scale.set(0.02, 0.02, 0.02);
//      model2 = model1.clone();
//     model2.position.set(-42.5, -3, 42.5);
//     model2.scale.set(0.02, 0.02, 0.02);
//      model3 = model1.clone();
//     model3.position.set(42.5, -3, -42.5);
//     model3.scale.set(0.02, 0.02, 0.02);
//      model4 = model1.clone();
//     model4.position.set(42.5, -3, 42.5);
//     model4.scale.set(0.02, 0.02, 0.02);
//     // scene.add(model1, model2, model3, model4);
//   }
// );

// fountain

// // bench
// let modela,modelb,modelc,modeld;
// gltfLoader.load(
//   "bench.glb", // Replace with the path to your GLTF/GLB file
//   (gltf) => {
//      modela = gltf.scene;
//     modela.position.set(-42.5, -3, -3.5);
//     modela.scale.set(4, 4, 4);
//     modelb = modela.clone();
//     modelb.position.set(-42.5, -3, 15);
//     modelb.scale.set(4, 4, 4);
//     modelc = modela.clone();
//     modelc.rotation.y = Math.PI;
//     modelc.position.set(42.5, -3, -15);
//     modelc.scale.set(4, 4, 4);
//     modeld = modela.clone();
//     modeld.rotation.y = Math.PI;
//     modeld.position.set(42.5, -3, 3.5);
//     modeld.scale.set(4, 4, 4);
//     // scene.add(modela, modelb, modelc, modeld);
//   }
// );

// side flowers\
// let m1,m2,m3;
// gltfLoader.load(
//   "flower_stand_filled.glb", // Replace with the path to your GLTF/GLB file
//   (gltf) => {
//     m1 = gltf.scene;
//     m1.rotation.y = -Math.PI;
//     m1.position.set(25, -3, 42.5);
//     m1.scale.set(0.06, 0.06, 0.06);
//     m2 = m1.clone()
//     m2.position.set(0, -3, 42.5);
//     m2.scale.set(0.06, 0.06, 0.06);
//     m3 = m1.clone()
//     m3.position.set(-20, -3, 42.5);
//     m3.scale.set(0.06, 0.06, 0.06);
//     // scene.add(m1, m2, m3);
//   });

// vase

// gltfLoader.load(
//   "flower_vase.glb", // Replace with the path to your GLTF/GLB file
//   (gltf) => {
//     const model5 = gltf.scene;
//     model5.position.set(-45, -3, 35);
//     model5.scale.set(5, 5, 5);
//     scene.add(model5)
//   },
//   (xhr) => {
//     console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`); // Track loading progress
//   },
//   (error) => {
//     console.error("Error loading model:", error); // Capture any errors
//   }
// );


//stairs
let stairsModel;
let stairsBox;
const stairDistance = 2; // Adjust this value to set the desired distance from the stairs

// Modify your stairs loading function
gltfLoader.load(
  "staircase.glb",
  (gltf) => {
    stairsModel = gltf.scene;
    stairsModel.position.set(51, -3, -18);

    stairsModel.scale.set(5, 5, 5);
    scene.add(stairsModel);

    // Calculate the bounding box of the stairs
    stairsBox = new THREE.Box3().setFromObject(stairsModel);
    // console.log(stairsBox.min.x)

    // Expand the bounding box by the stair distance
    stairsBox.min.subScalar(stairDistance);
    stairsBox.max.addScalar(stairDistance);
  },
  (xhr) => {
    console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`);
  },
  (error) => {
    console.error("Error loading model:", error);
  }
);
let stairsModel1;
let stairsBox1;
const stairDistance1 = 2; // Adjust this value to set the desired distance from the stairs

// Modify your stairs loading function
gltfLoader.load(
  "staircase.glb",
  (gltf) => {
    stairsModel1 = gltf.scene;
    stairsModel1.position.set(-51, -4, -48);
    stairsModel1.rotation.y = Math.PI;
    stairsModel1.scale.set(5, 5, 5);
    scene.add(stairsModel1);

    // Calculate the bounding box of the stairs
    stairsBox1 = new THREE.Box3().setFromObject(stairsModel1);
    // console.log(stairsBox1.max.y)

    // Expand the bounding box by the stair distance
    stairsBox1.min.subScalar(stairDistance1);
    stairsBox1.max.addScalar(stairDistance1);
  },
  (xhr) => {
    console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`);
  },
  (error) => {
    console.error("Error loading model:", error);
  }
);

function isTooCloseToStairs(position) {
  if (!stairsBox) return false;
  if (stairsBox) {
    return stairsBox.containsPoint(position);

  }
}
function isTooCloseToStairs1(position) {
  if (!stairsBox1) return false;
  if (stairsBox1) {
    return stairsBox1.containsPoint(position);
  }
}






// fountain
const fbxLoader = new FBXLoader();
fbxLoader.load(
  "zsolnay-fountain/source/фонтан3.fbx", // Replace with the path to your GLTF/GLB file
  (model) => {
    model.position.set(0, 4, 0);
    model.scale.set(0.04, 0.04, 0.04);
    scene.add(model)
  },
  (xhr) => {
    console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`); // Track loading progress
  },
  (error) => {
    console.error("Error loading model:", error); // Capture any errors
  }
);





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
floorPlane.receiveShadow = true;

const patchPlane1 = new THREE.Mesh(patchGeometry, patchMaterial);
const patchPlane2 = new THREE.Mesh(patchGeometry, patchMaterial);
const patchPlane3 = new THREE.Mesh(patchGeometry, patchMaterial);
const patchPlane4 = new THREE.Mesh(patchGeometry, patchMaterial);


patchPlane1.position.set(-20, -2.999, 20);
patchPlane1.rotation.set(Math.PI / 2, 0, 0);
patchPlane2.position.set(20, -2.999, -20);
patchPlane2.rotation.set(Math.PI / 2, 0, 0);
patchPlane3.position.set(-20, -2.999, -20);
patchPlane3.rotation.set(Math.PI / 2, 0, 0);
patchPlane4.position.set(20, -2.999, 20);
patchPlane4.rotation.set(Math.PI / 2, 0, 0);


// Add information for patch planes
const patchInfo = [
  { title: "Patch 1", description: giloy_info },
  { title: "Patch 3", description: aloeVeraInfo },
  { title: "Patch 4", description: tulsiInfo },
  { title: "Patch 2", description: gotukola_info },
];

// Assign userData to patch planes
patchPlane1.userData = { info: patchInfo[0] };
patchPlane2.userData = { info: patchInfo[1] };
patchPlane3.userData = { info: patchInfo[2] };
patchPlane4.userData = { info: patchInfo[3] };


// Create an array of patch planes
const patchPlanes = [patchPlane1, patchPlane2, patchPlane3, patchPlane4];

// Add the floor and patches to the scene
scene.add(floorPlane);
scene.add(patchPlane1, patchPlane2, patchPlane3, patchPlane4);

// Camera positioning
camera.position.set(0, 3, 30);

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


const modelData = [
  //     // Your model data here
  //     {
  //       path: 'giloye.glb',
  //       position: { x: -20, y: -3, z: 20 },
  //       scale: {x:10, y:10, z:10},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   {
  //       path: 'giloye.glb',
  //       position: { x: -23, y: -3, z: 17 },
  //       scale: {x:10, y:10, z:10},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   {
  //       path: 'giloye.glb',
  //       position: { x: -23, y: -3, z: 23 },
  //       scale: {x:10, y:10, z:10},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   {
  //       path: 'giloye.glb',
  //       position: { x: -17, y: -3, z: 23 },
  //       scale: {x:10, y:10, z:10},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   {
  //       path: 'giloye.glb',
  //       position: { x: -17, y: -3, z: 17 },
  //       scale: {x:10, y:10, z:10},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   // 2nd set
  //   {
  //       path: 'golumolu.glb',
  //       position: { x: 6.5, y: -3, z: 20 },
  //       scale: {x:20, y:20, z:20},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },

  //   {
  //       path: 'golumolu.glb',
  //       position: { x: 3, y: -3, z: 17 },
  //       scale: {x:20, y:20, z:20},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   {
  //       path: 'golumolu.glb',
  //       position: { x: 3, y: -3, z: 23 },
  //       scale: {x:20, y:20, z:20},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   {
  //       path: 'golumolu.glb',
  //       position: { x: 10, y: -3, z: 23 },
  //       scale: {x:20, y:20, z:20},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   {
  //       path: 'golumolu.glb',
  //       position: { x: 10, y: -3, z: 17 },
  //       scale: {x:20, y:20, z:20},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },

  // //   // 3rd set
  //   {
  //       path: 'aloe-vera-final.glb',
  //       position: { x:20, y: -4, z: -20 },
  //       scale: {x:5, y:5, z:5},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },

  //   {
  //       path: 'aloe-vera-final.glb',
  //       position: { x: 17, y: -4, z: -23 },
  //       scale: {x:5, y:5, z:5},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   {
  //       path: 'aloe-vera-final.glb',
  //       position: { x: 17, y: -4, z:  -17},
  //       scale: {x:5, y:5, z:5},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   {
  //       path: 'aloe-vera-final.glb',
  //       position: { x: 23, y: -4, z: -23 },
  //       scale: {x:5, y:5, z:5},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   {
  //       path: 'aloe-vera-final.glb',
  //       position: { x: 23, y: -4, z: -17 },
  //       scale: {x:5, y:5, z:5},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },

  // //   // 4th set
  //   {
  //       path: 'Tulsi.glb',
  //       position: { x: -20, y: -3, z:-20 },
  //       scale: {x:8, y:8, z:8},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },

  //   {
  //       path: 'Tulsi.glb',
  //       position: { x: -23, y: -3, z: -23 },
  //       scale: {x:8, y:8, z:8},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   {
  //       path: 'Tulsi.glb',
  //       position: { x: -23, y: -3, z: -17},
  //       scale: {x:8, y:8, z:8},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   {
  //       path: 'Tulsi.glb',
  //       position: { x: -17, y: -3, z: -17 },
  //       scale: {x:8, y:8, z:8},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },
  //   {
  //       path: 'Tulsi.glb',
  //       position: { x: -17, y: -3, z: -23 },
  //       scale: {x:8, y:8, z:8},
  //       info: { title: 'Model 1', description: 'This is a description for Model 1' }
  //   },




];




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


// Controls
const controls = new PointerLockControls(camera, document.body);

let lockPointer = true;
let showMenuOnUnlock = false;

// Fence loading and collision detection
const fenceLoader = new GLTFLoader();
const fences = [];
const fencePositions = [
  { x: -50, z: 0 },
  { x: 0, z: -50 },
  { x: 0, z: 50 },
  { x: 50, z: 0 },
];
// Load fence model and position around the plane
function loadFences(fencePositions) {


  fencePositions.forEach((pos, index) => {
    fenceLoader.load("wallfence.glb", (gltf) => {
      const fence = gltf.scene;
      fence.position.set(pos.x, -3, pos.z);
      fence.scale.set(30, 10, 10);

      if (index === 0 || index === 3) {
        fence.rotation.y = Math.PI / 2;
      }

      fences.push(fence);
      scene.add(fence);
    });
  });
}

loadFences(fencePositions);

// Collision detection
const fountainRadius = 15;
const fountainPosition = new THREE.Vector3(0, 0, 0);

function checkCollision(newPosition) {
  for (let fence of fences) {
    const fenceBoundingBox = new THREE.Box3().setFromObject(fence);
    const playerBoundingBox = new THREE.Box3().setFromCenterAndSize(
      newPosition,
      new THREE.Vector3(1, 3, 1)
    );

    if (fenceBoundingBox.intersectsBox(playerBoundingBox)) {
      return true;
    }
  }

//   const distanceToFountain = newPosition.distanceTo(fountainPosition);
//   if (distanceToFountain < fountainRadius) {
//     return true;
//   }


//   return false;
// }

const gardens = [gardenGroup, leftGarden, rightGarden];
  
  for (let garden of gardens) {
    garden.traverse((child) => {
      if (child.isMesh) {
        const boundingBox = new THREE.Box3().setFromObject(child);
        const playerBox = new THREE.Box3().setFromCenterAndSize(
          newPosition,
          new THREE.Vector3(1, 3, 1)
        );
        
        if (boundingBox.intersectsBox(playerBox)) {
          return true;
        }
      }
    });
  }
  const distanceToFountain = newPosition.distanceTo(fountainPosition);
  if (distanceToFountain < fountainRadius) {
    return true;
  }

  return false;
}



function updateMovement(delta) {
  const moveSpeed = 25 * delta;
  const acceleration = 15;
  const newPosition = new THREE.Vector3();
  camera.getWorldPosition(newPosition);

  if (keysPressed.ArrowRight || keysPressed.d) {
    controls.moveRight(moveSpeed);
    camera.getWorldPosition(newPosition);

    if (checkCollision(newPosition) || isTooCloseToStairs(newPosition)|| isTooCloseToStairs1(newPosition)) {
      controls.moveRight(-moveSpeed);
    }
  }
  if (keysPressed.ArrowLeft || keysPressed.a) {
    controls.moveRight(-moveSpeed);
    camera.getWorldPosition(newPosition);
    if (checkCollision(newPosition) || isTooCloseToStairs(newPosition)|| isTooCloseToStairs1(newPosition)) {
      controls.moveRight(moveSpeed);
    }
  }
  if (keysPressed.ArrowUp || keysPressed.w) {
    controls.moveForward(moveSpeed);
    camera.getWorldPosition(newPosition);
    if (camera.position.y >= stairsBox.min.y && camera.position.y <= stairsBox.max.y && isTooCloseToStairs(newPosition)) {
      camera.position.y += moveSpeed * (delta) * acceleration;
      camera.position.x += moveSpeed * (delta) * acceleration;

    }
    if(camera.position.y>=32)
    {
      camera.position.y=33;
    }
    if (camera.position.y >= stairsBox1.min.y && camera.position.y <= stairsBox1.max.y && isTooCloseToStairs1(newPosition)) {
      camera.position.y += moveSpeed * (delta) * acceleration;
      camera.position.x -= moveSpeed * (delta) * acceleration;

    }
    if (checkCollision(newPosition) || isTooCloseToStairs(newPosition) || isTooCloseToStairs1(newPosition)) {
      controls.moveForward(-moveSpeed);
    }
  }
  if (keysPressed.ArrowDown || keysPressed.s) {
    controls.moveForward(-moveSpeed);
    camera.getWorldPosition(newPosition);
    if (checkCollision(newPosition) || isTooCloseToStairs(newPosition)|| isTooCloseToStairs1(newPosition)) {
      controls.moveForward(moveSpeed);
    }
  }
  if (camera.position.x > 0 && keysPressed.j && camera.position.y > 3) {
    // This handles going down the right stairs
    camera.position.y -= moveSpeed * (delta) * (acceleration - 3);
    camera.position.x -= moveSpeed * (delta) * acceleration;
  }
  if (keysPressed.j && camera.position.y <= 3 && isTooCloseToStairs(newPosition)) {
    // When you reach the bottom of the right stairs
    camera.position.x = 18;  // Move to the correct right-side position
  }
  
  if (camera.position.x < 0 && keysPressed.j && camera.position.y > 3) {
    // This handles going down the left stairs
    camera.position.y -= moveSpeed * (delta) * (acceleration - 3);
    camera.position.x += moveSpeed * (delta) * acceleration;
  }
  if (keysPressed.j && camera.position.y <= 3 && isTooCloseToStairs1(newPosition)) {
    // When you reach the bottom of the left stairs
    camera.position.x = -18;  // Move to the correct left-side position
  }
  
}


// // Function to create and position all three gardens
// // Function to create and position all three gardens with all assets
// function setupThreeGardens() {
//   // Wait for the original garden to fully load
//   loadingManager.onLoad = () => {
//     // Clone the entire scene twice
//     const leftGarden = scene.clone(true);
//     const rightGarden = scene.clone(true);

//     // Function to remove camera and sky from a garden
//     const removeUniqueElements = (garden) => {
//       garden.children = garden.children.filter(child =>
//         !(child instanceof THREE.PerspectiveCamera) &&
//         !(child instanceof Sky)
//       );
//     };

//     // Remove camera and sky from cloned gardens
//     removeUniqueElements(leftGarden);
//     removeUniqueElements(rightGarden);

//     // Position the cloned gardens
//     leftGarden.position.set(-115, 30, 0);
//     rightGarden.position.set(115, 30, 0);

//     // Add the cloned gardens to the scene
//     scene.add(leftGarden);
//     scene.add(rightGarden);

//     // Update collision detection to include new gardens
//     updateCollisionDetection();

//     console.log("All three gardens have been set up.");
//   };
// }

// function updateCollisionDetection() {
//   const gardenWidth = 100;  // Adjust based on your garden size
//   const gardenHeight = 50;  // Height difference between gardens
//   xz
//   function checkCollision(newPosition) {
//     for (let xOffset of [-100, 0, 100]) {
//       const yOffset = xOffset === 0 ? 0 : gardenHeight;

//       // Check collision with all objects in each garden
//       scene.children.forEach(object => {
//         if (object instanceof THREE.Group) {  // Assuming each garden is a Group
//           object.children.forEach(child => {
//             if (child.isMesh) {
//               const childBoundingBox = new THREE.Box3().setFromObject(child);
//               childBoundingBox.min.add(new THREE.Vector3(xOffset, yOffset, 0));
//               childBoundingBox.max.add(new THREE.Vector3(xOffset, yOffset, 0));

//               const playerBoundingBox = new THREE.Box3().setFromCenterAndSize(
//                 newPosition,
//                 new THREE.Vector3(1, 3, 1)
//               );

//               if (childBoundingBox.intersectsBox(playerBoundingBox)) {
//                 return true;
//               }
//             }
//           });
//         }
//       });
//     }

//     return false;
//   }

//   // Replace the existing checkCollision function with this new one
//   window.checkCollision = checkCollision;
// }

// // Call this function during your initial scene setup
// setupThreeGardens();



// Add all garden elements (assets, objects, interactive components)
// loadFences( 
//   [{ x: -210, z: 0 },
//   { x: 0, z: -50 },
//   { x: 0, z: 50 },
//   { x: 50, z: 0 },
//   ]);
// gardenGroup.add(fountain);
// gardenGroup.add(plant);

// Add any other garden components...

const gardenGroup = new THREE.Group();

let modelsToLoad = 11; // Number of asynchronous models to load (adjust according to your needs)
let modelsLoaded = 0; // Counter to track loaded models
let leftGarden;
let rightGarden;
// Function to check if all models are loaded
function checkAllModelsLoaded() {
    if (modelsLoaded === modelsToLoad) {
        // Clone the garden group for left and right floating gardens
        leftGarden = gardenGroup.clone(true);
        rightGarden = gardenGroup.clone(true);

        // Position the floating gardens
        leftGarden.position.set(-112, 30, 0);
        leftGarden.rotation.y = -Math.PI/2;
        rightGarden.position.set(112, 30, 0);
        rightGarden.rotation.y = Math.PI/2;
        // Add the cloned gardens to the scene
        scene.add(leftGarden);
        scene.add(rightGarden);
    }
}

// Load the benches
let modela, modelb, modelc, modeld;
gltfLoader.load(
    "bench.glb", // Replace with the path to your GLTF/GLB file
    (gltf) => {
        modela = gltf.scene;
        modela.position.set(-42.5, -3, -3.5);
        modela.scale.set(4, 4, 4);
        modelb = modela.clone();
        modelb.position.set(-42.5, -3, 15);
        modelb.scale.set(4, 4, 4);
        modelc = modela.clone();
        modelc.rotation.y = Math.PI;
        modelc.position.set(42.5, -3, -15);
        modelc.scale.set(4, 4, 4);
        modeld = modela.clone();
        modeld.rotation.y = Math.PI;
        modeld.position.set(42.5, -3, 3.5);
        modeld.scale.set(4, 4, 4);
        gardenGroup.add(modela, modelb, modelc, modeld);

        // Increment the loaded models counter
        modelsLoaded++;
        checkAllModelsLoaded();
    }
);

let model1,model2,model3,model4;
gltfLoader.load(
  "street_lamp.glb", // Replace with the path to your GLTF/GLB file
  (gltf) => {
    model1 = gltf.scene;
    model1.position.set(-42.5, -3, -42.5);
    model1.scale.set(0.02, 0.02, 0.02);
     model2 = model1.clone();
    model2.position.set(-42.5, -3, 42.5);
    model2.scale.set(0.02, 0.02, 0.02);
     model3 = model1.clone();
    model3.position.set(42.5, -3, -42.5);
    model3.scale.set(0.02, 0.02, 0.02);
     model4 = model1.clone();
    model4.position.set(42.5, -3, 42.5);
    model4.scale.set(0.02, 0.02, 0.02);
    gardenGroup.add(model1, model2, model3, model4);
    modelsLoaded++;
        checkAllModelsLoaded();
  }
);
let m1,m2,m3;
gltfLoader.load(
  "flower_stand_filled.glb", // Replace with the path to your GLTF/GLB file
  (gltf) => {
    m1 = gltf.scene;
    m1.rotation.y = -Math.PI;
    m1.position.set(25, -3, 42.5);
    m1.scale.set(0.06, 0.06, 0.06);
    m2 = m1.clone()
    m2.position.set(0, -3, 42.5);
    m2.scale.set(0.06, 0.06, 0.06);
    m3 = m1.clone()
    m3.position.set(-20, -3, 42.5);
    m3.scale.set(0.06, 0.06, 0.06);
    gardenGroup.add(m1, m2, m3);
    modelsLoaded++;
    checkAllModelsLoaded();
  });






// Add other elements to the garden group (assuming these don’t need async loading)

gardenGroup.add(floorPlane);
gardenGroup.add(patchPlane1, patchPlane2, patchPlane3, patchPlane4);

// Add the main garden group to the scene
scene.add(gardenGroup);

// Check if static models are immediately available and loaded
modelsLoaded += 8; // Assuming other models are not asynchronous and loaded immediately
checkAllModelsLoaded(); // Check after adding other models




















// Modify your existing stair climbing logic
function handleStairClimbing(delta) {
  const moveSpeed = 25 * delta;
  const acceleration = 15;

  if (keysPressed.w || keysPressed.ArrowUp) {
    if (isTooCloseToStairs(camera.position)) {
      if (camera.position.y < 50) {  // 50 is the height of elevated gardens
        camera.position.y += moveSpeed * acceleration;
        if (camera.position.x > 0) {
          camera.position.x += moveSpeed * acceleration;
        } else {
          camera.position.x -= moveSpeed * acceleration;
        }
      }
    } else {
      controls.moveForward(moveSpeed);
    }
  }

  // Add similar logic for moving down the stairs
  if (keysPressed.s || keysPressed.ArrowDown) {
    if (isTooCloseToStairs(camera.position)) {
      if (camera.position.y > 0) {  // Don't go below ground level
        camera.position.y -= moveSpeed * acceleration;
        if (camera.position.x > 0) {
          camera.position.x -= moveSpeed * acceleration;
        } else {
          camera.position.x += moveSpeed * acceleration;
        }
      }
    } else {
      controls.moveBackward(moveSpeed);
    }
  }
}




function displayModelInfo(info) {
  console.log("Displaying model info:", info);
  popup.innerHTML = `
    ${info.description}
  `;
  popup.classList.add("show");
}

function hideModelInfo() {
  popup.classList.remove("show");
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

const setupRendering = (scene, camera, renderer, patchPlanes, controls) => {
  const clock = new THREE.Clock();
  const distanceThreshold = 5;
  const raycaster = new THREE.Raycaster();

  let render = function () {
    const delta = clock.getDelta();

    updateMovement(delta);

    if (controls.isLocked) {
      let patchToShow = null;
      let closestDistance = Infinity;

      patchPlanes.forEach((patch) => {
        const dx = camera.position.x - patch.position.x;
        const dz = camera.position.z - patch.position.z;
        const distanceToPatch = Math.sqrt(dx * dx + dz * dz);

        if (distanceToPatch < distanceThreshold && distanceToPatch < closestDistance) {
          raycaster.set(
            camera.position,
            camera.getWorldDirection(new THREE.Vector3())
          );
          const intersections = raycaster.intersectObject(patch, true);
          if (intersections.length > 0) {
            patchToShow = patch;
            closestDistance = distanceToPatch;
          }
        }
      });

      if (patchToShow && closestDistance <= distanceThreshold) {
        console.log("Patch in range:", patchToShow.userData.info);
        displayModelInfo(patchToShow.userData.info);
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

setupRendering(scene, camera, renderer, patchPlanes, controls);
setupEventListeners(controls);
// Event listeners and other functions (e.g., togglePointerLock, onKeyDown, onKeyUp, etc.) remain the same
// ...

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});