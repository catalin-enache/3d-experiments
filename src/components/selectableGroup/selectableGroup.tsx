import * as THREE from 'three';
import { useEffect, useRef, type ReactNode, useCallback } from 'react';
import type { ThreeEvent } from '@react-three/fiber';

function createHelper(object: THREE.Object3D) {
  if (object instanceof THREE.PointLight) {
    return new THREE.PointLightHelper(object, 0.5);
  }

  if (object instanceof THREE.SpotLight) {
    return new THREE.SpotLightHelper(object);
  }

  if (object instanceof THREE.DirectionalLight) {
    return new THREE.DirectionalLightHelper(object, 1);
  }

  if (object instanceof THREE.HemisphereLight) {
    return new THREE.HemisphereLightHelper(object, 1);
  }

  if (object instanceof THREE.Camera) {
    return new THREE.CameraHelper(object);
  }

  return null;
}

function getSelectionTarget(object: THREE.Object3D) {
  let current: THREE.Object3D | null = object;

  while (current) {
    const selectTarget = current.userData.selectTarget as
      THREE.Object3D | undefined;

    if (selectTarget) {
      return selectTarget;
    }

    current = current.parent;
  }

  return object;
}

export function SelectableGroup({
  children,
  setSelectedObject
}: {
  children: ReactNode;
  setSelectedObject: (object: THREE.Object3D | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const helpersGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    const helpersGroup = helpersGroupRef.current;

    if (!group || !helpersGroup) return;

    const helpers: NonNullable<ReturnType<typeof createHelper>>[] = [];

    // Discover helper-compatible objects first.
    group.traverse((object) => {
      const helper = createHelper(object);

      if (!helper) return;

      // Clicking the helper should select the actual object.
      helper.userData.selectTarget = object;

      helpers.push(helper);
    });

    // Keep helpers in their own group, separate from scene content.
    for (const helper of helpers) {
      helpersGroup.add(helper);
    }

    return () => {
      for (const helper of helpers) {
        helpersGroup.remove(helper);
        helper.dispose();
      }
    };
  }, []);

  const onDoubleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();

      setSelectedObject(getSelectionTarget(event.object));
    },
    [setSelectedObject]
  );

  return (
    <>
      <group ref={groupRef} onDoubleClick={onDoubleClick}>
        {children}
      </group>

      <group ref={helpersGroupRef} onDoubleClick={onDoubleClick} />
    </>
  );
}
