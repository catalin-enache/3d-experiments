import { Timer } from "three";
import type { ScenarioParams } from "@appTypes";
export type { Timer };

export function resizeCanvasToDisplaySize({
  gl,
  container
}: {
  gl: WebGL2RenderingContext;
  container: HTMLElement;
}) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth = container.clientWidth;
  const displayHeight = container.clientHeight;

  // Check if the canvas is not the same size.
  const needResize =
    gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    gl.canvas.width = displayWidth;
    gl.canvas.height = displayHeight;
  }

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  return needResize;
}

export const handleResize =
  ({ gl, container }: { gl: WebGL2RenderingContext; container: HTMLElement }) =>
  () => {
    resizeCanvasToDisplaySize({
      gl,
      container
    });
  };

export function init({ container, webglContextAttributes }: ScenarioParams) {
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const gl: WebGL2RenderingContext = canvas.getContext(
    "webgl2",
    webglContextAttributes
  )!;

  const handleResizeCallback = handleResize({ gl, container });

  handleResizeCallback();

  window.addEventListener("resize", handleResizeCallback);

  const cleanUp = () => {
    window.removeEventListener("resize", handleResizeCallback);
    container.removeChild(canvas);
  };

  return { gl, cleanUp };
}

export function loop({
  tick,
  cleanUp
}: {
  tick: ({ timer }: { timer: Timer }) => void;
  cleanUp?: () => void;
}) {
  const timer = new Timer();
  timer.connect(document);

  let rafId = 0;

  function render() {
    timer.update();
    tick({ timer });

    rafId = requestAnimationFrame(render);
  }

  rafId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(rafId);
    timer.dispose();
    if (cleanUp) cleanUp();
  };
}

export async function createShader({
  gl,
  type,
  source,
  link
}: {
  gl: WebGL2RenderingContext;
  type: GLenum;
  source?: string;
  link?: string;
}) {
  const shader: WebGLShader = gl.createShader(type)!;
  if (source) {
    gl.shaderSource(shader, source);
  } else if (link) {
    // Load the shader source from the link
    await fetch(link)
      .then((response) => response.text())
      .then((source) => {
        gl.shaderSource(shader, source);
      });
  } else {
    throw new Error("Either source or link must be provided");
  }
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean;
  if (!success) {
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error(
      "Failed to compile shader" +
        (type === gl.VERTEX_SHADER ? "VERTEX_SHADER" : "FRAGMENT_SHADER") +
        ":\n" +
        (source ?? link ?? "")
    );
  }

  return shader;
}

export async function createProgram({
  gl,
  vertexShader,
  fragmentShader,
  vertexShaderSource,
  fragmentShaderSource,
  vertexShaderLink,
  fragmentShaderLink
}: {
  gl: WebGL2RenderingContext;
  vertexShader?: WebGLShader;
  fragmentShader?: WebGLShader;
  vertexShaderSource?: string;
  fragmentShaderSource?: string;
  vertexShaderLink?: string;
  fragmentShaderLink?: string;
}) {
  const program: WebGLProgram = gl.createProgram();
  let _vertexShader: WebGLShader | undefined;
  let _fragmentShader: WebGLShader | undefined;
  if (vertexShader) {
    _vertexShader = vertexShader;
    gl.attachShader(program, vertexShader);
  } else if (vertexShaderSource || vertexShaderLink) {
    const vertexShader = await createShader({
      gl,
      type: gl.VERTEX_SHADER,
      source: vertexShaderSource,
      link: vertexShaderLink
    });
    _vertexShader = vertexShader;
    gl.attachShader(program, vertexShader);
  }

  if (fragmentShader) {
    _fragmentShader = fragmentShader;
    gl.attachShader(program, fragmentShader);
  } else if (fragmentShaderSource || fragmentShaderLink) {
    const fragmentShader = await createShader({
      gl,
      type: gl.FRAGMENT_SHADER,
      source: fragmentShaderSource,
      link: fragmentShaderLink
    });
    _fragmentShader = fragmentShader;
    gl.attachShader(program, fragmentShader);
  }

  gl.linkProgram(program);

  if (_vertexShader) gl.deleteShader(_vertexShader);
  if (_fragmentShader) gl.deleteShader(_fragmentShader);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;
  if (!success) {
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    throw new Error("Failed to link program");
  }

  return program;
}
