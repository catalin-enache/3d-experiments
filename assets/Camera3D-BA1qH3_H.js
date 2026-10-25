import{g as e,o as t,r as n}from"./index-CcwAWkbw.js";import{n as r,r as i,t as a}from"./webgl-BFJtxVZL.js";import{t as o}from"./m3-PaD3hXb8.js";import{a as s,c,i as l,p as u,r as d,y as f}from"./m4-BcdbHlg4.js";import{_ as p,b as m,y as h}from"./geometries-C08I9AYt.js";var g=`#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  
  gl_Position = u_matrix * a_position;

  
  v_color = a_color;
}`,_=`#version 300 es
precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
  outColor = v_color;
}`;function v(e){let t=new n({title:`Camera`});return t.addBinding(e,`cameraAngle`,{label:`angle`,min:-360,max:360,step:1}),t}async function y({container:e,webglContextAttributes:t}){let{gl:n,cleanUp:y}=r({container:e,webglContextAttributes:t}),b=await a({gl:n,vertexShaderSource:g,fragmentShaderSource:_}),x=n.getAttribLocation(b,`a_position`),S=n.getAttribLocation(b,`a_color`),C=n.getUniformLocation(b,`u_matrix`),w=n.createVertexArray();n.bindVertexArray(w);let T=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,T),h(n),n.enableVertexAttribArray(x),n.vertexAttribPointer(x,3,n.FLOAT,!1,0,0);let E=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,E),p(n),n.enableVertexAttribArray(S),n.vertexAttribPointer(S,3,n.UNSIGNED_BYTE,!0,0,0);let D={cameraAngle:0},O=v(D),k=[0,1,0],A=[200,0,0];n.enable(n.CULL_FACE),n.enable(n.DEPTH_TEST),n.useProgram(b),n.bindVertexArray(w);function j(){n.viewport(0,0,n.canvas.width,n.canvas.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT);let e=c(o(60),n.canvas.width/n.canvas.height,1,2e3),t=f(o(D.cameraAngle));t=u(t,0,50,300);let r=[t[12],t[13],t[14]];t=l(r,A,k);let i=d(t),a=s(e,i);for(let e=0;e<5;++e){let t=e*Math.PI*2/5,r=Math.cos(t)*200,i=Math.sin(t)*200,o=u(a,r,0,i);n.uniformMatrix4fv(C,!1,o),n.drawArrays(n.TRIANGLES,0,m)}}return i({tick:j,cleanUp:()=>{O.dispose(),y()}})}var b=e();function x(){return(0,b.jsx)(t,{nativeScenario:y,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{x as default};