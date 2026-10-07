import{g as e,o as t}from"./index-F2ZCrQCg.js";import{t as n}from"./lil-gui.esm-BsdZdNnU.js";import{n as r,r as i,t as a}from"./webgl-iFUhkRdr.js";var o=Float32Array;function s(e,t,n){n??=new o(9);let r=e[0],i=e[1],a=e[2],s=e[3],c=e[4],l=e[5],u=e[6],d=e[7],f=e[8],p=t[0],m=t[1],h=t[2],g=t[3],_=t[4],v=t[5],y=t[6],b=t[7],x=t[8];return n[0]=p*r+m*s+h*u,n[1]=p*i+m*c+h*d,n[2]=p*a+m*l+h*f,n[3]=g*r+_*s+v*u,n[4]=g*i+_*c+v*d,n[5]=g*a+_*l+v*f,n[6]=y*r+b*s+x*u,n[7]=y*i+b*c+x*d,n[8]=y*a+b*l+x*f,n}function c(e,t,n){return n??=new o(9),n[0]=1,n[1]=0,n[2]=0,n[3]=0,n[4]=1,n[5]=0,n[6]=e,n[7]=t,n[8]=1,n}function l(e,t){let n=Math.cos(e),r=Math.sin(e);return t??=new o(9),t[0]=n,t[1]=-r,t[2]=0,t[3]=r,t[4]=n,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function u(e,t,n){return n??=new o(9),n[0]=e,n[1]=0,n[2]=0,n[3]=0,n[4]=t,n[5]=0,n[6]=0,n[7]=0,n[8]=1,n}function d(e){return e*Math.PI/180}var f=`#version 300 es

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
}`;async function m({container:e,webglContextAttributes:t}){let{gl:o,cleanUp:m}=r({container:e,webglContextAttributes:t}),h=new Float32Array([0,-100,150,125,-175,100]),g=new Float32Array([-35,-35,35,-35,-35,35,-35,35,35,-35,35,35]),_=[Math.random(),Math.random(),Math.random(),1],v=[Math.random(),Math.random(),Math.random(),1],y=await a({gl:o,vertexShaderSource:f,fragmentShaderSource:p}),b=o.getAttribLocation(y,`a_position`),x=o.getAttribLocation(y,`a_color`),S=o.getUniformLocation(y,`u_resolution`),C=o.getUniformLocation(y,`u_matrix`),w=o.getUniformLocation(y,`u_color`),T=o.createBuffer(),E=o.createBuffer(),D=o.createVertexArray();o.bindVertexArray(D),o.enableVertexAttribArray(b),o.enableVertexAttribArray(x),o.bindBuffer(o.ARRAY_BUFFER,T),o.vertexAttribPointer(b,2,o.FLOAT,!1,0,0),o.bindBuffer(o.ARRAY_BUFFER,E),o.vertexAttribPointer(x,4,o.FLOAT,!1,0,0);let O={translationX:200,translationY:200,rotation:0,rotationSpeed:.75,scaleX:1,scaleY:1},k=new n({title:`Triangle transform`}),A=k.addFolder(`Translation`);A.add(O,`translationX`,-2e3,2e3,1).name(`x`),A.add(O,`translationY`,-2e3,2e3,1).name(`y`);let j=k.addFolder(`Rotation`);j.add(O,`rotation`,-360,360,1).name(`angle (deg)`),j.add(O,`rotationSpeed`,-5,5,.01).name(`speed`);let M=k.addFolder(`Scale`);M.add(O,`scaleX`,-5,5,.01).name(`x`),M.add(O,`scaleY`,-5,5,.01).name(`y`);function N({timer:e}){o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),o.useProgram(y),o.bindVertexArray(D),o.uniform2f(S,o.canvas.width,o.canvas.height);let t=e.getElapsed(),n=s(c(O.translationX,O.translationY),s(l(d(O.rotation)+t*O.rotationSpeed),u(O.scaleX,O.scaleY)));o.uniformMatrix3fv(C,!1,n),o.uniform4f(w,_[0],_[1],_[2],_[3]),o.bindBuffer(o.ARRAY_BUFFER,T),o.bufferData(o.ARRAY_BUFFER,h,o.STATIC_DRAW),o.bindBuffer(o.ARRAY_BUFFER,E),o.bufferData(o.ARRAY_BUFFER,new Float32Array([0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1]),o.STATIC_DRAW),o.drawArrays(o.TRIANGLES,0,3);let r=s(c(o.canvas.width/2,o.canvas.height/2),s(l(-t*.35),u(8,1)));o.uniformMatrix3fv(C,!1,r),o.uniform4f(w,v[0],v[1],v[2],v[3]),o.bindBuffer(o.ARRAY_BUFFER,T),o.bufferData(o.ARRAY_BUFFER,g,o.STATIC_DRAW),o.bindBuffer(o.ARRAY_BUFFER,E),o.bufferData(o.ARRAY_BUFFER,new Float32Array([0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1]),o.STATIC_DRAW),o.drawArrays(o.TRIANGLES,0,6)}return i({tick:N,cleanUp:()=>{k.destroy(),m()}})}var h=e();function g(){return(0,h.jsx)(t,{nativeScenario:m,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{g as default};