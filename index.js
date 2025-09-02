import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { RotationalMotion } from "./src/rotationalMotion.js";
import { CameraManager } from "./camera.js";
import { PhysicsEngine } from "./physics.js";
import { SolarSystem } from "./solarSystem.js";
import { DebugGUI } from "./debugGUI.js";

// ! THE STARS
import getStarfield from "./src/getStarfield.js";

// ! SOLAR SYSTEM PLANETS
import asteroid from "./planets/asteroid.js";

// Initialize modules
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const cameraManager = new CameraManager(renderer);
const physicsEngine = new PhysicsEngine();
const solarSystem = new SolarSystem();
const debugGUI = new DebugGUI();

// Create starfield
const stars = getStarfield({ numStars: 30000 });
scene.add(stars);

// Initialize solar system
solarSystem.initialize(scene);

// Add asteroid and camera tracking variables
let asteroidModel = null;
let asteroidMotion = null;
let asteroidVelocity = new THREE.Vector3();

// Set up reset callback
debugGUI.setResetCallback(() => resetAsteroid());

// Function to reset asteroid state
function resetAsteroid() {
  if (asteroidModel) {
    const debug = debugGUI.getDebug();
    // Update position and velocity from debug controls
    asteroidModel.position.set(
      debug.asteroid.initialPosition.x,
      debug.asteroid.initialPosition.y,
      debug.asteroid.initialPosition.z
    );
    
    asteroidVelocity.set(
      debug.asteroid.initialVelocity.x,
      debug.asteroid.initialVelocity.y,
      debug.asteroid.initialVelocity.z
    );
    
    // Reset acceleration
    debug.asteroid.acceleration = { x: 0, y: 0, z: 0 };
    
    console.log('Asteroid reset to initial state');
  }
}

// Load asteroid model
asteroid().then((model) => {
  const debug = debugGUI.getDebug();
  // Set initial position and scale
  model.position.set(
    debug.asteroid.initialPosition.x,
    debug.asteroid.initialPosition.y,
    debug.asteroid.initialPosition.z
  );
  // Set initial scale based on debug size
  const initialSize = debug.asteroid.size;
  model.scale.set(initialSize, initialSize, initialSize);
  scene.add(model);
  asteroidModel = model;

  asteroidMotion = new RotationalMotion();

  // Set initial velocity from debug object
  asteroidVelocity.set(
    debug.asteroid.initialVelocity.x,
    debug.asteroid.initialVelocity.y,
    debug.asteroid.initialVelocity.z
  );

  // Add ambient lighting around the asteroid
  const asteroidAmbientLight = new THREE.AmbientLight(0x666666, 0.6);
  asteroidAmbientLight.position.set(0, 0, 0);
  model.add(asteroidAmbientLight);
  
  // Add point light for close-range illumination
  const asteroidLight = new THREE.PointLight(0xffffff, 15, 1500);
  asteroidLight.position.set(0, 0, 0);
  model.add(asteroidLight);

  // Add warm accent light
  const asteroidLight2 = new THREE.PointLight(0xffeecc, 8, 800);
  asteroidLight2.position.set(3, 3, 3);
  model.add(asteroidLight2);

  // Add back lighting for depth
  const backLight = new THREE.DirectionalLight(0xffffff, 1.2);
  backLight.position.set(-3, 1, 3);
  model.add(backLight);
  
  // Add fill light for shadow softening
  const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.8);
  fillLight.position.set(2, -1, -2);
  model.add(fillLight);

  cameraManager.updateCameraPosition(asteroidModel);
});

// Handle window resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = performance.now() / 1000;
  const debug = debugGUI.getDebug();

  // Update solar system
  solarSystem.updatePlanetRotations();
  solarSystem.updateOrbitRotations();

  if (asteroidModel && asteroidMotion) {
    if (!debug.simulation.paused) {
      // Update asteroid scale based on debug size control
      const currentSize = debug.asteroid.size;
      asteroidModel.scale.set(currentSize, currentSize, currentSize);
      
      asteroidMotion.update(asteroidModel, elapsedTime);

      const asteroidPos = asteroidModel.position.clone();
      const sunPos = new THREE.Vector3(0, 0, 0);
      const jupiterPlanet = solarSystem.getPlanet('jupiter');
      const jupiterPos = jupiterPlanet.position.clone();

      // Update physics engine masses
      const masses = debugGUI.getMasses();
      physicsEngine.updateMasses(masses);
      physicsEngine.setGConstant(debug.simulation.G);

      // Calculate forces
      const sunForce = physicsEngine.gravitationalForce(masses.sun, asteroidPos, sunPos);
      const jupiterForce = physicsEngine.gravitationalForce(masses.jupiter, asteroidPos, jupiterPos);
      const totalForce = new THREE.Vector3().add(sunForce).add(jupiterForce);

      // Update acceleration, velocity, and position
      const acceleration = totalForce.divideScalar(masses.asteroid);
      asteroidVelocity.add(acceleration.clone().multiplyScalar(debug.simulation.dt));
      asteroidModel.position.add(asteroidVelocity.clone().multiplyScalar(debug.simulation.dt));

      // Calculate distances
      const distanceToSun = asteroidPos.distanceTo(sunPos);
      const distanceToJupiter = asteroidPos.distanceTo(jupiterPos);

      // Update debug values
      debugGUI.updateAsteroidState(
        asteroidModel.position,
        asteroidVelocity,
        acceleration,
        distanceToSun,
        distanceToJupiter
      );

      // Check for collisions
      const collisionData = physicsEngine.checkCollision(
        asteroidModel,
        jupiterPlanet
      );

      if (collisionData.collision) {
        const collisionResult = physicsEngine.handleCollision(
          asteroidModel,
          asteroidVelocity,
          collisionData,
          jupiterPlanet
        );
        
        if (collisionResult === "explode") {
          scene.remove(asteroidModel);
          asteroidModel = null;
        }
      }
    }

    cameraManager.updateCameraPosition(asteroidModel);
  }

  cameraManager.update();
  renderer.render(scene, cameraManager.getCamera());
}

animate();
