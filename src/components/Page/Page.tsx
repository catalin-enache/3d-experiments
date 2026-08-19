import * as THREE from "three";
import { Suspense, type ReactNode } from "react";
import { type CameraProps, Canvas } from "@react-three/fiber";

const defaultRaycasterParams = new THREE.Raycaster().params;
defaultRaycasterParams.Line.threshold = 0.1;

const defaultPerspectiveCameraProps: CameraProps = {
  fov: 75,
  position: [0, 0, 24],
  zoom: 1
};

const defaultOrthographicCameraProps: CameraProps = {
  position: [0, 0, 24],
  zoom: 25
};

interface PageProps {
  children?: ReactNode;
  background?: THREE.Color | THREE.Texture | null;
  orthographic?: boolean;
  cameraProps?: CameraProps;
  raycasterParams?: Partial<THREE.RaycasterParameters>;
}

export const Page = ({
  children,
  background = new THREE.Color().setHex(0x000000),
  orthographic = false,
  cameraProps = !orthographic
    ? defaultPerspectiveCameraProps
    : defaultOrthographicCameraProps,
  raycasterParams = defaultRaycasterParams
}: PageProps) => {
  return (
    <Canvas
      camera={cameraProps}
      orthographic={orthographic}
      scene={{
        background
      }}
      raycaster={{
        params: {
          ...defaultRaycasterParams,
          ...raycasterParams
        }
      }}
    >
      {/* covers loading assets stopping propagation to navigation suspense */}
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
};
