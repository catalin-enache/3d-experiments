import{g as e,o as t}from"./index-C3o0UbHZ.js";import{t as n}from"./lil-gui.esm-BsdZdNnU.js";import{n as r,r as i,t as a}from"./webgl-xLT4z7BO.js";import{a as o,i as s,n as c,r as l,t as u}from"./m3-PaD3hXb8.js";var d=`#version 300 es

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
}`,f=`#version 300 es

precision highp float;

uniform vec4 u_color;
in vec4 v_color;

out vec4 outColor;

void main() {
  

  outColor = v_color;
}`;async function p({container:e,webglContextAttributes:t}){let{gl:p,cleanUp:m}=r({container:e,webglContextAttributes:t}),h=new Float32Array([0,-100,150,125,-175,100]),g=new Float32Array([-35,-35,35,-35,-35,35,-35,35,35,-35,35,35]),_=[Math.random(),Math.random(),Math.random(),1],v=[Math.random(),Math.random(),Math.random(),1],y=await a({gl:p,vertexShaderSource:d,fragmentShaderSource:f}),b=p.getAttribLocation(y,`a_position`),x=p.getAttribLocation(y,`a_color`),S=p.getUniformLocation(y,`u_resolution`),C=p.getUniformLocation(y,`u_matrix`),w=p.getUniformLocation(y,`u_color`),T=p.createBuffer(),E=p.createBuffer(),D=p.createVertexArray();p.bindVertexArray(D),p.enableVertexAttribArray(b),p.enableVertexAttribArray(x),p.bindBuffer(p.ARRAY_BUFFER,T),p.vertexAttribPointer(b,2,p.FLOAT,!1,0,0),p.bindBuffer(p.ARRAY_BUFFER,E),p.vertexAttribPointer(x,4,p.FLOAT,!1,0,0);let O={translationX:200,translationY:200,rotation:0,rotationSpeed:.75,scaleX:1,scaleY:1},k=new n({title:`Triangle transform`}),A=k.addFolder(`Translation`);A.add(O,`translationX`,-2e3,2e3,1).name(`x`),A.add(O,`translationY`,-2e3,2e3,1).name(`y`);let j=k.addFolder(`Rotation`);j.add(O,`rotation`,-360,360,1).name(`angle (deg)`),j.add(O,`rotationSpeed`,-5,5,.01).name(`speed`);let M=k.addFolder(`Scale`);M.add(O,`scaleX`,-5,5,.01).name(`x`),M.add(O,`scaleY`,-5,5,.01).name(`y`);function N({timer:e}){p.clearColor(0,0,0,0),p.clear(p.COLOR_BUFFER_BIT|p.DEPTH_BUFFER_BIT),p.useProgram(y),p.bindVertexArray(D),p.uniform2f(S,p.canvas.width,p.canvas.height);let t=e.getElapsed(),n=c(o(O.translationX,O.translationY),c(l(u(O.rotation)+t*O.rotationSpeed),s(O.scaleX,O.scaleY)));p.uniformMatrix3fv(C,!1,n),p.uniform4f(w,_[0],_[1],_[2],_[3]),p.bindBuffer(p.ARRAY_BUFFER,T),p.bufferData(p.ARRAY_BUFFER,h,p.STATIC_DRAW),p.bindBuffer(p.ARRAY_BUFFER,E),p.bufferData(p.ARRAY_BUFFER,new Float32Array([0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1]),p.STATIC_DRAW),p.drawArrays(p.TRIANGLES,0,3);let r=c(o(p.canvas.width/2,p.canvas.height/2),c(l(-t*.35),s(8,1)));p.uniformMatrix3fv(C,!1,r),p.uniform4f(w,v[0],v[1],v[2],v[3]),p.bindBuffer(p.ARRAY_BUFFER,T),p.bufferData(p.ARRAY_BUFFER,g,p.STATIC_DRAW),p.bindBuffer(p.ARRAY_BUFFER,E),p.bufferData(p.ARRAY_BUFFER,new Float32Array([0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1]),p.STATIC_DRAW),p.drawArrays(p.TRIANGLES,0,6)}return i({tick:N,cleanUp:()=>{k.destroy(),m()}})}var m=e();function h(){return(0,m.jsx)(t,{nativeScenario:p,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{h as default};