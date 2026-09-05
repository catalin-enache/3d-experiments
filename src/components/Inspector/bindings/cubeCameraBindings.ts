import * as THREE from "three/webgpu";
import type { Pane } from "tweakpane";

export const cubeCameraBindings = ({
  object,
  pane
}: {
  object: THREE.CubeCamera;
  pane: Pane;
}) => {
  const cubeCameraFolder = pane.addFolder({
    title: "Cube Camera"
  });

  const cameras = object.children.filter(
    (child): child is THREE.PerspectiveCamera =>
      child instanceof THREE.PerspectiveCamera
  );

  const nearFar = {
    get near() {
      return cameras[0]?.near ?? 0.1;
    },

    set near(value: number) {
      for (const camera of cameras) {
        camera.near = value;
        camera.updateProjectionMatrix();
      }
    },

    get far() {
      return cameras[0]?.far ?? 1000;
    },

    set far(value: number) {
      for (const camera of cameras) {
        camera.far = value;
        camera.updateProjectionMatrix();
      }
    }
  };

  cubeCameraFolder.addBinding(nearFar, "near", {
    label: "Near",
    min: 0.001
  });

  cubeCameraFolder.addBinding(nearFar, "far", {
    label: "Far",
    min: 0.01
  });

  cubeCameraFolder.addBinding(object, "activeMipmapLevel", {
    label: "Mipmap Level",
    min: 0,
    step: 1
  });
};
