import * as THREE from "three";
import type { Pane } from "tweakpane";

export const objectBindings = ({
  pane,
  object
}: {
  pane: Pane;
  object: THREE.Object3D;
}) => {
  const transformFolder = pane.addFolder({
    title: "Object 3D"
  });

  transformFolder.addBinding(object, "position", {
    label: "Position"
  });

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

  transformFolder.addBinding({ rotation }, "rotation", {
    label: "Rotation"
  });

  transformFolder.addBinding(object, "scale", {
    label: "Scale"
  });

  transformFolder.addBinding(object, "visible", { label: "Visible" });

  transformFolder.addBinding(object, "castShadow", {
    label: "Cast Shadow"
  });

  transformFolder.addBinding(object, "receiveShadow", {
    label: "Receive Shadow"
  });
};
