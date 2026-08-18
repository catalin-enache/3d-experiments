import * as THREE from 'three';
import { useEffect, useRef, type ReactNode, useCallback } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { InspectorOnEvent, InspectorOffEvent } from '@src/constants/events.ts';

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

type Helper = NonNullable<ReturnType<typeof createHelper>>;

interface SelectableGroupProps {
  children: ReactNode;
  setSelectedObject: (object: THREE.Object3D | null) => void;
}

export function SelectableGroup({
  children,
  setSelectedObject
}: SelectableGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const helpersGroupRef = useRef<THREE.Group>(null);

  const helpersRef = useRef<Helper[]>([]);

  useEffect(() => {
    const group = groupRef.current;
    const helpersGroup = helpersGroupRef.current;

    if (!group || !helpersGroup) return;

    const helpers: Helper[] = [];

    // Scan the actual scenario objects.
    group.traverse((object) => {
      const helper = createHelper(object);

      if (!helper) return;

      // If the user clicks the helper, we want to select
      // the actual object that the helper represents.
      helper.userData.selectTarget = object;

      helpers.push(helper);
    });

    // Keep editor helpers outside the actual scene-content group.
    for (const helper of helpers) {
      helpersGroup.add(helper);
    }

    helpersRef.current = helpers;

    return () => {
      for (const helper of helpers) {
        helpersGroup.remove(helper);
        helper.dispose();
      }

      helpersRef.current = [];
    };
  }, []);

  useFrame(() => {
    for (const helper of helpersRef.current) {
      helper.update();
    }
  });

  const onDoubleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      window.dispatchEvent(InspectorOnEvent);

      setSelectedObject(getSelectionTarget(event.object));
    },
    [setSelectedObject]
  );

  const onPointerMissed = useCallback(
    (event: MouseEvent) => {
      if (event.detail === 2) {
        window.dispatchEvent(InspectorOffEvent);
        setSelectedObject(null);
      }
    },
    [setSelectedObject]
  );

  return (
    <group onPointerMissed={onPointerMissed}>
      <group ref={groupRef} onDoubleClick={onDoubleClick}>
        {children}
      </group>
      <group ref={helpersGroupRef} onDoubleClick={onDoubleClick} />
    </group>
  );
}
