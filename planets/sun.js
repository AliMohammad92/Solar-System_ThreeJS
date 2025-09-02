import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
import getFresnelMat from "../src/getFresnelMat";

export default function earth() {
  const geometry = new THREE.IcosahedronGeometry(100, 12);
  const sunTexture = new THREE.TextureLoader().load("textures/sun/sun.jpg");
  const material = new THREE.MeshStandardMaterial({
    map: sunTexture,
    emissiveMap: sunTexture,
    emissive: new THREE.Color(0xfff000),
    emissiveIntensity: 1.3,
    // transparent: true,
    // opacity: 0.9,
  });
  const planet = new THREE.Mesh(geometry, material);

  const fresnelMat = getFresnelMat({
    rimHex: 0xfff000,
    facingHex: 0xff0000,
  });
  const glow = new THREE.Mesh(geometry, fresnelMat);
  planet.add(glow);

  return planet;
}
