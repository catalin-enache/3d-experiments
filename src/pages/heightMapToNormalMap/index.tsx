import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ScenarioHeightMapToNormalMap from './scenarioHeightMapToNormalMap.tsx';

export default function HeightMapToNormalMapPage() {
  return (
    <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
      <Suspense fallback={null}>
        <ScenarioHeightMapToNormalMap />
      </Suspense>
    </Canvas>
  );
}
