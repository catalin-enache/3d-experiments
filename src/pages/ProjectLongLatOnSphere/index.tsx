import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ScenarioProjectLongLatOnSphere from './ScenarioProjectLongLatOnSphere.tsx';

export default function ProjectLongLatOnSpherePage() {
  return (
    <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
      <Suspense fallback={null}>
        <ScenarioProjectLongLatOnSphere />
      </Suspense>
    </Canvas>
  );
}
