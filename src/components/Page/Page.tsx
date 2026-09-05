import * as THREE from "three/webgpu";
import * as THREE_WEBGL from "three";
import { Inspector as ThreeInspector } from "three/addons/inspector/Inspector.js";
import {
  Suspense,
  type ReactNode,
  useState,
  useCallback,
  useEffect
} from "react";
import { CustomAnimationLoop } from "@components";
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

interface WebGLParams {
  useWebGpu?: false;
  rendererParams?: Partial<THREE_WEBGL.WebGLRendererParameters>;
}

interface WebGPUParams {
  useWebGpu: true;
  rendererParams?: Partial<THREE.WebGPURendererParameters>;
}

type RendererParams = WebGLParams | WebGPUParams;

interface PageProps {
  children?: ReactNode;
  background?: THREE.Color | THREE.Texture | null;
  orthographic?: boolean;
  cameraProps?: Partial<CameraProps>;
  raycasterParams?: Partial<THREE.RaycasterParameters>;
  rendererParams?: RendererParams;
  showStats?: boolean;
  showViewportGizmo?: boolean;
  showGrid?: boolean;
  axesSize?: number | null;
}

export const Page = ({
  children,
  background = new THREE.Color().setHex(0x000000),
  orthographic = false,
  cameraProps = {},
  raycasterParams = defaultRaycasterParams,
  rendererParams: _rendererParams = {},
  showStats = true,
  showViewportGizmo = true,
  showGrid = false,
  axesSize = null
}: PageProps) => {
  const [showWidgets, setShowWidgets] = useState(showGrid || axesSize !== null);
  const { useWebGpu, rendererParams } = _rendererParams;

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
      frameloop="never"
      gl={async (props) => {
        if (!useWebGpu) {
          const renderer = new THREE_WEBGL.WebGLRenderer({
            ...props,
            ...rendererParams
          });
          renderer.info.autoReset = false;
          return renderer;
        }
        const renderer = new THREE.WebGPURenderer({
          ...(props as THREE.WebGPURendererParameters),
          ...rendererParams
        });
        renderer.info.autoReset = false;
        renderer.inspector = new ThreeInspector();

        /* eslint-disable */
        // patch for <GizmoViewport>, capabilities were moved on backend
        // @ts-ignore
        renderer.capabilities = renderer.backend.capabilities;
        /* eslint-enable */

        await renderer.init();
        return renderer;
      }}

      camera={
        {
          ...(!orthographic
            ? defaultPerspectiveCameraProps
            : defaultOrthographicCameraProps),
          ...cameraProps
        } as CameraProps
      }
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
      <CustomAnimationLoop />
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
