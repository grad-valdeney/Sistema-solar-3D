import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 2000);
camera.position.set(0, 50, 150);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Luz solar
const sunLight = new THREE.PointLight(0xffffff, 2, 0);
scene.add(sunLight);

// Sol
const sunGeo = new THREE.SphereGeometry(10, 64, 64);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Planetas simplificados
const planetsData = [
  { name: 'Mercúrio', color: 0xaaaaaa, size: 1, distance: 15 },
  { name: 'Vênus', color: 0xffcc99, size: 2, distance: 22 },
  { name: 'Terra', color: 0x3399ff, size: 2.5, distance: 30 },
  { name: 'Marte', color: 0xff3300, size: 2, distance: 38 },
  { name: 'Júpiter', color: 0xffcc66, size: 6, distance: 50 },
  { name: 'Saturno', color: 0xffcc99, size: 5, distance: 65 },
  { name: 'Urano', color: 0x66ffff, size: 4, distance: 78 },
  { name: 'Netuno', color: 0x3366ff, size: 4, distance: 90 }
];

const planets = [];

planetsData.forEach(data => {
  const geo = new THREE.SphereGeometry(data.size, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const planet = new THREE.Mesh(geo, mat);
  planet.userData = { angle: Math.random() * Math.PI * 2, distance: data.distance, speed: 0.01 + Math.random() * 0.01 };
  planets.push(planet);
  scene.add(planet);
});

// Malha gravitacional
const gravityLines = new THREE.Group();
const gridSize = 200;
const divisions = 50;
const gridHelper = new THREE.GridHelper(gridSize, divisions, 0x00ff00, 0x00ff00);
gridHelper.rotation.x = Math.PI / 2;
gravityLines.add(gridHelper);
gravityLines.visible = false;
scene.add(gravityLines);

document.getElementById('gravityToggle').addEventListener('change', (e) => {
  gravityLines.visible = e.target.checked;
});

// Controles
const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  // Movimento dos planetas
  planets.forEach(planet => {
    planet.userData.angle += planet.userData.speed;
    planet.position.x = planet.userData.distance * Math.cos(planet.userData.angle);
    planet.position.z = planet.userData.distance * Math.sin(planet.userData.angle);
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});