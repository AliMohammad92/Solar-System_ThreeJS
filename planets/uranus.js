import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import getFresnelMat from "../src/getFresnelMat";

export default function mars() {
  const geometry = new THREE.IcosahedronGeometry(14, 12);
  const material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("textures/uranus/uranusmap.jpg"),
  });

  const planet = new THREE.Mesh(geometry, material);

  const fresnelMat = getFresnelMat({
    rimHex: 0x444444,
    facingHex: 0xffffff,
  });
  const glow = new THREE.Mesh(geometry, fresnelMat);
  planet.add(glow);

  return planet;
}
