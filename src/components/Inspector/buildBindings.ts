import * as THREE from "three";
import type { Pane } from "tweakpane";
import { glBindings } from "@src/components/Inspector/bindings/glBindings";
import { transformBindings } from "@src/components/Inspector/bindings/transformBindings";
import { lightBindings } from "@src/components/Inspector/bindings/lightBindings";
import { directionalLightBindings } from "@src/components/Inspector/bindings/directionalLightBindings";
import { spotLightBindings } from "@src/components/Inspector/bindings/spotLightBindings";
import { pointLightBindings } from "@src/components/Inspector/bindings/pointLightBindings";
import { hemisphereLightBindings } from "@src/components/Inspector/bindings/hemisphereLightBindings";

export function buildBindings({
  pane,
  object,
  gl,
  refresh
}: {
  pane: Pane;
  object: THREE.Object3D;
  gl: THREE.WebGLRenderer;
  refresh: () => void;
}) {
  glBindings({ gl, pane, refresh });

  transformBindings({ pane, object });

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
}
