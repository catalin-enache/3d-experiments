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

export function createShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string
) {
  const shader: WebGLShader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean;
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return undefined;
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program: WebGLProgram = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return undefined;
}
