import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import getFresnelMat from "../src/getFresnelMat";

export default function earth() {
  const geometry = new THREE.IcosahedronGeometry(10, 12);
  const material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("textures/earth/00_earthmap1k.jpg"),
    roughness: 1,
    metalness: 0,
  });

  const ambientEarth = new THREE.AmbientLight(0x222222, 0.1);
  const earthLights = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("textures/earth/03_earthlights1k.jpg"),
    // // transparent: true,
    // // opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });
  const lightsMesh = new THREE.Mesh(geometry, earthLights);

  const clouds = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("textures/earth/04_earthcloudmap.jpg"),
    blending: THREE.AdditiveBlending,
    opacity: 0.8,
    transparent: true,
  });
  const cloudsMesh = new THREE.Mesh(geometry, clouds);
  cloudsMesh.scale.setScalar(1.004);
  const planet = new THREE.Mesh(geometry, material);

  planet.add(lightsMesh);
  planet.add(cloudsMesh);
  planet.add(ambientEarth);

  const fresnelMat = getFresnelMat({
    rimHex: 0x0000ff,
    facingHex: 0xffffff,
  });
  const glow = new THREE.Mesh(geometry, fresnelMat);
  planet.add(glow);

  planet.rotation.y += 0.01;
  planet.rotation.x += 0.001;

  return planet;
}
