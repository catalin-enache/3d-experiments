/*
 * Copied from: https://github.com/pmndrs/drei/blob/master/src/core/CubeCamera.tsx
 * We add a tweak to force new CubeRenderer
 * */

import * as THREE from "three/webgpu";
import * as THREE_WEBGL from "three";
import { useEffect, useMemo, useCallback, useRef, type ReactNode } from "react";
import { type ThreeElements, useFrame, useThree } from "@react-three/fiber";

export interface CubeCameraOptions {
  /** Resolution of the FBO, 256 */
  resolution?: number;
  /** Camera near, 0.1 */
  near?: number;
  /** Camera far, 1000 */
  far?: number;
  /** Custom environment map that is temporarily set as the scenes background */
  envMap?: THREE.Texture;
  /** Custom fog that is temporarily set as the scenes fog */
  fog?: THREE.Fog | THREE.FogExp2;
  /** Name of the CubeRenderer texture, useful for forcing a new CubeRenderer */
  name: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCubeCamera(
  {
    resolution = 256,
    near = 0.1,
    far = 1000,
    envMap,
    fog,
    name
  }: CubeCameraOptions = {} as CubeCameraOptions
) {
  const gl = useThree(({ gl }) => gl) as
    THREE.WebGPURenderer | THREE_WEBGL.WebGLRenderer;

  const scene = useThree(({ scene }) => scene);

  const fbo = useMemo(() => {
    if (gl instanceof THREE_WEBGL.WebGLRenderer) {
      const fbo = new THREE_WEBGL.WebGLCubeRenderTarget(resolution);
      fbo.texture.type = THREE.HalfFloatType;
      fbo.texture.name = name;
      return fbo;
    }
    const fbo = new THREE.CubeRenderTarget(resolution);
    fbo.texture.type = THREE.HalfFloatType;
    fbo.texture.name = name;
    return fbo;
  }, [resolution, name, gl]);

  useEffect(() => {
    return () => {
      fbo.dispose();
    };
  }, [fbo]);

  const camera = useMemo(
    () => new THREE.CubeCamera(near, far, fbo),
    [near, far, fbo]
  );

  interface UpdateParams {
    listOfObjectsToHideDuringUpdate?: THREE.Object3D[];
  }

  let originalFog;
  let originalBackground;
  const update = useCallback(
    ({ listOfObjectsToHideDuringUpdate = [] }: UpdateParams = {}) => {
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-x/exhaustive-deps
      originalFog = scene.fog;
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-x/exhaustive-deps
      originalBackground = scene.background;
      scene.background = envMap ?? originalBackground;
      scene.fog = fog ?? originalFog;
      listOfObjectsToHideDuringUpdate.forEach((object) => {
        object.visible = false;
      });
      camera.update(gl, scene);
      listOfObjectsToHideDuringUpdate.forEach((object) => {
        object.visible = true;
      });
      scene.fog = originalFog;
      scene.background = originalBackground;
    },
    [gl, scene, camera]
  );

  return {
    fbo,
    camera,
    update
  };
}

export type CubeCameraProps = Omit<ThreeElements["group"], "children"> & {
  /** The contents of CubeCamera will be hidden when filming the cube */
  children?: (tex: THREE.Texture) => ReactNode;
  /** Number of frames to render, Infinity */
  frames?: number;
} & CubeCameraOptions;

export function CubeCamera({
  children,
  frames = Infinity,
  resolution,
  near,
  far,
  envMap,
  fog,
  name,
  ...props
}: CubeCameraProps) {
  const ref = useRef<THREE.Group>(null);
  const { fbo, camera, update } = useCubeCamera({
    resolution,
    near,
    far,
    envMap,
    fog,
    name
  });

  let count = 0;
  useFrame(() => {
    if (ref.current && (frames === Infinity || count < frames)) {
      ref.current.visible = false;
      update();
      ref.current.visible = true;
      count++;
    }
  });
  return (
    <group {...props}>
      <primitive object={camera} />
      <group ref={ref}>{children?.(fbo.texture)}</group>
    </group>
  );
}
