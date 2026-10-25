import{g as e,o as t}from"./index-CcwAWkbw.js";import{t as n}from"./lil-gui.esm-BsdZdNnU.js";import{n as r,r as i,t as a}from"./webgl-BFJtxVZL.js";import{a as o,i as s,n as c,r as l,t as u}from"./m3-PaD3hXb8.js";function d(e){let t=new n({title:`Triangle transform`}),r=t.addFolder(`Translation`);r.add(e,`translationX`,-2e3,2e3,1).name(`x`),r.add(e,`translationY`,-2e3,2e3,1).name(`y`);let i=t.addFolder(`Rotation`);i.add(e,`rotation`,-360,360,1).name(`angle (deg)`),i.add(e,`rotationSpeed`,-5,5,.01).name(`speed`);let a=t.addFolder(`Scale`);return a.add(e,`scaleX`,-5,5,.01).name(`x`),a.add(e,`scaleY`,-5,5,.01).name(`y`),t}var f=`#version 300 es

in vec2 a_position;
in vec4 a_color;
uniform vec2 u_resolution;
uniform mat3 u_matrix;
out vec4 v_color;

void main() {
  vec2 position = (u_matrix * vec3(a_position, 1.0)).xy;

  
  
  
  vec2 clipSpace = ((position / u_resolution) * 2.0 - 1.0) * vec2(1, -1);

  gl_Position = vec4(clipSpace, 0.0, 1.0);
  
  v_color = a_color;
}`,p=`#version 300 es

precision highp float;

uniform vec4 u_color;
in vec4 v_color;

out vec4 outColor;

void main() {
  

  outColor = v_color;
}`;async function m({container:e,webglContextAttributes:t}){let{gl:n,cleanUp:m}=r({container:e,webglContextAttributes:t}),h=new Float32Array([0,-100,150,125,-175,100]),g=new Float32Array([-35,-35,35,-35,-35,35,-35,35,35,-35,35,35]),_=[Math.random(),Math.random(),Math.random(),1],v=[Math.random(),Math.random(),Math.random(),1],y=await a({gl:n,vertexShaderSource:f,fragmentShaderSource:p}),b=n.getAttribLocation(y,`a_position`),x=n.getAttribLocation(y,`a_color`),S=n.getUniformLocation(y,`u_resolution`),C=n.getUniformLocation(y,`u_matrix`),w=n.getUniformLocation(y,`u_color`),T=n.createBuffer(),E=n.createBuffer(),D=n.createVertexArray();n.bindVertexArray(D),n.enableVertexAttribArray(b),n.enableVertexAttribArray(x),n.bindBuffer(n.ARRAY_BUFFER,T),n.vertexAttribPointer(b,2,n.FLOAT,!1,0,0),n.bindBuffer(n.ARRAY_BUFFER,E),n.vertexAttribPointer(x,4,n.FLOAT,!1,0,0);let O={translationX:200,translationY:200,rotation:0,rotationSpeed:.75,scaleX:1,scaleY:1},k=d(O);function A({timer:e}){n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),n.useProgram(y),n.bindVertexArray(D),n.uniform2f(S,n.canvas.width,n.canvas.height);let t=e.getElapsed(),r=c(o(O.translationX,O.translationY),c(l(u(O.rotation)+t*O.rotationSpeed),s(O.scaleX,O.scaleY)));n.uniformMatrix3fv(C,!1,r),n.uniform4f(w,_[0],_[1],_[2],_[3]),n.bindBuffer(n.ARRAY_BUFFER,T),n.bufferData(n.ARRAY_BUFFER,h,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,E),n.bufferData(n.ARRAY_BUFFER,new Float32Array([0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1]),n.STATIC_DRAW),n.drawArrays(n.TRIANGLES,0,3);let i=c(o(n.canvas.width/2,n.canvas.height/2),c(l(-t*.35),s(8,1)));n.uniformMatrix3fv(C,!1,i),n.uniform4f(w,v[0],v[1],v[2],v[3]),n.bindBuffer(n.ARRAY_BUFFER,T),n.bufferData(n.ARRAY_BUFFER,g,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,E),n.bufferData(n.ARRAY_BUFFER,new Float32Array([0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1]),n.STATIC_DRAW),n.drawArrays(n.TRIANGLES,0,6)}return i({tick:A,cleanUp:()=>{k.destroy(),m()}})}var h=e();function g(){return(0,h.jsx)(t,{nativeScenario:m,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{g as default};