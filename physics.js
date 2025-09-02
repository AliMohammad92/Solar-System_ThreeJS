import * as THREE from "three";

export class PhysicsEngine {
  constructor() {
    this.G_SIM = 2.5;
    this.EPS = 10;
    this.masses = {
      sun: 1000000,
      jupiter: 500800,
      asteroid: 4
    };
  }
  
  // Helper function to calculate gravitational force
  gravitationalForce(m_source, pos_target, pos_source) {
    const rVec = new THREE.Vector3().subVectors(pos_source, pos_target);
    const r2 = Math.max(rVec.lengthSq(), this.EPS * this.EPS);
    const fMag = (this.G_SIM * m_source * this.masses.asteroid) / r2;
    return rVec.normalize().multiplyScalar(fMag);
  }
  
  updateAsteroid(asteroidModel, jupiterPlanet, dt) {
    if (!asteroidModel) return;
    
    const dir = new THREE.Vector3().subVectors(jupiterPlanet.position, asteroidModel.position);
    const distance = dir.length();
    
    const forceMagnitude = (this.masses.asteroid * this.masses.jupiter) / (distance * distance);
    const acceleration = dir.clone().normalize().multiplyScalar(forceMagnitude / this.masses.asteroid);
    
    return { acceleration, distance };
  }
  
  checkCollision(asteroidModel, jupiterPlanet, asteroidRadius, jupiterRadius) {
    if (!asteroidModel) return { collision: false, type: null };
    
    const distance = asteroidModel.position.distanceTo(jupiterPlanet.position);
    const r1 = asteroidRadius;
    const r2 = jupiterRadius;
    
    if (distance <= (r1 + r2)) {
      return { collision: true, distance };
    }
    
    return { collision: false, distance };
  }
  
  handleCollision(asteroidModel, asteroidVelocity, collisionData, jupiterPlanet) {
    const { collision, distance } = collisionData;
    if (!collision) return false;
    
    const speed = asteroidVelocity.length();
    const Ek = 0.5 * this.masses.asteroid * speed * speed;
    
    const Ek_stuck = 0.5;
    const Ek_bounce = 20;
    
    if (Ek < Ek_stuck) {
      asteroidModel.position.copy(jupiterPlanet.position);
      asteroidVelocity.set(0, 0, 0);
      console.log("Asteroid stuck to Jupiter!");
      return "stuck";
    } else if (Ek < Ek_bounce) {
      const dir = new THREE.Vector3().subVectors(jupiterPlanet.position, asteroidModel.position);
      const normal = dir.clone().normalize();
      asteroidVelocity.reflect(normal).multiplyScalar(0.7);
      console.log("Asteroid bounced off Jupiter!");
      return "bounce";
    } else {
      console.log("Asteroid exploded on Jupiter!");
      return "explode";
    }
  }
  
  updateMasses(newMasses) {
    this.masses = { ...this.masses, ...newMasses };
  }
  
  setGConstant(value) {
    this.G_SIM = value;
  }
  
  getMasses() {
    return this.masses;
  }
  
  getGConstant() {
    return this.G_SIM;
  }
}
