import GUI from "lil-gui";
import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop } from "@lib/utils/webgl";
import { kernels, effects, type KernelName } from "./kernels";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";

const imgSrc = "textures/leaves.jpg";

function setRectangle(
  gl: WebGL2RenderingContext,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}

function computeKernelWeight(kernel: number[]) {
  const weight = kernel.reduce(function (prev, curr) {
    return prev + curr;
  });
  return weight <= 0 ? 1 : weight;
}

const kernelWeights = Object.fromEntries(
  Object.entries(kernels).map(([name, kernel]) => [
    name,
    computeKernelWeight(kernel)
  ])
) as Record<KernelName, number>;

function createAndSetupTexture(gl: WebGL2RenderingContext) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set up texture so we can render any size image, and so we are
  // working with pixels.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return texture;
}

export async function ImageProcessing({
  container,
  webglContextAttributes
}: ScenarioParams) {
  const { gl, cleanUp } = init({ container, webglContextAttributes });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = imgSrc;
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
  });

  const program = await createProgram({
    gl,
    vertexShaderSource,
    fragmentShaderSource
  });

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const imageLocation = gl.getUniformLocation(program, "u_image");

  const kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
  const kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
  const flipYLocation = gl.getUniformLocation(program, "u_flipY");

  function setFramebuffer(
    fbo: WebGLFramebuffer | null,
    width: number,
    height: number
  ) {
    // make this the framebuffer we are rendering to.
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    // Tell the shader the resolution of the framebuffer.
    gl.uniform2f(resolutionLocation, width, height);
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, width, height);
  }

  function drawWithKernel(name: KernelName) {
    // set the kernel and it's weight
    gl.uniform1fv(kernelLocation, kernels[name]);
    gl.uniform1f(kernelWeightLocation, kernelWeights[name]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  setRectangle(gl, 0, 0, image.width, image.height);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0
    ]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(texCoordAttributeLocation);
  gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const textureUnit = 0;
  // make unit 0 the active texture uint
  // (ie, the unit all other texture commands will affect
  gl.activeTexture(gl.TEXTURE0 + textureUnit);
  // Create a texture and put the image in it.
  const originalImageTexture = createAndSetupTexture(gl);
  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // create 2 textures and attach them to framebuffers.
  const textures: WebGLTexture[] = [];
  const framebuffers: WebGLFramebuffer[] = [];
  for (let ii = 0; ii < 2; ++ii) {
    const texture = createAndSetupTexture(gl);
    textures.push(texture);

    // make the texture the same size as the image
    const mipLevel = 0; // the largest mip
    const internalFormat = gl.RGBA; // format we want in the texture
    const border = 0; // must be 0
    const srcFormat = gl.RGBA; // format of data we are supplying
    const srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
    const data = null; // no data = create a blank texture
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internalFormat,
      image.width,
      image.height,
      border,
      srcFormat,
      srcType,
      data
    );

    // Create a framebuffer
    const fbo = gl.createFramebuffer();
    framebuffers.push(fbo);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    // Attach a texture to it.
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      attachmentPoint,
      gl.TEXTURE_2D,
      texture,
      mipLevel
    );
  }

  const gui = new GUI({ title: "Image processing" });
  const effectsFolder = gui.addFolder("Effects");
  for (const effect of effects) {
    effectsFolder.add(effect, "on").name(effect.name);
  }

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  // Tell the shader to get the texture from texture unit 0
  gl.uniform1i(imageLocation, textureUnit);

  function tick() {
    gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);
    gl.uniform1f(flipYLocation, 1);

    let count = 0;
    for (let ii = 0; ii < effects.length; ++ii) {
      if (effects[ii].on) {
        // Setup to draw into one of the framebuffers (0, 1, 0, 1, ...).
        setFramebuffer(framebuffers[count % 2], image.width, image.height);
        drawWithKernel(effects[ii].name);
        // for the next draw, use the texture we just rendered to.
        gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);
        // increment count so we use the other texture next time.
        ++count;
      }
    }

    // finally draw the result to the canvas.
    gl.uniform1f(flipYLocation, -1); // need to y flip for canvas
    setFramebuffer(null, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawWithKernel("normal");
  }

  return loop({
    tick,
    cleanUp: () => {
      gui.destroy();
      cleanUp();
    }
  });
}
