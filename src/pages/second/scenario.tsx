import * as THREE from 'three';
import GUI from 'lil-gui';
import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { projectLongLatOnSphere } from 'lib/math/projectLongLatOnSphere';

const radius = 10;

const initialDirection = {
  x: 0,
  y: 1.6
};

export function ProjectLongLatOnSphere() {
  const [direction, setDirection] = useState(() =>
    projectLongLatOnSphere({
      ...initialDirection,
      r: radius
    })
  );

  const { scene, camera } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color(0x000000);

    return () => {
      scene.background = null;
    };
  }, [scene]);

  useEffect(() => {
    camera.position.set(0, 0, 22);
    camera.rotation.set(0, 0, 0);

    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = 30;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  const guiValues = useRef({
    longitude: initialDirection.x,
    latitude: initialDirection.y
  });

  useEffect(() => {
    const gui = new GUI();

    const updateDirection = () => {
      setDirection(
        projectLongLatOnSphere({
          x: guiValues.current.longitude,
          y: guiValues.current.latitude,
          r: radius
        })
      );
    };

    gui
      .add(guiValues.current, 'longitude', 0, 2 * Math.PI)
      .name('Longitude')
      .onChange(updateDirection);

    gui
      .add(guiValues.current, 'latitude', 0, Math.PI)
      .name('Latitude')
      .onChange(updateDirection);

    return () => {
      gui.destroy();
    };
  }, []);

  return (
    <>
      <OrbitControls makeDefault />
      <group name="lights group">
        <ambientLight color="#ffffff" intensity={3.5} position={[0, 1, 0]} />
      </group>

      <mesh name="sphere">
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color="#ffffff" wireframe />
      </mesh>

      <mesh position={direction} name="projection">
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
    </>
  );
}

export default ProjectLongLatOnSphere;
