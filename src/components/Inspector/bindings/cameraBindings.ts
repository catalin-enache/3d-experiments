import * as THREE from "three/webgpu";
import type { FolderApi } from "tweakpane";

export const cameraBindings = ({
  object,
  cameraFolder
}: {
  object: THREE.Camera;
  cameraFolder: FolderApi;
}) => {
  if (object instanceof THREE.PerspectiveCamera) {
    const perspectiveFolder = cameraFolder.addFolder({
      title: "Perspective Camera"
    });

    perspectiveFolder
      .addBinding(object, "fov", {
        label: "FOV",
        min: 1,
        max: 179
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });

    perspectiveFolder
      .addBinding(object, "aspect", {
        label: "Aspect",
        min: 0.01
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });

    perspectiveFolder
      .addBinding(object, "near", {
        label: "Near",
        min: 0.001
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });

    perspectiveFolder
      .addBinding(object, "far", {
        label: "Far",
        min: 0.01
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });

    perspectiveFolder
      .addBinding(object, "zoom", {
        label: "Zoom",
        min: 0.01
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });

    perspectiveFolder
      .addBinding(object, "filmGauge", {
        label: "Film Gauge",
        min: 0.01
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });

    perspectiveFolder
      .addBinding(object, "filmOffset", {
        label: "Film Offset"
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });

    return;
  }

  if (object instanceof THREE.OrthographicCamera) {
    const orthographicFolder = cameraFolder.addFolder({
      title: "Orthographic Camera"
    });

    orthographicFolder
      .addBinding(object, "left", {
        label: "Left"
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });

    orthographicFolder
      .addBinding(object, "right", {
        label: "Right"
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });

    orthographicFolder
      .addBinding(object, "top", {
        label: "Top"
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });

    orthographicFolder
      .addBinding(object, "bottom", {
        label: "Bottom"
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });

    orthographicFolder
      .addBinding(object, "near", {
        label: "Near",
        min: 0
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });

    orthographicFolder
      .addBinding(object, "far", {
        label: "Far"
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });

    orthographicFolder
      .addBinding(object, "zoom", {
        label: "Zoom",
        min: 0.01
      })
      .on("change", () => {
        object.updateProjectionMatrix();
      });
  }
};
