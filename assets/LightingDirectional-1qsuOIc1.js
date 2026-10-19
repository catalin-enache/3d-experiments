import{g as e,o as t,r as n}from"./index-7pWkORit.js";import{n as r,r as i,t as a}from"./webgl-DB6cWIQO.js";import{t as o}from"./m3-PaD3hXb8.js";import{a as s,c,f as l,g as u,i as d,l as f,o as p,p as m,r as h}from"./m4-_xs1dbdM.js";import{_ as g,d as _,g as v,l as y,u as b,v as x}from"./geometries-Dj7g7vzL.js";var S=`#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;

void main() {
  
  gl_Position = u_worldViewProjection * a_position;

  
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
}`,C=`#version 300 es
precision highp float;

in vec3 v_normal;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

out vec4 outColor;

void main() {
  
  
  
  vec3 normal = normalize(v_normal);

  
  
  
  float light = max(dot(normal, u_reverseLightDirection), 0.0);

  outColor = u_color;

  
  outColor.rgb *= light;
}`;async function w({container:e,webglContextAttributes:t}){let{gl:w,cleanUp:T}=r({container:e,webglContextAttributes:t}),E=await a({gl:w,vertexShaderSource:S,fragmentShaderSource:C}),D=w.getAttribLocation(E,`a_position`),O=w.getAttribLocation(E,`a_normal`),k=w.getUniformLocation(E,`u_worldViewProjection`),A=w.getUniformLocation(E,`u_worldInverseTranspose`),j=w.getUniformLocation(E,`u_color`),M=w.getUniformLocation(E,`u_reverseLightDirection`);function N(e,t){let n=w.createVertexArray();w.bindVertexArray(n);let r=w.createBuffer();w.bindBuffer(w.ARRAY_BUFFER,r),e(w),w.enableVertexAttribArray(D),w.vertexAttribPointer(D,3,w.FLOAT,!1,0,0);let i=w.createBuffer();return w.bindBuffer(w.ARRAY_BUFFER,i),t(w),w.enableVertexAttribArray(O),w.vertexAttribPointer(O,3,w.FLOAT,!1,0,0),n}let P=[{vao:N(g,v),vertexCount:x,position:[-70,0,0],size:1,color:[.2,1,.2,1]},{vao:N(b,y),vertexCount:_,position:[80,0,0],size:60,color:[1,.6,.2,1]}],F={rotation:0,scaleX:1,scaleY:1,scaleZ:1,inverseTranspose:!0},I=new n({title:`Lighting Directional`});I.addBinding(F,`rotation`,{min:-360,max:360,step:1});for(let e of[`scaleX`,`scaleY`,`scaleZ`])I.addBinding(F,e,{min:.1,max:3,step:.1});I.addBinding(F,`inverseTranspose`,{label:`inverse transpose`});let L=[100,150,250],R=[0,0,0],z=[0,1,0],B=p([.5,.7,1]);w.enable(w.CULL_FACE),w.enable(w.DEPTH_TEST),w.useProgram(E);function V(){w.viewport(0,0,w.canvas.width,w.canvas.height),w.clearColor(0,0,0,0),w.clear(w.COLOR_BUFFER_BIT|w.DEPTH_BUFFER_BIT);let e=c(o(60),w.canvas.width/w.canvas.height,1,2e3),t=d(L,R,z),n=h(t),r=s(e,n);w.uniform3fv(M,B);for(let{vao:e,vertexCount:t,position:n,size:i,color:a}of P){let c=l(n[0],n[1],n[2]);c=u(c,o(F.rotation)),c=f(c,F.scaleX*i,F.scaleY*i,F.scaleZ*i);let d=s(r,c),p=F.inverseTranspose?m(h(c)):c;w.uniformMatrix4fv(k,!1,d),w.uniformMatrix4fv(A,!1,p),w.uniform4fv(j,a),w.bindVertexArray(e),w.drawArrays(w.TRIANGLES,0,t)}}return i({tick:V,cleanUp:()=>{I.dispose(),T()}})}var T=e();function E(){return(0,T.jsx)(t,{nativeScenario:w,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{E as default};