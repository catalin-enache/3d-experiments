import * as THREE from "three";
import { Suspense, type ReactNode } from "react";
import { type CameraProps, Canvas } from "@react-three/fiber";
import { GizmoViewport, Stats, GizmoHelper } from "@react-three/drei";
import classes from "./Page.module.css";

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
  showStats?: boolean;
  showViewportGizmo?: boolean;
}

export const Page = ({
  children,
  background = new THREE.Color().setHex(0x000000),
  orthographic = false,
  cameraProps = !orthographic
    ? defaultPerspectiveCameraProps
    : defaultOrthographicCameraProps,
  raycasterParams = defaultRaycasterParams,
  showStats = true,
  showViewportGizmo = true
}: PageProps) => {
  return (
    <Canvas
      camera={cameraProps}
      orthographic={orthographic}
      shadows="percentage"
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
      {showStats && <Stats className={classes.stats} />}
      {showViewportGizmo && (
        <GizmoHelper alignment="bottom-left" margin={[60, 60]}>
          <GizmoViewport
            axisColors={["red", "green", "blue"]}
            labelColor="black"
          />
        </GizmoHelper>
      )}
      {/* covers loading assets stopping propagation to navigation suspense */}
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
};
