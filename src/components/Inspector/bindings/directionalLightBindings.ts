import * as THREE from "three";
import { type FolderApi } from "tweakpane";

const mapSizeOptions = Object.fromEntries(
  Array.from({ length: 14 }, (_, i) => {
    const value = 2 ** i;
    return [value, value];
  })
);

export const directionalLightBindings = ({
  object,
  lightFolder,
  gl
}: {
  object: THREE.DirectionalLight;
  lightFolder: FolderApi;
  gl: THREE.WebGLRenderer;
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

  lightFolder.addBinding(object, "castShadow", {
    label: "Cast Shadow"
  });

  const directionalFolder = lightFolder.addFolder({
    title: "Directional Light"
  });

  directionalFolder.addBinding(object, "castShadow", {
    label: "Cast Shadow"
  });

  const shadowFolder = directionalFolder.addFolder({
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

  shadowFolder.addBinding(shadowMapSize, "value", {
    label: "Map Size",
    options: mapSizeOptions
  });

  shadowFolder.addBinding(object.shadow, "intensity", {
    label: "Intensity",
    min: 0,
    max: 1
  });

  shadowFolder.addBinding(object.shadow, "normalBias", {
    label: "Normal Bias",
    step: 0.001
  });

  const shadowCamera = object.shadow.camera;

  const cameraFolder = shadowFolder.addFolder({
    title: "Shadow Camera"
  });

  cameraFolder
    .addBinding(shadowCamera, "left", {
      label: "Left"
    })
    .on("change", () => {
      shadowCamera.updateProjectionMatrix();
    });

  cameraFolder
    .addBinding(shadowCamera, "right", {
      label: "Right"
    })
    .on("change", () => {
      shadowCamera.updateProjectionMatrix();
    });

  cameraFolder
    .addBinding(shadowCamera, "top", {
      label: "Top"
    })
    .on("change", () => {
      shadowCamera.updateProjectionMatrix();
    });

  cameraFolder
    .addBinding(shadowCamera, "bottom", {
      label: "Bottom"
    })
    .on("change", () => {
      shadowCamera.updateProjectionMatrix();
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
