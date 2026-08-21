import * as THREE from "three";
import {
  useEffect,
  useRef,
  type ReactNode,
  useCallback,
  useState
} from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { InspectorOn, InspectorOff } from "@src/constants/events.ts";

class CubeCameraHelper extends THREE.Group {
  private helpers: THREE.CameraHelper[] = [];

  constructor(camera: THREE.CubeCamera) {
    super();
    for (const child of camera.children) {
      if (child instanceof THREE.PerspectiveCamera) {
        const helper = new THREE.CameraHelper(child);
        helper.update();
        this.helpers.push(helper);
        this.add(helper);
      }
    }
  }

  update() {
    for (const helper of this.helpers) {
      helper.update();
    }
  }

  dispose() {
    for (const helper of this.helpers) {
      helper.dispose();
    }
  }
}

function createCubeCameraHelper(cubeCamera: THREE.CubeCamera) {
  const group = new CubeCameraHelper(cubeCamera);

  for (const child of cubeCamera.children) {
    if (child instanceof THREE.Camera) {
      group.add(new THREE.CameraHelper(child));
    }
  }

  return group;
}

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

  if (object instanceof THREE.CubeCamera) {
    return createCubeCameraHelper(object);
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
  const [group, setGroup] = useState<THREE.Group | null>(null);
  const [helpersGroup, setHelpersGroup] = useState<THREE.Group | null>(null);

  const [showHelpers, setShowHelpers] = useState(true);

  const helpersRef = useRef<Helper[]>([]);

  useEffect(() => {
    if (!showHelpers || !group || !helpersGroup) {
      return;
    }

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
  }, [group, helpersGroup, showHelpers]);

  useFrame(() => {
    for (const helper of helpersRef.current) {
      helper.update();
    }
  });

  const onDoubleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      window.dispatchEvent(InspectorOn);

      setSelectedObject(getSelectionTarget(event.object));
    },
    [setSelectedObject]
  );

  const onPointerMissed = useCallback(
    (event: MouseEvent) => {
      if (event.detail === 2) {
        window.dispatchEvent(InspectorOff);
        setSelectedObject(null);
      }
    },
    [setSelectedObject]
  );

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code === "KeyG") {
      setShowHelpers((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <group onPointerMissed={onPointerMissed}>
      <group ref={setGroup} onDoubleClick={onDoubleClick}>
        {children}
      </group>
      {showHelpers && (
        <group ref={setHelpersGroup} onDoubleClick={onDoubleClick} />
      )}
    </group>
  );
}
