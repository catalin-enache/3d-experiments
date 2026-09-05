import * as THREE from "three/webgpu";
import type { Pane, FolderApi } from "tweakpane";

type Exclude =
  | "position"
  | "rotation"
  | "scale"
  | "visible"
  | "castShadow"
  | "receiveShadow";

export const objectBindings = ({
  pane,
  folder,
  object,
  exclude
}: {
  pane: Pane;
  folder?: FolderApi;
  object: THREE.Object3D;
  exclude?: Exclude[];
}) => {
  const transformFolder =
    folder ??
    pane.addFolder({
      title: "Object 3D"
    });

  if (!exclude?.includes("position")) {
    transformFolder.addBinding(object, "position", {
      label: "Position",
      format: (value) => value.toFixed(2)
    });
  }

  const rotation = {
    get x() {
      return THREE.MathUtils.radToDeg(object.rotation.x);
    },
    set x(value: number) {
      object.rotation.x = THREE.MathUtils.degToRad(value);
    },

    get y() {
      return THREE.MathUtils.radToDeg(object.rotation.y);
    },
    set y(value: number) {
      object.rotation.y = THREE.MathUtils.degToRad(value);
    },

    get z() {
      return THREE.MathUtils.radToDeg(object.rotation.z);
    },
    set z(value: number) {
      object.rotation.z = THREE.MathUtils.degToRad(value);
    }
  };

  if (!exclude?.includes("rotation")) {
    transformFolder.addBinding({ rotation }, "rotation", {
      label: "Rotation",
      format: (value) => value.toFixed(2)
    });
  }

  if (!exclude?.includes("scale")) {
    transformFolder.addBinding(object, "scale", {
      label: "Scale",
      format: (value) => value.toFixed(2)
    });
  }

  if (!exclude?.includes("visible")) {
    transformFolder.addBinding(object, "visible", { label: "Visible" });
  }

  if (!exclude?.includes("castShadow")) {
    transformFolder.addBinding(object, "castShadow", {
      label: "Cast Shadow"
    });
  }

  if (!exclude?.includes("receiveShadow")) {
    transformFolder.addBinding(object, "receiveShadow", {
      label: "Receive Shadow"
    });
  }
};
