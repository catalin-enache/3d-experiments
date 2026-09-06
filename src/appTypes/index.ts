import * as THREE from "three/webgpu";
import * as THREE_WEBGL from "three";

export interface WebGLParams {
  useWebGpu?: false;
  options?: Partial<THREE_WEBGL.WebGLRendererParameters>;
}

export interface WebGPUParams {
  useWebGpu: true;
  options?: Partial<THREE.WebGPURendererParameters>;
}

export type RendererParams = WebGLParams | WebGPUParams;

export interface ScenarioParams {
  container: HTMLElement;
  rendererParams?: RendererParams;
  axesSize?: number | null;
  gridConfig?: { size?: number; divisions?: number };
}
