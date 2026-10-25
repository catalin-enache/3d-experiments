import{g as e,o as t}from"./index-CcwAWkbw.js";import{t as n}from"./lil-gui.esm-BsdZdNnU.js";import{n as r,r as i,t as a}from"./webgl-BFJtxVZL.js";var o={normal:[0,0,0,0,1,0,0,0,0],gaussianBlur:[.045,.122,.045,.122,.332,.122,.045,.122,.045],gaussianBlur2:[1,2,1,2,4,2,1,2,1],gaussianBlur3:[0,1,0,1,1,1,0,1,0],unsharpen:[-1,-1,-1,-1,9,-1,-1,-1,-1],sharpness:[0,-1,0,-1,5,-1,0,-1,0],sharpen:[-1,-1,-1,-1,16,-1,-1,-1,-1],edgeDetect:[-.125,-.125,-.125,-.125,1,-.125,-.125,-.125,-.125],edgeDetect2:[-1,-1,-1,-1,8,-1,-1,-1,-1],edgeDetect3:[-5,0,0,0,0,0,0,0,5],edgeDetect4:[-1,-1,-1,0,0,0,1,1,1],edgeDetect5:[-1,-1,-1,2,2,2,-1,-1,-1],edgeDetect6:[-5,-5,-5,-5,39,-5,-5,-5,-5],sobelHorizontal:[1,2,1,0,0,0,-1,-2,-1],sobelVertical:[1,0,-1,2,0,-2,1,0,-1],previtHorizontal:[1,1,1,0,0,0,-1,-1,-1],previtVertical:[1,0,-1,1,0,-1,1,0,-1],boxBlur:[.111,.111,.111,.111,.111,.111,.111,.111,.111],triangleBlur:[.0625,.125,.0625,.125,.25,.125,.0625,.125,.0625],emboss:[-2,-1,0,-1,1,1,0,1,2]},s=[`normal`,`gaussianBlur2`,`gaussianBlur3`],c=Object.keys(o).map(e=>({name:e,on:s.includes(e)}));function l(e){let t=new n({title:`Image processing`}),r=t.addFolder(`Effects`);for(let t of e)r.add(t,`on`).name(t.name);return t}var u=`#version 300 es

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
}`,d=`#version 300 es

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
}`,f=`textures/leaves.jpg`;function p(e,t,n,r,i){let a=t,o=t+r,s=n,c=n+i;e.bufferData(e.ARRAY_BUFFER,new Float32Array([a,s,o,s,a,c,a,c,o,s,o,c]),e.STATIC_DRAW)}function m(e){let t=e.reduce(function(e,t){return e+t});return t<=0?1:t}var h=Object.fromEntries(Object.entries(o).map(([e,t])=>[e,m(t)]));function g(e){let t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),t}async function _({container:e,webglContextAttributes:t}){let{gl:n,cleanUp:s}=r({container:e,webglContextAttributes:t}),m=await new Promise((e,t)=>{let n=new Image;n.src=f,n.onload=()=>e(n),n.onerror=e=>t(e)}),_=await a({gl:n,vertexShaderSource:u,fragmentShaderSource:d}),v=n.getAttribLocation(_,`a_position`),y=n.getAttribLocation(_,`a_texCoord`),b=n.getUniformLocation(_,`u_resolution`),x=n.getUniformLocation(_,`u_image`),S=n.getUniformLocation(_,`u_kernel[0]`),C=n.getUniformLocation(_,`u_kernelWeight`),w=n.getUniformLocation(_,`u_flipY`);function T(e,t,r){n.bindFramebuffer(n.FRAMEBUFFER,e),n.uniform2f(b,t,r),n.viewport(0,0,t,r)}function E(e){n.uniform1fv(S,o[e]),n.uniform1f(C,h[e]),n.drawArrays(n.TRIANGLES,0,6)}let D=n.createVertexArray();n.bindVertexArray(D);let O=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,O),n.enableVertexAttribArray(v),n.vertexAttribPointer(v,2,n.FLOAT,!1,0,0),p(n,0,0,m.width,m.height);let k=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,k),n.bufferData(n.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),n.STATIC_DRAW),n.enableVertexAttribArray(y),n.vertexAttribPointer(y,2,n.FLOAT,!1,0,0),n.activeTexture(n.TEXTURE0+0);let A=g(n);n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,m);let j=[],M=[];for(let e=0;e<2;++e){let e=g(n);j.push(e);let t=n.RGBA,r=n.RGBA,i=n.UNSIGNED_BYTE;n.texImage2D(n.TEXTURE_2D,0,t,m.width,m.height,0,r,i,null);let a=n.createFramebuffer();M.push(a),n.bindFramebuffer(n.FRAMEBUFFER,a);let o=n.COLOR_ATTACHMENT0;n.framebufferTexture2D(n.FRAMEBUFFER,o,n.TEXTURE_2D,e,0)}let N=l(c);n.useProgram(_),n.bindVertexArray(D),n.uniform1i(x,0);function P(){n.bindTexture(n.TEXTURE_2D,A),n.uniform1f(w,1);let e=0;for(let t=0;t<c.length;++t)c[t].on&&(T(M[e%2],m.width,m.height),E(c[t].name),n.bindTexture(n.TEXTURE_2D,j[e%2]),++e);n.uniform1f(w,-1),T(null,n.canvas.width,n.canvas.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),E(`normal`)}return i({tick:P,cleanUp:()=>{N.destroy(),s()}})}var v=e();function y(){return(0,v.jsx)(t,{nativeScenario:_,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{y as default};