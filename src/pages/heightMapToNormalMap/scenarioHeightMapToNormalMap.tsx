import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import GUI from 'lil-gui';
import { useTexture, OrbitControls } from '@react-three/drei';
import vertexShader from './glsl/vertex.glsl';
import fragmentShader from './glsl/fragment.glsl';

export function ScenarioHeightMapToNormalMap() {
  const { scene, camera } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color().setHex(0x000000);
    return () => {
      scene.background = null;
    };
  }, [scene]);

  useEffect(() => {
    camera.position.set(0, 0, 9);
    camera.rotation.set(0, 0, 0);
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = 65;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  const texture = useTexture(
    '/textures/pbr/castle_brick_02/castle_brick_02_red_4k_disp.jpg'
  );

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

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
    <>
      <OrbitControls makeDefault />
      <mesh position={[0, 0, 0]} name="mesh">
        <planeGeometry args={[10, 10, 1, 1]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          wireframe={false}
          side={THREE.DoubleSide}
          transparent={false}
          uniforms={{
            uHeightMap: { value: texture },
            uIntensity: { value: 2 },
            uOffset: { value: 0.3 }
          }}
        />
      </mesh>
    </>
  );
}

export default ScenarioHeightMapToNormalMap;
