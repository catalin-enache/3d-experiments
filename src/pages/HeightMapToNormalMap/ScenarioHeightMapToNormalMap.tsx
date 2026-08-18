import * as THREE from 'three';
import { useEffect, useRef, useMemo } from 'react';
import GUI from 'lil-gui';
import { useTexture } from '@react-three/drei';
import vertexShader from './glsl/vertex.glsl';
import fragmentShader from './glsl/fragment.glsl';
import { Scenario } from '@components';

export function ScenarioHeightMapToNormalMap() {
  const texture = useTexture(
    '/textures/pbr/castle_brick_02/castle_brick_02_red_4k_disp.jpg'
  );

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const uniforms = useMemo(
    () => ({
      uHeightMap: { value: texture },
      uIntensity: { value: 2 },
      uOffset: { value: 0.3 }
    }),
    [texture]
  );

  useEffect(() => {
    const gui = new GUI();

    gui
      .add(materialRef.current!.uniforms.uIntensity, 'value', 0, 10, 0.1)
      .name('Intensity');

    gui
      .add(materialRef.current!.uniforms.uOffset, 'value', -1, 1, 0.01)
      .name('Offset');

    return () => {
      gui.destroy();
    };
  }, [materialRef]);

  return (
    <Scenario
      selectableChildren={
        <>
          <pointLight position={[3, 4, 2]} intensity={10} />
          <spotLight position={[-3, 5, 2]} intensity={20} />
          <directionalLight position={[3, 5, 4]} intensity={3} />
          <mesh position={[0, 0, 0]} name="mesh">
            <planeGeometry args={[10, 10, 1, 1]} />
            <shaderMaterial
              ref={materialRef}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              wireframe={false}
              side={THREE.DoubleSide}
              transparent={false}
              uniforms={uniforms}
            />
          </mesh>
        </>
      }
    />
  );
}

export default ScenarioHeightMapToNormalMap;
