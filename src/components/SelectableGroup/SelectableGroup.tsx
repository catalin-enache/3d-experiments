import * as THREE from "three/webgpu";
import {
  useEffect,
  useRef,
  type ReactNode,
  useCallback,
  useState
} from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { type Helper, createHelper, getSelectionTarget } from "./utils";

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
      if (object.parent instanceof THREE.CubeCamera) return;

      if (object.userData.noHelper) return;

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

      setSelectedObject(getSelectionTarget(event.object));
    },
    [setSelectedObject]
  );

  const onPointerMissed = useCallback(
    (event: MouseEvent) => {
      if (event.detail === 2) {
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
