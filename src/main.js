import * as THREE from 'three';
import { PowerPlant } from './components/PowerPlant.js';
import { DefenseSystem } from './components/DefenseSystem.js';
import './style.css';

// UI Controls
const controls = document.createElement('div');
controls.id = 'controls';
controls.innerHTML = `
  <label>Number of Drones: <input type="number" id="droneCount" value="10" min="1" max="20"></label>
  <label>Missile Interval (ms): <input type="number" id="missileInterval" value="3000" min="1000" step="500"></label>
  <label>Simulation Duration (s): <input type="number" id="simulationDuration" value="60" min="10" step="10"></label>
  <div id="status"></div>
  <button id="applySettings">Apply Settings</button>
  <button id="startSimulation">Start Simulation</button>
`;
document.body.appendChild(controls);

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Ground plane
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x88aa88 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Initialize components
const powerPlant = new PowerPlant();
scene.add(powerPlant.mesh);

let defenseSystem = new DefenseSystem(10); // Initial drone count
defenseSystem.drones.forEach(drone => scene.add(drone.mesh));

// Camera position
camera.position.set(50, 30, 50);
camera.lookAt(0, 0, 0);

// Simulation state
let missileInterval = 3000;
let missileSpawner = null;
let simulationStartTime = 0;
let simulationDuration = 60; // seconds
let isSimulationRunning = false;
const statusElement = document.getElementById('status');

function startSimulation() {
  if (isSimulationRunning) return;
  
  isSimulationRunning = true;
  simulationStartTime = Date.now();
  document.getElementById('startSimulation').textContent = 'Restart Simulation';
  
  // Clear existing missiles and reset drones
  defenseSystem.missiles.forEach(missile => scene.remove(missile.mesh));
  defenseSystem.missiles = [];
  
  // Start spawning missiles
  missileSpawner = setInterval(() => {
    const missileMesh = defenseSystem.spawnMissile();
    scene.add(missileMesh);
  }, missileInterval);
}

function stopSimulation() {
  isSimulationRunning = false;
  clearInterval(missileSpawner);
  missileSpawner = null;
  
  // Clear missiles
  defenseSystem.missiles.forEach(missile => scene.remove(missile.mesh));
  defenseSystem.missiles = [];
}

// UI Controls handlers
document.getElementById('startSimulation').addEventListener('click', () => {
  if (isSimulationRunning) {
    stopSimulation();
  }
  startSimulation();
});

document.getElementById('applySettings').addEventListener('click', () => {
  const newDroneCount = parseInt(document.getElementById('droneCount').value);
  const newMissileInterval = parseInt(document.getElementById('missileInterval').value);
  simulationDuration = parseInt(document.getElementById('simulationDuration').value);

  stopSimulation();

  // Update missile spawn interval
  missileInterval = newMissileInterval;

  // Update defense system with new drone count
  defenseSystem.drones.forEach(drone => {
    if (drone.mesh) {
      scene.remove(drone.mesh);
    }
  });
  defenseSystem = new DefenseSystem(newDroneCount);
  defenseSystem.drones.forEach(drone => scene.add(drone.mesh));
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  if (isSimulationRunning) {
    const elapsedTime = (Date.now() - simulationStartTime) / 1000;
    const remainingTime = Math.max(0, simulationDuration - elapsedTime);
    statusElement.textContent = `Time Remaining: ${Math.ceil(remainingTime)}s`;
    
    if (remainingTime <= 0) {
      stopSimulation();
      statusElement.textContent = 'Simulation Complete';
      return;
    }
    
    defenseSystem.update(scene, powerPlant);
    
    // Remove missiles that reach the power plant
    defenseSystem.missiles.forEach(missile => {
      if (missile.mesh.position.distanceTo(powerPlant.mesh.position) < 5) {
        scene.remove(missile.mesh);
        const index = defenseSystem.missiles.indexOf(missile);
        if (index > -1) {
          defenseSystem.missiles.splice(index, 1);
        }
      }
    });
  }

  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();