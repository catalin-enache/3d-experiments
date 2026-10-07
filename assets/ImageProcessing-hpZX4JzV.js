import{g as e,o as t}from"./index-F2ZCrQCg.js";import{n,r,t as i}from"./webgl-iFUhkRdr.js";var a=`#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform vec2 u_resolution;

out vec2 v_texCoord;

void main() {

  
  vec2 zeroToOne = a_position / u_resolution;

  
  vec2 zeroToTwo = zeroToOne * 2.0;

  
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  
  
  v_texCoord = a_texCoord;
}`,o=`#version 300 es

precision highp float;

uniform sampler2D u_image;

in vec2 v_texCoord;

out vec4 outColor;

void main() {
  outColor = texture(u_image, v_texCoord);
}`,s=`textures/leaves.jpg`;function c(e,t,n,r,i){let a=t,o=t+r,s=n,c=n+i;e.bufferData(e.ARRAY_BUFFER,new Float32Array([a,s,o,s,a,c,a,c,o,s,o,c]),e.STATIC_DRAW)}async function l({container:e,webglContextAttributes:t}){let{gl:l,cleanUp:u}=n({container:e,webglContextAttributes:t}),d=await new Promise((e,t)=>{let n=new Image;n.src=s,n.onload=()=>e(n),n.onerror=e=>t(e)}),f=await i({gl:l,vertexShaderSource:a,fragmentShaderSource:o}),p=l.getAttribLocation(f,`a_position`),m=l.getAttribLocation(f,`a_texCoord`),h=l.getUniformLocation(f,`u_resolution`),g=l.getUniformLocation(f,`u_image`),_=l.createVertexArray();l.bindVertexArray(_);let v=l.createBuffer();l.enableVertexAttribArray(p),l.bindBuffer(l.ARRAY_BUFFER,v),l.vertexAttribPointer(p,2,l.FLOAT,!1,0,0);let y=l.createBuffer();l.bindBuffer(l.ARRAY_BUFFER,y),l.bufferData(l.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),l.STATIC_DRAW),l.enableVertexAttribArray(m),l.vertexAttribPointer(m,2,l.FLOAT,!1,0,0);let b=l.createTexture();l.activeTexture(l.TEXTURE0+0),l.bindTexture(l.TEXTURE_2D,b),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.NEAREST),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MAG_FILTER,l.NEAREST),l.texImage2D(l.TEXTURE_2D,0,l.RGBA,l.RGBA,l.UNSIGNED_BYTE,d);function x(){l.clearColor(0,0,0,0),l.clear(l.COLOR_BUFFER_BIT|l.DEPTH_BUFFER_BIT),l.useProgram(f),l.bindVertexArray(_),l.uniform2f(h,l.canvas.width,l.canvas.height),l.uniform1i(g,0),l.bindBuffer(l.ARRAY_BUFFER,v),c(l,0,0,l.canvas.width,l.canvas.height),l.drawArrays(l.TRIANGLES,0,6)}return r({tick:x,cleanUp:()=>{u()}})}var u=e();function d(){return(0,u.jsx)(t,{nativeScenario:l,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{d as default};