import * as THREE from 'three';
import { useState, type ReactNode } from 'react';
import {
  CameraControls,
  ObjectTransformControls,
  SelectableGroup,
  Inspector
} from '@components';

interface ScenarioProps {
  unselectableChildren?: ReactNode;
  selectableChildren?: ReactNode;
}

export const Scenario = ({
  unselectableChildren,
  selectableChildren
}: ScenarioProps) => {
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(
    null
  );

  return (
    <>
      <CameraControls selectedObject={selectedObject} />
      <ObjectTransformControls selectedObject={selectedObject} />
      <Inspector object={selectedObject} />
      <SelectableGroup setSelectedObject={setSelectedObject}>
        {selectableChildren}
      </SelectableGroup>
      <group>{unselectableChildren}</group>
    </>
  );
};
