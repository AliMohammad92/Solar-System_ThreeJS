import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function earth() {
  const geometry = new THREE.IcosahedronGeometry(3, 12);
  const material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("textures/mercury/mercurymap.jpg"),
  });

  const planet = new THREE.Mesh(geometry, material);

  planet.rotation.y += 0.01;
  planet.rotation.x += 0.001;

  return planet;
}
