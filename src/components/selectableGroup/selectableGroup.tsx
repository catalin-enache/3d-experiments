import * as THREE from 'three';
import { type ReactNode } from 'react';

export function SelectableGroup({
  setSelectedObject,
  children
}: {
  setSelectedObject: (object: THREE.Object3D | null) => void;
  children: ReactNode;
}) {
  return (
    <group
      onDoubleClick={(event) => {
        event.stopPropagation();

        // The actual object hit by the ray-cast,
        // not this <group>.
        setSelectedObject(event.object);
      }}
      onPointerMissed={(evt) => {
        if (evt.button === 0 && evt.type === 'dblclick') {
          setSelectedObject(null);
        }
      }}
    >
      {children}
    </group>
  );
}
