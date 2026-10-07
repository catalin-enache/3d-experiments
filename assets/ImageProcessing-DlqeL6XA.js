import{g as e,o as t}from"./index-Bpj6U8h9.js";import{t as n}from"./lil-gui.esm-BsdZdNnU.js";import{n as r,r as i,t as a}from"./webgl-BqFU4dtE.js";var o={normal:[0,0,0,0,1,0,0,0,0],gaussianBlur:[.045,.122,.045,.122,.332,.122,.045,.122,.045],gaussianBlur2:[1,2,1,2,4,2,1,2,1],gaussianBlur3:[0,1,0,1,1,1,0,1,0],unsharpen:[-1,-1,-1,-1,9,-1,-1,-1,-1],sharpness:[0,-1,0,-1,5,-1,0,-1,0],sharpen:[-1,-1,-1,-1,16,-1,-1,-1,-1],edgeDetect:[-.125,-.125,-.125,-.125,1,-.125,-.125,-.125,-.125],edgeDetect2:[-1,-1,-1,-1,8,-1,-1,-1,-1],edgeDetect3:[-5,0,0,0,0,0,0,0,5],edgeDetect4:[-1,-1,-1,0,0,0,1,1,1],edgeDetect5:[-1,-1,-1,2,2,2,-1,-1,-1],edgeDetect6:[-5,-5,-5,-5,39,-5,-5,-5,-5],sobelHorizontal:[1,2,1,0,0,0,-1,-2,-1],sobelVertical:[1,0,-1,2,0,-2,1,0,-1],previtHorizontal:[1,1,1,0,0,0,-1,-1,-1],previtVertical:[1,0,-1,1,0,-1,1,0,-1],boxBlur:[.111,.111,.111,.111,.111,.111,.111,.111,.111],triangleBlur:[.0625,.125,.0625,.125,.25,.125,.0625,.125,.0625],emboss:[-2,-1,0,-1,1,1,0,1,2]},s=[`normal`,`gaussianBlur2`,`gaussianBlur3`],c=Object.keys(o).map(e=>({name:e,on:s.includes(e)})),l=`#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform vec2 u_resolution;
uniform float u_flipY;

out vec2 v_texCoord;

void main() {

  
  vec2 zeroToOne = a_position / u_resolution;

  
  vec2 zeroToTwo = zeroToOne * 2.0;

  
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);

  
  
  v_texCoord = a_texCoord;
}`,u=`#version 300 es

precision highp float;

uniform sampler2D u_image;

uniform float u_kernel[9];
uniform float u_kernelWeight;

in vec2 v_texCoord;

out vec4 outColor;

void main() {
  

  vec2 onePixel = vec2(1) / vec2(textureSize(u_image, 0));

  vec4 colorSum =
    texture(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
    texture(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
    texture(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
    texture(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
    texture(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
    texture(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
    texture(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
    texture(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
    texture(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
  outColor = vec4((colorSum / u_kernelWeight).rgb, 1);
}`,d=`textures/leaves.jpg`;function f(e,t,n,r,i){let a=t,o=t+r,s=n,c=n+i;e.bufferData(e.ARRAY_BUFFER,new Float32Array([a,s,o,s,a,c,a,c,o,s,o,c]),e.STATIC_DRAW)}function p(e){let t=e.reduce(function(e,t){return e+t});return t<=0?1:t}var m=Object.fromEntries(Object.entries(o).map(([e,t])=>[e,p(t)]));function h(e){let t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),t}async function g({container:e,webglContextAttributes:t}){let{gl:s,cleanUp:p}=r({container:e,webglContextAttributes:t}),g=await new Promise((e,t)=>{let n=new Image;n.src=d,n.onload=()=>e(n),n.onerror=e=>t(e)}),_=await a({gl:s,vertexShaderSource:l,fragmentShaderSource:u}),v=s.getAttribLocation(_,`a_position`),y=s.getAttribLocation(_,`a_texCoord`),b=s.getUniformLocation(_,`u_resolution`),x=s.getUniformLocation(_,`u_image`),S=s.getUniformLocation(_,`u_kernel[0]`),C=s.getUniformLocation(_,`u_kernelWeight`),w=s.getUniformLocation(_,`u_flipY`);function T(e,t,n){s.bindFramebuffer(s.FRAMEBUFFER,e),s.uniform2f(b,t,n),s.viewport(0,0,t,n)}function E(e){s.uniform1fv(S,o[e]),s.uniform1f(C,m[e]),s.drawArrays(s.TRIANGLES,0,6)}let D=s.createVertexArray();s.bindVertexArray(D);let O=s.createBuffer();s.bindBuffer(s.ARRAY_BUFFER,O),s.enableVertexAttribArray(v),s.vertexAttribPointer(v,2,s.FLOAT,!1,0,0),f(s,0,0,g.width,g.height);let k=s.createBuffer();s.bindBuffer(s.ARRAY_BUFFER,k),s.bufferData(s.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),s.STATIC_DRAW),s.enableVertexAttribArray(y),s.vertexAttribPointer(y,2,s.FLOAT,!1,0,0),s.activeTexture(s.TEXTURE0+0);let A=h(s);s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,g);let j=[],M=[];for(let e=0;e<2;++e){let e=h(s);j.push(e);let t=s.RGBA,n=s.RGBA,r=s.UNSIGNED_BYTE;s.texImage2D(s.TEXTURE_2D,0,t,g.width,g.height,0,n,r,null);let i=s.createFramebuffer();M.push(i),s.bindFramebuffer(s.FRAMEBUFFER,i);let a=s.COLOR_ATTACHMENT0;s.framebufferTexture2D(s.FRAMEBUFFER,a,s.TEXTURE_2D,e,0)}let N=new n({title:`Image processing`}),P=N.addFolder(`Effects`);for(let e of c)P.add(e,`on`).name(e.name);s.useProgram(_),s.bindVertexArray(D),s.uniform1i(x,0);function F(){s.bindTexture(s.TEXTURE_2D,A),s.uniform1f(w,1);let e=0;for(let t=0;t<c.length;++t)c[t].on&&(T(M[e%2],g.width,g.height),E(c[t].name),s.bindTexture(s.TEXTURE_2D,j[e%2]),++e);s.uniform1f(w,-1),T(null,s.canvas.width,s.canvas.height),s.clearColor(0,0,0,0),s.clear(s.COLOR_BUFFER_BIT|s.DEPTH_BUFFER_BIT),E(`normal`)}return i({tick:F,cleanUp:()=>{N.destroy(),p()}})}var _=e();function v(){return(0,_.jsx)(t,{nativeScenario:g,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{v as default};