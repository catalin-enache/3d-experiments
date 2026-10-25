import{g as e,o as t,r as n}from"./index-CcwAWkbw.js";import{n as r,r as i,t as a}from"./webgl-BFJtxVZL.js";import{t as o}from"./m3-PaD3hXb8.js";import{a as s,c,h as l,i as u,l as d,m as f,o as p,r as m,v as h}from"./m4-BcdbHlg4.js";import{b as g,d as _,f as v,u as y,v as b,y as x}from"./geometries-C08I9AYt.js";var S=`#version 300 es

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
}`;function w(e){let t=new n({title:`Lighting Directional`});t.addBinding(e,`rotation`,{min:-360,max:360,step:1});for(let n of[`scaleX`,`scaleY`,`scaleZ`])t.addBinding(e,n,{min:.1,max:3,step:.1});return t.addBinding(e,`inverseTranspose`,{label:`inverse transpose`}),t}async function T({container:e,webglContextAttributes:t}){let{gl:n,cleanUp:T}=r({container:e,webglContextAttributes:t}),E=await a({gl:n,vertexShaderSource:S,fragmentShaderSource:C}),D=n.getAttribLocation(E,`a_position`),O=n.getAttribLocation(E,`a_normal`),k=n.getUniformLocation(E,`u_worldViewProjection`),A=n.getUniformLocation(E,`u_worldInverseTranspose`),j=n.getUniformLocation(E,`u_color`),M=n.getUniformLocation(E,`u_reverseLightDirection`);function N(e,t){let r=n.createVertexArray();n.bindVertexArray(r);let i=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,i),e(n),n.enableVertexAttribArray(D),n.vertexAttribPointer(D,3,n.FLOAT,!1,0,0);let a=n.createBuffer();return n.bindBuffer(n.ARRAY_BUFFER,a),t(n),n.enableVertexAttribArray(O),n.vertexAttribPointer(O,3,n.FLOAT,!1,0,0),r}let P=[{vao:N(x,b),vertexCount:g,position:[-70,0,0],size:1,color:[.2,1,.2,1]},{vao:N(_,y),vertexCount:v,position:[80,0,0],size:60,color:[1,.6,.2,1]}],F={rotation:0,scaleX:1,scaleY:1,scaleZ:1,inverseTranspose:!0},I=w(F),L=[100,150,250],R=[0,0,0],z=[0,1,0],B=p([.5,.7,1]);n.enable(n.CULL_FACE),n.enable(n.DEPTH_TEST),n.useProgram(E);function V(){n.viewport(0,0,n.canvas.width,n.canvas.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT);let e=c(o(60),n.canvas.width/n.canvas.height,1,2e3),t=u(L,R,z),r=m(t),i=s(e,r);n.uniform3fv(M,B);for(let{vao:e,vertexCount:t,position:r,size:a,color:c}of P){let u=f(r[0],r[1],r[2]);u=h(u,o(F.rotation)),u=d(u,F.scaleX*a,F.scaleY*a,F.scaleZ*a);let p=s(i,u),g=F.inverseTranspose?l(m(u)):u;n.uniformMatrix4fv(k,!1,p),n.uniformMatrix4fv(A,!1,g),n.uniform4fv(j,c),n.bindVertexArray(e),n.drawArrays(n.TRIANGLES,0,t)}}return i({tick:V,cleanUp:()=>{I.dispose(),T()}})}var E=e();function D(){return(0,E.jsx)(t,{nativeScenario:T,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{D as default};