import * as THREE from "three";
import CameraControls from "camera-controls";
CameraControls.install({ THREE: THREE });

// init

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  10
);
camera.position.z = 1;

const scene = new THREE.Scene();

let res = 2;
const planeGeometry = new THREE.PlaneGeometry(2, 1, 2 * res, 1 * res);
const vertices = planeGeometry.attributes.position.array;

for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
  //@ts-ignore
  vertices[j + 2] += Math.random() * 0.3;
}

// const boxGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);

//Materials
const blueMaterial = new THREE.MeshLambertMaterial();
blueMaterial.color = new THREE.Color(0x1090ef);

const whiteMaterial = new THREE.MeshLambertMaterial();
whiteMaterial.color = new THREE.Color(0xefefef);

const grassMaterial = new THREE.MeshLambertMaterial({ wireframe: true });
grassMaterial.color = new THREE.Color(0x8fef10);

//Create a PointLight and turn on shadows for the light
const pointLight = new THREE.PointLight(0xffffff, 1, 60);
pointLight.position.set(0.5, 0.6, 0.25);
pointLight.castShadow = true; // default false
scene.add(pointLight);

const sphereSize = 0.01;
const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
scene.add(pointLightHelper);

const ambientlight = new THREE.AmbientLight(0x404040, 1); // soft white light
scene.add(ambientlight);

// const dir_light = new THREE.DirectionalLight(0xffffff, 0.4);
// dir_light.rotateY(Math.PI);
// scene.add(dir_light);

// const dir_light_helper = new THREE.DirectionalLightHelper(dir_light, 0.1);
// scene.add(dir_light_helper);

//Set up shadow properties for the light
pointLight.shadow.mapSize.width = 512; // default
pointLight.shadow.mapSize.height = 512; // default
pointLight.shadow.camera.near = 0.5; // default
pointLight.shadow.camera.far = 500; // default

//raycaster

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

//cone
const coneGeometry = new THREE.ConeGeometry(0.05, 0.25);
coneGeometry.translate(0, 0.25 / 2, 0);

const groundMesh = new THREE.Mesh(planeGeometry, whiteMaterial);
groundMesh.material.side = THREE.DoubleSide;
groundMesh.rotateX(-Math.PI / 2);
groundMesh.position.set(0, -0.1, 0);
scene.add(groundMesh);
let copyMesh = groundMesh.clone();
copyMesh.material = grassMaterial;
scene.add(copyMesh);
// const mesh = new THREE.Mesh(boxGeometry, whiteMaterial);
// scene.add(mesh);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", onWindowResize, false);

window.addEventListener("pointerdown", onPointerDown, false);
renderer.domElement.addEventListener("pointermove", onPointerMove, false);

let drop = new THREE.Mesh(coneGeometry, blueMaterial);
scene.add(drop);
function onPointerDown(event: PointerEvent) {
  if (event.buttons == 1) {
    drop = new THREE.Mesh(coneGeometry, blueMaterial);
    scene.add(drop);
    onPointerMove(event);
  }
}
function onPointerMove(event: PointerEvent) {
  pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  // See if the ray from the camera into the world hits one of our meshes
  const intersects = raycaster.intersectObject(groundMesh);
  // Toggle rotation bool for meshes that we clicked
  if (intersects[0]?.face) {
    drop.position.set(0, 0, 0);
    drop.lookAt(intersects[0].face.normal);
    drop.position.copy(intersects[0].point);
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
renderer.setSize(window.innerWidth, window.innerHeight);
// animation

function animation() {
  // mesh.rotation.x = time / 2000;
  // mesh.rotation.y = time / 1000;

  // snip
  const delta = clock.getDelta();
  cameraControls.update(delta);

  renderer.render(scene, camera);
}

// snip ( init three scene... )
const clock = new THREE.Clock();

const cameraControls = new CameraControls(camera, renderer.domElement);

cameraControls.mouseButtons.left = undefined as any;
cameraControls.mouseButtons.middle = THREE.MOUSE.PAN as any;
cameraControls.mouseButtons.right = THREE.MOUSE.DOLLY as any;

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
<h1>raycast demo</h1>
`;
