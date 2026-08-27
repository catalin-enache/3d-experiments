import * as THREE from "three";
import { useState, type ReactNode } from "react";
import {
  CameraControls,
  ObjectTransformControls,
  SelectableGroup,
  Inspector
} from "@components";

interface ScenarioProps {
  unselectableChildren?: ReactNode;
  selectableChildren?: ReactNode;
  useCameraControls?: boolean;
  useTransformControls?: boolean;
  useInspector?: boolean;
}

export const Scenario = ({
  unselectableChildren,
  selectableChildren,
  useCameraControls = true,
  useTransformControls = true,
  useInspector = true
}: ScenarioProps) => {
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(
    null
  );

  return (
    <>
      {useCameraControls && <CameraControls selectedObject={selectedObject} />}
      {useTransformControls && (
        <ObjectTransformControls selectedObject={selectedObject} />
      )}
      {useInspector && <Inspector object={selectedObject} />}
      <SelectableGroup setSelectedObject={setSelectedObject}>
        {selectableChildren}
      </SelectableGroup>
      <group>{unselectableChildren}</group>
    </>
  );
};
