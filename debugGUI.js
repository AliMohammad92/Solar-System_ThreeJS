import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

export class DebugGUI {
  constructor() {
    this.gui = new GUI({ width: 350 });
    this.debug = {
      // Asteroid properties
      asteroid: {
        // Current state (read-only)
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        acceleration: { x: 0, y: 0, z: 0 },
        // Editable properties
        mass: 4,
        radius: 5,
        // Initial state (editable)
        initialPosition: { x: 1500, y: 0, z: 200 },
        initialVelocity: { x: 0, y: 0, z: -20 },
        // Distances (read-only)
        distanceToSun: 0,
        distanceToJupiter: 0
      },
      // Planet properties
      planets: {
        sunMass: 1000000,
        jupiterMass: 500800,
        jupiterRadius: 36
      },
      // Simulation parameters
      simulation: {
        G: 2.5,
        dt: 0.016,  // Approximate 60 FPS
        paused: false
      }
    };
    
    this.masses = {
      sun: this.debug.planets.sunMass,
      jupiter: this.debug.planets.jupiterMass,
      asteroid: this.debug.asteroid.mass,
    };
    
    this.setupGUI();
  }
  
  setupGUI() {
    // Create GUI folders
    const asteroidFolder = this.gui.addFolder('Asteroid');
    const planetsFolder = this.gui.addFolder('Planets');
    const physicsFolder = this.gui.addFolder('Physics');
    
    // Add asteroid controls
    asteroidFolder.add(this.debug.asteroid, 'mass', 0.1, 100, 0.1).name('Mass').onChange(value => { 
      this.masses.asteroid = value; 
    });
    
    asteroidFolder.add(this.debug.asteroid, 'radius', 1, 20, 0.1).name('Collision Radius');
    asteroidFolder.add(this.debug.simulation, 'paused').name('Pause Simulation');
    
    // Add reset button
    asteroidFolder.add({ reset: () => this.resetAsteroid() }, 'reset').name('Reset Asteroid');
    
    // Current state (read-only)
    const stateFolder = asteroidFolder.addFolder('Current State');
    stateFolder.add(this.debug.asteroid.position, 'x').name('Position X').listen();
    stateFolder.add(this.debug.asteroid.position, 'y').name('Position Y').listen();
    stateFolder.add(this.debug.asteroid.position, 'z').name('Position Z').listen();
    
    stateFolder.add(this.debug.asteroid.velocity, 'x').name('Velocity X').listen();
    stateFolder.add(this.debug.asteroid.velocity, 'y').name('Velocity Y').listen();
    stateFolder.add(this.debug.asteroid.velocity, 'z').name('Velocity Z').listen();
    
    stateFolder.add(this.debug.asteroid.acceleration, 'x').name('Accel X').listen();
    stateFolder.add(this.debug.asteroid.acceleration, 'y').name('Accel Y').listen();
    stateFolder.add(this.debug.asteroid.acceleration, 'z').name('Accel Z').listen();
    
    // Initial state (editable)
    const initFolder = asteroidFolder.addFolder('Initial State');
    initFolder.add(this.debug.asteroid.initialPosition, 'x', -3000, 3000, 1).name('Position X');
    initFolder.add(this.debug.asteroid.initialPosition, 'y', -3000, 3000, 1).name('Position Y');
    initFolder.add(this.debug.asteroid.initialPosition, 'z', -3000, 3000, 1).name('Position Z');
    
    initFolder.add(this.debug.asteroid.initialVelocity, 'x', -100, 100, 0.1).name('Velocity X');
    initFolder.add(this.debug.asteroid.initialVelocity, 'y', -100, 100, 0.1).name('Velocity Y');
    initFolder.add(this.debug.asteroid.initialVelocity, 'z', -100, 100, 0.1).name('Velocity Z');
    
    // Planet controls
    planetsFolder.add(this.debug.planets, 'sunMass', 1000, 2000000, 1000).name('Sun Mass').onChange(value => { 
      this.masses.sun = value; 
    });
    
    planetsFolder.add(this.debug.planets, 'jupiterMass', 1000, 1000000, 1000).name('Jupiter Mass').onChange(value => { 
      this.masses.jupiter = value; 
    });
    
    planetsFolder.add(this.debug.planets, 'jupiterRadius', 10, 100, 1).name('Jupiter Radius');
    
    // Physics controls
    physicsFolder.add(this.debug.simulation, 'G', 0.1, 10, 0.1).name('G Constant');
    physicsFolder.add(this.debug.simulation, 'dt', 0.001, 0.033, 0.008).name('Time Step');
    
    // Distances (read-only)
    const distanceFolder = physicsFolder.addFolder('Distances');
    distanceFolder.add(this.debug.asteroid, 'distanceToSun').name('To Sun').listen();
    distanceFolder.add(this.debug.asteroid, 'distanceToJupiter').name('To Jupiter').listen();
    
    // Open main folders by default
    asteroidFolder.open();
    planetsFolder.open();
    physicsFolder.open();
    stateFolder.open();
    initFolder.open();
    distanceFolder.open();
  }
  
  resetAsteroid() {
    // This will be called from outside to reset asteroid state
    console.log('Reset asteroid requested');
  }
  
  getDebug() {
    return this.debug;
  }
  
  getMasses() {
    return this.masses;
  }
  
  updateAsteroidState(position, velocity, acceleration, distanceToSun, distanceToJupiter) {
    // Update current state values
    this.debug.asteroid.position.x = position.x;
    this.debug.asteroid.position.y = position.y;
    this.debug.asteroid.position.z = position.z;
    
    this.debug.asteroid.velocity.x = velocity.x;
    this.debug.asteroid.velocity.y = velocity.y;
    this.debug.asteroid.velocity.z = velocity.z;
    
    this.debug.asteroid.acceleration.x = acceleration.x;
    this.debug.asteroid.acceleration.y = acceleration.y;
    this.debug.asteroid.acceleration.z = acceleration.z;
    
    this.debug.asteroid.distanceToSun = distanceToSun;
    this.debug.asteroid.distanceToJupiter = distanceToJupiter;
    
    // Update masses from debug object
    this.masses.sun = this.debug.planets.sunMass;
    this.masses.jupiter = this.debug.planets.jupiterMass;
    this.masses.asteroid = this.debug.asteroid.mass;
  }
  
  setResetCallback(callback) {
    this.resetCallback = callback;
  }
}
