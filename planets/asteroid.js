import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RotationalMotion } from "../src/rotationalMotion";

export default function asteroid() {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      "/static/asteroid_1a_game_model/scene.gltf",
      (gltf) => {
        let model = gltf.scene;
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        resolve(model);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
}
