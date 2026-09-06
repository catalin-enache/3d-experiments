import * as THREE from "three/webgpu";
import * as THREE_WEBGL from "three";

export function isWebGPURenderer(
  renderer: THREE.WebGPURenderer | THREE_WEBGL.WebGLRenderer
): renderer is THREE.WebGPURenderer {
  return renderer instanceof THREE.WebGPURenderer;
}
