import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

function Cube() {
  const cubeRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!cubeRef.current) return;

    cubeRef.current.rotation.x += 0.01;
    cubeRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
}

export default function SecondScenario() {
  return (
    <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
      <Cube />
    </Canvas>
  );
}
