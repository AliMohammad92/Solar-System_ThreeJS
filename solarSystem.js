import * as THREE from "three";

// ! SOLAR SYSTEM PLANETS
import sun from "./planets/sun.js";
import mercury from "./planets/mercury.js";
import venus from "./planets/venus.js";
import earth from "./planets/earth.js";
import mars from "./planets/mars.js";
import jupiter from "./planets/jupiter.js";
import saturn from "./planets/saturn.js";
import uranus from "./planets/uranus.js";
import neptune from "./planets/neptune.js";
import pluto from "./planets/pluto.js";

export class SolarSystem {
  constructor() {
    this.scene = null;
    this.solarSystem = null;
    this.planets = {};
    this.orbits = {};
    this.orbitPaths = {};
    
    // Planet distances
    this.mercuryDistance = 118;
    this.venusDistance = 184;
    this.earthDistance = 240;
    this.marsDistance = 344;
    this.jupiterDistance = 800;
    this.saturnDistance = 1300;
    this.uranusDistance = 2600;
    this.neptuneDistance = 3000;
    
    this.sunRadius = 59.7;
  }
  
  initialize(scene) {
    this.scene = scene;
    this.createSolarSystem();
    this.createPlanets();
    this.createOrbitalPaths();
    this.positionPlanets();
    this.addLighting();
  }
  
  createSolarSystem() {
    this.solarSystem = new THREE.Group();
    this.scene.add(this.solarSystem);
  }
  
  createPlanets() {
    // Create all planets
    this.planets.sun = sun();
    this.planets.mercury = mercury();
    this.planets.venus = venus();
    this.planets.earth = earth();
    this.planets.mars = mars();
    this.planets.jupiter = jupiter();
    this.planets.saturn = saturn();
    this.planets.uranus = uranus();
    this.planets.neptune = neptune();
    this.planets.pluto = pluto();
    
    // Add sun to the center
    this.solarSystem.add(this.planets.sun);
  }
  
  createOrbitalPaths() {
    // Create orbital groups for each planet
    this.orbits.mercury = new THREE.Group();
    this.orbits.venus = new THREE.Group();
    this.orbits.earth = new THREE.Group();
    this.orbits.mars = new THREE.Group();
    this.orbits.jupiter = new THREE.Group();
    this.orbits.saturn = new THREE.Group();
    this.orbits.uranus = new THREE.Group();
    this.orbits.neptune = new THREE.Group();
    this.orbits.pluto = new THREE.Group();
    
    // Add planets to their orbits
    this.orbits.mercury.add(this.planets.mercury);
    this.orbits.venus.add(this.planets.venus);
    this.orbits.earth.add(this.planets.earth);
    this.orbits.mars.add(this.planets.mars);
    this.orbits.jupiter.add(this.planets.jupiter);
    this.orbits.saturn.add(this.planets.saturn);
    this.orbits.uranus.add(this.planets.uranus);
    this.orbits.neptune.add(this.planets.neptune);
    this.orbits.pluto.add(this.planets.pluto);
    
    // Create and add orbital paths
    this.orbitPaths.mercury = this.createOrbitPath(this.mercuryDistance, 0x888888);
    this.orbitPaths.venus = this.createOrbitPath(this.venusDistance, 0xe6b800);
    this.orbitPaths.earth = this.createOrbitPath(this.earthDistance, 0x0066cc);
    this.orbitPaths.mars = this.createOrbitPath(this.marsDistance, 0xcc3300);
    this.orbitPaths.jupiter = this.createOrbitPath(this.jupiterDistance, 0xcc9966);
    this.orbitPaths.saturn = this.createOrbitPath(this.saturnDistance, 0xe6cc99);
    this.orbitPaths.uranus = this.createOrbitPath(this.uranusDistance, 0x99ccff);
    this.orbitPaths.neptune = this.createOrbitPath(this.neptuneDistance, 0x3366ff);
    
    // Add orbit paths to solar system
    Object.values(this.orbitPaths).forEach(path => {
      this.solarSystem.add(path);
    });
    
    // Add orbits to solar system
    Object.values(this.orbits).forEach(orbit => {
      this.solarSystem.add(orbit);
    });
  }
  
  createOrbitPath(radius, color = 0x444444) {
    const points = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line(geometry, material);
  }
  
  positionPlanets() {
    // Position planets at their orbital distances
    this.planets.mercury.position.x = this.mercuryDistance;
    this.planets.venus.position.x = this.venusDistance;
    this.planets.earth.position.x = this.earthDistance;
    this.planets.mars.position.x = this.marsDistance;
    this.planets.jupiter.position.x = this.jupiterDistance;
    this.planets.saturn.position.x = this.saturnDistance;
    this.planets.uranus.position.x = this.uranusDistance;
    this.planets.neptune.position.x = this.neptuneDistance;
  }
  
  addLighting() {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x444444, 0.2);
    this.scene.add(ambientLight);
    
    // Add point light to sun
    const sunLight = new THREE.PointLight("#faf55a00", 125000);
    sunLight.position.set(0, 0, 0);
    this.planets.sun.add(sunLight);
  }
  
  updatePlanetRotations() {
    // Rotate planets (slowed down)
    this.planets.sun.rotation.y += 0.003;
    this.planets.mercury.rotation.y += 0.00034;
    this.planets.venus.rotation.y -= 0.0041 * 0.01;
    this.planets.earth.rotation.y += 0.01;
    this.planets.mars.rotation.y += 0.976 * 0.01;
    this.planets.jupiter.rotation.y += 2.424 * 0.01;
    this.planets.saturn.rotation.y += 2.243 * 0.01;
    this.planets.uranus.rotation.y += 1.395 * 0.01;
    this.planets.neptune.rotation.y += 1.491 * 0.01;
  }
  
  updateOrbitRotations() {
    // Rotate orbits (slowed down)
    this.orbits.mercury.rotation.y += 4.15 * 0.0011;
    this.orbits.venus.rotation.y += 1.62 * 0.0011;
    this.orbits.earth.rotation.y += 1 * 0.0011;
    this.orbits.mars.rotation.y += 0.53 * 0.0011;
    this.orbits.jupiter.rotation.y += 0.084 * 0.0011;
    this.orbits.saturn.rotation.y += 0.034 * 0.0011;
    this.orbits.uranus.rotation.y += 0.012 * 0.0011;
    this.orbits.neptune.rotation.y += 0.00614 * 0.0011;
  }
  
  getPlanet(name) {
    return this.planets[name];
  }
  
  getAllPlanets() {
    return this.planets;
  }
  
  getSolarSystem() {
    return this.solarSystem;
  }
  
  getSunRadius() {
    return this.sunRadius;
  }
}
