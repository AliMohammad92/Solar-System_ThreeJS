import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class CameraManager {
  constructor(renderer) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.cameraFollowEnabled = true;
    
    // Camera offset configuration for third-person view
    this.cameraOffset = new THREE.Vector3(0, 5, 10);
    this.cameraLookAtOffset = new THREE.Vector3(0, 0, 0);
    
    // LERP factor for camera smoothing
    this.LERP_FACTOR = 0.05;
    
    this.setupCamera();
    this.setupControls();
    this.setupEventListeners();
  }
  
  setupCamera() {
    this.camera.position.z = 500;
  }
  
  setupControls() {
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enabled = false;
  }
  
  setupEventListeners() {
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }
  
  updateCameraPosition(asteroidModel) {
    if (!asteroidModel || !this.cameraFollowEnabled) return;
    
    const asteroidPosition = asteroidModel.position.clone();
    
    // Calculate the target position for the camera
    const cameraTargetPosition = asteroidPosition.clone();
    const movementDirection = new THREE.Vector3(0, 0, 0)
      .sub(asteroidPosition)
      .normalize();
    const rightVector = new THREE.Vector3()
      .crossVectors(movementDirection, new THREE.Vector3(0, 1, 0))
      .normalize();
    const upVector = new THREE.Vector3()
      .crossVectors(rightVector, movementDirection)
      .normalize();
    cameraTargetPosition.add(
      movementDirection.clone().multiplyScalar(-this.cameraOffset.z)
    );
    cameraTargetPosition.add(upVector.multiplyScalar(this.cameraOffset.y));
    
    // Use LERP to smoothly move the camera to the target position
    this.camera.position.lerp(cameraTargetPosition, this.LERP_FACTOR);
    
    // Make camera look at asteroid
    const lookAtPosition = asteroidPosition.clone().add(this.cameraLookAtOffset);
    this.camera.lookAt(lookAtPosition);
  }
  
  toggleCameraFollow() {
    this.cameraFollowEnabled = !this.cameraFollowEnabled;
    this.controls.enabled = !this.cameraFollowEnabled;
    if (!this.cameraFollowEnabled) {
      this.controls.target.copy(new THREE.Vector3(0, 0, 0));
    }
  }
  
  update() {
    if (!this.cameraFollowEnabled) {
      this.controls.update();
    }
  }
  
  getCamera() {
    return this.camera;
  }
  
  getControls() {
    return this.controls;
  }
}
