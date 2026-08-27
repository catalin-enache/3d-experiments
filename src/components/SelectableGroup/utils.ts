import * as THREE from "three";
import { AmbientLightHelper } from "./helpers/AmbientLightHelper";
import { CubeCameraHelper } from "./helpers/CubeCameraHelper";

export type Helper = NonNullable<ReturnType<typeof createHelper>>;

export function createHelper(object: THREE.Object3D) {
  if (object instanceof THREE.AmbientLight) {
    return new AmbientLightHelper(object, 1);
  }

  if (object instanceof THREE.PointLight) {
    return new THREE.PointLightHelper(object, 0.5);
  }

  if (object instanceof THREE.SpotLight) {
    return new THREE.SpotLightHelper(object);
  }

  if (object instanceof THREE.DirectionalLight) {
    return new THREE.DirectionalLightHelper(object, 1);
  }

  if (object instanceof THREE.HemisphereLight) {
    return new THREE.HemisphereLightHelper(object, 1);
  }

  if (object instanceof THREE.Camera) {
    return new THREE.CameraHelper(object);
  }

  if (object instanceof THREE.CubeCamera) {
    return new CubeCameraHelper(object);
  }

  return null;
}

export function getSelectionTarget(object: THREE.Object3D) {
  let current: THREE.Object3D | null = object;

  while (current) {
    const selectTarget = current.userData.selectTarget as
      THREE.Object3D | undefined;

    if (selectTarget) {
      return selectTarget;
    }

    current = current.parent;
  }

  return object;
}
