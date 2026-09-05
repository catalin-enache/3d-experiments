import * as THREE from "three/webgpu";
import * as THREE_WEBGL from "three";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

// @ts-ignore
window.glInfo = {
  render: {},
  memory: {}
};

/*
To be used with <Canvas frame="never">
This is a workaround for the fact that react-three-fiber is not using gl.setAnimationLoop
and ThreeJs Inspector complains in the context of WebGPURenderer.
* */

export function CustomAnimationLoop() {
  const gl = useThree((state) => state.gl) as
    THREE.WebGPURenderer | THREE_WEBGL.WebGLRenderer;
  const advance = useThree((state) => state.advance);

  useEffect(() => {
    void gl.setAnimationLoop((timestamp) => {
      gl.info.reset();

      advance(timestamp / 1000, true);

      /* eslint-disable */
      // @ts-ignore
      window.glInfo.render.calls = gl.info.render.calls;
      // @ts-ignore
      window.glInfo.render.frame = gl.info.render.frame;
      // @ts-ignore
      window.glInfo.render.frameCalls = gl.info.render.frameCalls;
      // @ts-ignore
      window.glInfo.render.drawCalls = gl.info.render.drawCalls;
      // @ts-ignore
      window.glInfo.render.lines = gl.info.render.lines;
      // @ts-ignore
      window.glInfo.render.points = gl.info.render.points;
      // @ts-ignore
      window.glInfo.render.triangles = gl.info.render.triangles;
      // @ts-ignore
      window.glInfo.memory.geometries = gl.info.memory.geometries;
      // @ts-ignore
      window.glInfo.memory.textures = gl.info.memory.textures;
      ["render", "memory"].forEach((key1) => {
        // @ts-ignore
        Object.keys(window.glInfo[key1]).forEach((key2) => {
          // @ts-ignore
          if (window.glInfo[key1][key2] === undefined) {
            // @ts-ignore
            delete window.glInfo[key1][key2];
          }
        });
      });
      /* eslint-enable */
    });

    return () => {
      void gl.setAnimationLoop(null);
    };
  }, [gl, advance]);

  return null;
}
