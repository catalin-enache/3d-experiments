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
import { GizmoViewport, Stats, GizmoHelper } from "@react-three/drei";
import classes from "./Page.module.css";
import type { RendererParams } from "@appTypes";

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
  cameraProps?: Partial<CameraProps>;
  raycasterParams?: Partial<THREE.RaycasterParameters>;
  rendererParams?: RendererParams;
  showStats?: boolean;
  showViewportGizmo?: boolean;
  gridConfig?: {
    size?: number;
    divisions?: number;
    color1?: string;
    color2?: string;
    position?: [number, number, number];
  };
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
  gridConfig,
  axesSize = null
}: PageProps) => {
  const [showWidgets, setShowWidgets] = useState(
    !!gridConfig || axesSize !== null
  );

  const { useWebGpu, options } = _rendererParams;

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
      className={classes.page}
      gl={async (props) => {
        if (!useWebGpu) {
          const renderer = new THREE_WEBGL.WebGLRenderer({
            ...props,
            ...options
          });
          renderer.info.autoReset = false;
          return renderer;
        }
        const renderer = new THREE.WebGPURenderer({
          ...(props as THREE.WebGPURendererParameters),
          ...options
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
      {gridConfig && showWidgets && (
        <gridHelper
          args={[
            gridConfig.size ?? 10,
            gridConfig.divisions ?? 10,
            gridConfig.color1 ?? "#444444",
            gridConfig.color2 ?? "#222222"
          ]}
          position={gridConfig.position ?? [0, 0, 0]}
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
