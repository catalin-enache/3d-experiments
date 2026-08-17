import * as THREE from 'three';
import type { Pane } from 'tweakpane';

export function buildBindings({
  pane,
  object
}: {
  pane: Pane;
  object: THREE.Object3D;
}) {
  pane.addBinding(object, 'position', {
    label: 'Position'
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

  pane.addBinding({ rotation }, 'rotation', {
    label: 'Rotation'
  });

  pane.addBinding(object, 'scale', {
    label: 'Scale'
  });

  pane.addBinding(object, 'visible', { label: 'Visible' });

  if (object instanceof THREE.Light) {
    const lightFolder = pane.addFolder({ title: 'Light' });
    lightFolder.addBinding(object, 'color', { label: 'Color' });
    lightFolder.addBinding(object, 'intensity', { label: 'Intensity', min: 0 });
  }
}
