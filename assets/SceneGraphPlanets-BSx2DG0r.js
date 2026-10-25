import{g as e,o as t}from"./index-CcwAWkbw.js";import{n,r,t as i}from"./webgl-BFJtxVZL.js";import{t as a}from"./m3-PaD3hXb8.js";import{a as o,c as s,i as c,n as l,r as u}from"./m4-BcdbHlg4.js";import{f as d,p as f}from"./geometries-C08I9AYt.js";import{n as p,r as m,t as h}from"./TRS-BPqjtGLj.js";var g=10;function _(){let e=(e,t)=>{let n=new p(e);return n.setParent(t),n},t=e(new h,null),n=new h({scale:v(50)}),r=e(n,t),i=new h,a=e(i,t),o=e(new h({translation:[100,0,0]}),a),s=new h({scale:v(20)}),c=e(s,o),l=new h,u=e(l,o),d=new h({translation:[30,0,0],scale:v(.4*g)}),f=e(d,u);return{root:t,bodies:[{node:r,trs:n,colorMult:[.4,.4,0,1],colorOffset:[.6,.6,0,1]},{node:c,trs:s,colorMult:[.8,.5,.2,1],colorOffset:[.2,.5,.8,1]},{node:f,trs:d,colorMult:[.1,.1,.1,1],colorOffset:[.6,.6,.6,1]}],sunTRS:n,earthOrbitTRS:i,earthTRS:s,moonOrbitTRS:l,moonTRS:d}}function v(e){return[e,e,e]}var y=`#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}`,b=`#version 300 es
precision highp float;

in vec4 v_color;

uniform vec4 u_colorMult;
uniform vec4 u_colorOffset;

out vec4 outColor;

void main() {
  outColor = v_color * u_colorMult + u_colorOffset;
}`;async function x({container:e,webglContextAttributes:t}){let{gl:p,cleanUp:h}=n({container:e,webglContextAttributes:t}),g=await i({gl:p,vertexShaderSource:y,fragmentShaderSource:b}),v=p.getAttribLocation(g,`a_position`),x=p.getAttribLocation(g,`a_color`),S=p.getUniformLocation(g,`u_matrix`),C=p.getUniformLocation(g,`u_colorMult`),w=p.getUniformLocation(g,`u_colorOffset`),T=p.createVertexArray();p.bindVertexArray(T);let E=p.createBuffer();p.bindBuffer(p.ARRAY_BUFFER,E),p.bufferData(p.ARRAY_BUFFER,f,p.STATIC_DRAW),p.enableVertexAttribArray(v),p.vertexAttribPointer(v,3,p.FLOAT,!1,0,0);let D=p.createBuffer();p.bindBuffer(p.ARRAY_BUFFER,D);let O=m(d,6);p.bufferData(p.ARRAY_BUFFER,O,p.STATIC_DRAW),p.enableVertexAttribArray(x),p.vertexAttribPointer(x,4,p.UNSIGNED_BYTE,!0,0,0);let{root:k,bodies:A,sunTRS:j,earthOrbitTRS:M,earthTRS:N,moonOrbitTRS:P,moonTRS:F}=_(),I={earthOrbit:.6,moonOrbit:.6,sunSpin:.3,earthSpin:3,moonSpin:-.6},L={position:[0,-300,0],target:[0,0,0],up:[0,0,1]},R=a(60),z=l(),B=l();p.enable(p.CULL_FACE),p.enable(p.DEPTH_TEST),p.useProgram(g),p.bindVertexArray(T);function V({timer:e}){p.viewport(0,0,p.canvas.width,p.canvas.height),p.clearColor(0,0,0,0),p.clear(p.COLOR_BUFFER_BIT|p.DEPTH_BUFFER_BIT);let t=p.canvas.width/p.canvas.height,n=s(R,t,1,2e3),r=c(L.position,L.target,L.up),i=u(r);o(n,i,z);let a=e.getElapsed();M.rotation[1]=I.earthOrbit*a,P.rotation[1]=I.moonOrbit*a,j.rotation[1]=I.sunSpin*a,N.rotation[1]=I.earthSpin*a,F.rotation[1]=I.moonSpin*a,k.updateWorldMatrix();for(let{node:e,colorMult:t,colorOffset:n}of A)o(z,e.worldMatrix,B),p.uniformMatrix4fv(S,!1,B),p.uniform4fv(C,t),p.uniform4fv(w,n),p.drawArrays(p.TRIANGLES,0,d)}return r({tick:V,cleanUp:()=>{p.deleteBuffer(E),p.deleteBuffer(D),p.deleteVertexArray(T),p.deleteProgram(g),h()}})}var S=e();function C(){return(0,S.jsx)(t,{nativeScenario:x,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{C as default};