import * as THREE from "three";
import type { Pane } from "tweakpane";
import { glBindings } from "@src/components/Inspector/bindings/glBindings";
import { objectBindings } from "@src/components/Inspector/bindings/objectBindings";
import { lightBindings } from "@src/components/Inspector/bindings/lightBindings";
import { directionalLightBindings } from "@src/components/Inspector/bindings/directionalLightBindings";
import { spotLightBindings } from "@src/components/Inspector/bindings/spotLightBindings";
import { pointLightBindings } from "@src/components/Inspector/bindings/pointLightBindings";
import { hemisphereLightBindings } from "@src/components/Inspector/bindings/hemisphereLightBindings";
import { cameraBindings } from "@src/components/Inspector/bindings/cameraBindings";
import { cubeCameraBindings } from "@src/components/Inspector/bindings/cubeCameraBindings";

export function buildBindings({
  pane,
  object,
  gl,
  refresh,
  camera
}: {
  pane: Pane;
  object?: THREE.Object3D | null;
  gl: THREE.WebGLRenderer;
  refresh: () => void;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
}) {
  glBindings({ gl, pane, refresh });

  const cameraFolder = pane.addFolder({ title: "Camera", expanded: false });
  cameraBindings({ object: camera, cameraFolder });

  if (!object) {
    return;
  }

  objectBindings({ pane, object });

  if (object instanceof THREE.Light) {
    const lightFolder = lightBindings({ pane, object });

    if (object instanceof THREE.DirectionalLight) {
      directionalLightBindings({ object, lightFolder, gl });
    }

    if (object instanceof THREE.SpotLight) {
      spotLightBindings({ object, lightFolder, gl });
    }

    if (object instanceof THREE.PointLight) {
      pointLightBindings({ object, lightFolder, gl });
    }

    if (object instanceof THREE.HemisphereLight) {
      hemisphereLightBindings({ object, lightFolder });
    }
  }

  if (object instanceof THREE.CubeCamera) {
    cubeCameraBindings({ object, pane });
  }
}
