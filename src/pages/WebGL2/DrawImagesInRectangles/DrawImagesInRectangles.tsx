import { Matrix4 } from "three";
import type { ScenarioParams } from "@appTypes";
import { createProgram, init, loop } from "@lib/utils/webgl";

import vertexShaderSource from "./glsl/vertex.glsl";
import fragmentShaderSource from "./glsl/fragment.glsl";

const imgSrcs = [
  "textures/star.jpg",
  "textures/leaves.jpg",
  "textures/keyboard.jpg"
];

const numToDraw = 9;
const speed = 60;

interface TextureInfo {
  width: number;
  height: number;
  texture: WebGLTexture;
}

interface DrawInfo {
  x: number;
  y: number;
  dx: number;
  dy: number;
  xScale: number;
  yScale: number;
  offX: number;
  offY: number;
  rotation: number;
  deltaRotation: number;
  width: number;
  height: number;
  textureInfo: TextureInfo;
}

// creates a texture info { width: w, height: h, texture: tex }
// The texture will start with 1x1 pixels and be updated
// when the image has loaded
function loadImageAndCreateTextureInfo(
  gl: WebGL2RenderingContext,
  url: string
) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255])
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const textureInfo: TextureInfo = {
    width: 1, // we don't know the size until it loads
    height: 1,
    texture
  };
  const image = new Image();
  image.onload = () => {
    textureInfo.width = image.width;
    textureInfo.height = image.height;

    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
  };
  image.src = url;

  return textureInfo;
}

export async function DrawImagesInRectangles({
  container,
  webglContextAttributes
}: ScenarioParams) {
  const { gl, cleanUp } = init({ container, webglContextAttributes });

  const program = await createProgram({
    gl,
    vertexShaderSource,
    fragmentShaderSource
  });

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  // UV
  const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");

  const matrixLocation = gl.getUniformLocation(program, "u_matrix");
  const textureLocation = gl.getUniformLocation(program, "u_texture");
  // this is multiplied with a_texcoord
  const textureMatrixLocation = gl.getUniformLocation(
    program,
    "u_textureMatrix"
  );

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Put a unit quad in the buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(texCoordAttributeLocation);
  gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const textureInfos = imgSrcs.map((url) =>
    loadImageAndCreateTextureInfo(gl, url)
  );

  const drawInfos: DrawInfo[] = [];
  for (let ii = 0; ii < numToDraw; ++ii) {
    const scale = Math.random() * 0.25 + 0.25;
    const drawInfo: DrawInfo = {
      x: Math.random() * gl.canvas.width,
      y: Math.random() * gl.canvas.height,
      dx: Math.random() > 0.5 ? -1 : 1,
      dy: Math.random() > 0.5 ? -1 : 1,
      xScale: scale,
      yScale: scale,
      offX: 0,
      offY: 0,
      rotation: Math.random() * Math.PI * 2,
      deltaRotation:
        (0.5 + Math.random() * 0.5) * (Math.random() > 0.5 ? -1 : 1),
      width: 1,
      height: 1,
      textureInfo: textureInfos[(Math.random() * textureInfos.length) | 0]
    };
    drawInfos.push(drawInfo);
  }

  const textureUnit = 0;

  // Unlike images, textures do not have a width and height associated
  // with them so we'll pass in the width and height of the texture
  function drawImage(
    texture: WebGLTexture,
    texWidth: number,
    texHeight: number,
    srcX: number,
    srcY: number,
    srcWidth: number = texWidth,
    srcHeight: number = texHeight,
    dstX?: number,
    dstY?: number,
    dstWidth?: number,
    dstHeight?: number,
    srcRotation = 0
  ) {
    if (dstX === undefined) {
      dstX = srcX;
      srcX = 0;
    }
    if (dstY === undefined) {
      dstY = srcY;
      srcY = 0;
    }
    if (dstWidth === undefined) {
      dstWidth = srcWidth;
      srcWidth = texWidth;
    }
    if (dstHeight === undefined) {
      dstHeight = srcHeight;
      srcHeight = texHeight;
    }

    gl.useProgram(program);
    gl.bindVertexArray(vao);

    // Tell the shader to get the texture from texture unit 0
    gl.uniform1i(textureLocation, textureUnit);
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // this matrix will convert from pixels to clip space
    const matrix = new Matrix4()
      .makeOrthographic(0, gl.canvas.width, 0, gl.canvas.height, -1, 1)
      // translate our quad to dstX, dstY
      .multiply(new Matrix4().makeTranslation(dstX, dstY, 0))
      // scale our 1 unit quad from 1 unit to dstWidth, dstHeight units
      .multiply(new Matrix4().makeScale(dstWidth, dstHeight, 1));

    gl.uniformMatrix4fv(matrixLocation, false, matrix.elements);

    // just like a 2d projection matrix except in texture space (0 to 1)
    // instead of clip space. This matrix puts us in pixel space.
    const texMatrix = new Matrix4()
      .makeScale(1 / texWidth, 1 / texHeight, 1)
      // We need to pick a place to rotate around
      // We'll move to the middle, rotate, then move back
      .multiply(
        new Matrix4().makeTranslation(texWidth * 0.5, texHeight * 0.5, 0)
      )
      .multiply(new Matrix4().makeRotationZ(srcRotation))
      .multiply(
        new Matrix4().makeTranslation(texWidth * -0.5, texHeight * -0.5, 0)
      )
      // because were in pixel space
      // the scale and translation are now in pixels
      .multiply(new Matrix4().makeTranslation(srcX, srcY, 0))
      .multiply(new Matrix4().makeScale(srcWidth, srcHeight, 1));

    gl.uniformMatrix4fv(textureMatrixLocation, false, texMatrix.elements);

    // draw the quad (2 triangles, 6 vertices)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function update(deltaTime: number) {
    for (const drawInfo of drawInfos) {
      drawInfo.x += drawInfo.dx * speed * deltaTime;
      drawInfo.y += drawInfo.dy * speed * deltaTime;
      if (drawInfo.x < 0) drawInfo.dx = 1;
      if (drawInfo.x >= gl.canvas.width) drawInfo.dx = -1;
      if (drawInfo.y < 0) drawInfo.dy = 1;
      if (drawInfo.y >= gl.canvas.height) drawInfo.dy = -1;
      drawInfo.rotation += drawInfo.deltaRotation * deltaTime;
    }
  }

  function draw() {
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (const { textureInfo, ...drawInfo } of drawInfos) {
      drawImage(
        textureInfo.texture,
        textureInfo.width,
        textureInfo.height,
        textureInfo.width * drawInfo.offX,
        textureInfo.height * drawInfo.offY,
        textureInfo.width * drawInfo.width,
        textureInfo.height * drawInfo.height,
        drawInfo.x,
        drawInfo.y,
        textureInfo.width * drawInfo.xScale,
        textureInfo.height * drawInfo.yScale,
        drawInfo.rotation
      );
    }
  }

  return loop({
    tick: ({ timer }) => {
      update(Math.min(0.1, timer.getDelta()));
      draw();
    },
    cleanUp
  });
}
