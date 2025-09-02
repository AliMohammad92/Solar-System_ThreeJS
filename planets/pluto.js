import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function mars() {
  const geometry = new THREE.IcosahedronGeometry(1, 12);
  const material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("textures/pluto/plutomaptk.jpg"),
  });

  const planet = new THREE.Mesh(geometry, material);

  //   function animate() {
  //     planet.rotation.y += 0.01;
  //     planet.rotation.x += 0.001;
  //   }

  //   animate();
  return planet;
}
