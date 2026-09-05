import * as THREE from "three/webgpu";
import * as THREE_WEBGL from "three";
import { type FolderApi } from "tweakpane";

const mapSizeOptions = Object.fromEntries(
  Array.from({ length: 14 }, (_, i) => {
    const value = 2 ** i;
    return [value, value];
  })
);

export const spotLightBindings = ({
  object,
  lightFolder,
  gl
}: {
  object: THREE.SpotLight;
  lightFolder: FolderApi;
  gl: THREE.WebGPURenderer | THREE_WEBGL.WebGLRenderer;
}) => {
  const shadowMapSize = {
    get value() {
      return object.shadow.mapSize.x;
    },

    set value(size: number) {
      object.shadow.mapSize.set(size, size);

      object.shadow.map?.dispose();
      object.shadow.map = null;

      object.shadow.needsUpdate = true;
    }
  };

  const angle = {
    get value() {
      return THREE.MathUtils.radToDeg(object.angle);
    },

    set value(value: number) {
      object.angle = THREE.MathUtils.degToRad(value);
    }
  };

  const spotFolder = lightFolder.addFolder({
    title: "Spot Light"
  });

  spotFolder.addBinding(object, "castShadow", {
    label: "Cast Shadow"
  });

  spotFolder.addBinding(object, "distance", {
    label: "Distance",
    min: 0
  });

  spotFolder.addBinding(object, "decay", {
    label: "Decay",
    min: 0
  });

  spotFolder.addBinding(angle, "value", {
    label: "Angle",
    min: 0,
    max: 90
  });

  spotFolder.addBinding(object, "penumbra", {
    label: "Penumbra",
    min: 0,
    max: 1
  });

  const shadowFolder = spotFolder.addFolder({
    title: "Shadow"
  });

  shadowFolder.addBinding(object.shadow, "radius", {
    label: "Radius",
    min: 0
  });

  if (gl.shadowMap.type === THREE.VSMShadowMap) {
    shadowFolder.addBinding(object.shadow, "blurSamples", {
      label: "Blur Samples",
      min: 1,
      step: 1
    });
  }

  shadowFolder.addBinding(object.shadow, "bias", {
    label: "Bias",
    step: 0.0001
  });

  shadowFolder.addBinding(object.shadow, "normalBias", {
    label: "Normal Bias",
    step: 0.001
  });

  shadowFolder.addBinding(object.shadow, "intensity", {
    label: "Intensity",
    min: 0,
    max: 1
  });

  shadowFolder.addBinding(shadowMapSize, "value", {
    label: "Map Size",
    options: mapSizeOptions
  });

  const shadowCamera = object.shadow.camera;

  const cameraFolder = shadowFolder.addFolder({
    title: "Shadow Camera"
  });

  cameraFolder
    .addBinding(shadowCamera, "near", {
      label: "Near",
      min: 0.001
    })
    .on("change", () => {
      shadowCamera.updateProjectionMatrix();
    });

  cameraFolder
    .addBinding(shadowCamera, "far", {
      label: "Far",
      min: 0.01
    })
    .on("change", () => {
      shadowCamera.updateProjectionMatrix();
    });
};
