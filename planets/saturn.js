import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import getFresnelMat from "../src/getFresnelMat";

export default function saturn() {
  // Create Saturn's body
  const geometry = new THREE.IcosahedronGeometry(28, 12);
  const material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("./textures/saturn/saturnmap.jpg"),
  });
  const planet = new THREE.Mesh(geometry, material);

  // Create Saturn's rings
  const ringGeometry = new THREE.RingGeometry(35, 60, 64);
  const ringMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("textures/saturn/saturnringcolor.jpg"),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  });
  const rings = new THREE.Mesh(ringGeometry, ringMaterial);

  // Tilt the rings (شوي مايلة)
  rings.rotation.x = Math.PI / 2; // Base rotation to make rings horizontal
  rings.rotation.z = Math.PI / 3; // Tilt the rings by 30 degrees

  // Create a group to hold both the planet and rings
  const saturnGroup = new THREE.Group();
  saturnGroup.add(planet);
  saturnGroup.add(rings);

  const fresnelMat = getFresnelMat({
    rimHex: "#d49a44",
    facingHex: 0xffffff,
  });
  const glow = new THREE.Mesh(geometry, fresnelMat);
  planet.add(glow);

  return saturnGroup;
}
