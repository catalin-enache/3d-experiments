import SecondScenario from './scenario';
import { Canvas } from '@react-three/fiber';

export default function SecondPage() {
  return (
    <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
      <SecondScenario />
    </Canvas>
  );
}
