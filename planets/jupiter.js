import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import getFresnelMat from "../src/getFresnelMat";

export default function mars() {
  const geometry = new THREE.IcosahedronGeometry(36, 12);
  const material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("textures/jupiter/jupitermap.jpg"),
    roughness: 0.7,
    metalness: 0.3,
  });

  const planet = new THREE.Mesh(geometry, material);

  const fresnelMat = getFresnelMat({
    rimHex: "#d49a44",
    facingHex: 0xffffff,
  });
  const glow = new THREE.Mesh(geometry, fresnelMat);
  planet.add(glow);

  return planet;
}
