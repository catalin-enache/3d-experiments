import * as THREE from 'three';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ScenarioHeightMapToNormalMap from './ScenarioHeightMapToNormalMap.tsx';
const defaultRaycasterParams = new THREE.Raycaster().params;
export default function HeightMapToNormalMapPage() {
  return (
    <Canvas
      camera={{ fov: 75, position: [0, 0, 5] }}
      raycaster={{
        params: {
          ...defaultRaycasterParams,
          Line: {
            ...defaultRaycasterParams.Line,
            threshold: 0.1
          }
        }
      }}
    >
      <Suspense fallback={null}>
        <ScenarioHeightMapToNormalMap />
      </Suspense>
    </Canvas>
  );
}
