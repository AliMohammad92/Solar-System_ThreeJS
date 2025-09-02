// RotationalMotion.js
import * as THREE from "three";

export class RotationalMotion {
  constructor({
    mainAxis = new THREE.Vector3(0, 1, 0),
    mainRotationSpeed = 0.01,
    wobbleAmount = 0.003,
    wobbleSpeed = 0.5,
    axisDriftAmount = 0.02,
    axisDriftLerp = 0.01,
    axisDriftIntervalMin = 2,
    axisDriftIntervalMax = 4,
  } = {}) {
    this.mainAxis = mainAxis.clone().normalize();
    this.axisDrift = new THREE.Vector3(0, 0, 0);
    this.axisDriftTarget = new THREE.Vector3(0, 0, 0);
    this.lastAxisDriftChange = 0;
    this.mainRotationSpeed = mainRotationSpeed;
    this.wobbleAmount = wobbleAmount;
    this.wobbleSpeed = wobbleSpeed;
    this.axisDriftAmount = axisDriftAmount;
    this.axisDriftLerp = axisDriftLerp;
    this.axisDriftIntervalMin = axisDriftIntervalMin;
    this.axisDriftIntervalMax = axisDriftIntervalMax;
    this.nextDriftInterval = this._randomDriftInterval();
  }

  _randomDriftInterval() {
    return (
      this.axisDriftIntervalMin +
      Math.random() * (this.axisDriftIntervalMax - this.axisDriftIntervalMin)
    );
  }

  _randomizeAxisDrift() {
    this.axisDriftTarget.set(
      (Math.random() - 0.5) * this.axisDriftAmount,
      (Math.random() - 0.5) * this.axisDriftAmount,
      (Math.random() - 0.5) * this.axisDriftAmount
    );
    this.nextDriftInterval = this._randomDriftInterval();
  }

  update(object3D, elapsedTime) {
    // Occasionally randomize axis drift
    if (elapsedTime - this.lastAxisDriftChange > this.nextDriftInterval) {
      this._randomizeAxisDrift();
      this.lastAxisDriftChange = elapsedTime;
    }
    // Smoothly interpolate axis drift
    this.axisDrift.lerp(this.axisDriftTarget, this.axisDriftLerp);
    // Apply drift to main axis
    this.mainAxis.add(this.axisDrift).normalize();
    // Wobble: small oscillation on other axes
    const wobbleX =
      Math.sin(elapsedTime * this.wobbleSpeed) * this.wobbleAmount;
    const wobbleY =
      Math.cos(elapsedTime * this.wobbleSpeed * 0.7) * this.wobbleAmount;
    const wobbleZ =
      Math.sin(elapsedTime * this.wobbleSpeed * 1.3) * this.wobbleAmount;
    // Apply main rotation around drifting axis
    object3D.rotateOnAxis(this.mainAxis, this.mainRotationSpeed);
    // Add a little wobble to each axis
    object3D.rotation.x += wobbleX;
    object3D.rotation.y += wobbleY;
    object3D.rotation.z += wobbleZ;
  }
}
