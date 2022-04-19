import * as THREE from "three";
import CameraControls from "camera-controls";

// init

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  10
);
camera.position.z = 1;

const scene = new THREE.Scene();

const planeGeometry = new THREE.PlaneGeometry(1, 1, 2, 2);

const boxGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);

const blueMaterial = new THREE.MeshLambertMaterial();
blueMaterial.color = new THREE.Color(0x1090ef);

const orangeMaterial = new THREE.MeshLambertMaterial();
orangeMaterial.color = new THREE.Color(0xefa010);

//Create a PointLight and turn on shadows for the light
const light = new THREE.PointLight(0xffffff, 2, 60);
light.position.set(0, 1, 4);
light.castShadow = true; // default false
scene.add(light);

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

const groundMesh = new THREE.Mesh(planeGeometry, orangeMaterial);
groundMesh.material.side = THREE.DoubleSide;
groundMesh.rotateX(-Math.PI / 2);
groundMesh.position.set(0, -0.1, 0);
scene.add(groundMesh);

const mesh = new THREE.Mesh(boxGeometry, blueMaterial);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
renderer.setSize(window.innerWidth, window.innerHeight);
// animation

function animation(time: number) {
  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;

  // snip
  const delta = clock.getDelta();
  cameraControls.update(delta);

  renderer.render(scene, camera);
}

CameraControls.install({ THREE: THREE });

// snip ( init three scene... )
const clock = new THREE.Clock();

const cameraControls = new CameraControls(camera, renderer.domElement);
