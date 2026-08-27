import * as THREE from "three";
import {
  Suspense,
  type ReactNode,
  useState,
  useCallback,
  useEffect
} from "react";
import { type CameraProps, Canvas } from "@react-three/fiber";
import { GizmoViewport, Stats, GizmoHelper, Grid } from "@react-three/drei";
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
  showGrid?: boolean;
  axesSize?: number | null;
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
  showViewportGizmo = true,
  showGrid = false,
  axesSize = null
}: PageProps) => {
  const [showWidgets, setShowWidgets] = useState(showGrid || axesSize !== null);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code === "KeyG") {
      setShowWidgets((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

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
      {axesSize !== null && showWidgets && <axesHelper args={[axesSize]} />}
      {showGrid && showWidgets && (
        <Grid
          args={[10, 10]}
          cellSize={1}
          cellThickness={1}
          sectionSize={5}
          sectionThickness={1}
          infiniteGrid
          fadeDistance={300}
          fadeStrength={1}
        />
      )}
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
