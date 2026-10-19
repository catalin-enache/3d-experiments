import{g as e,o as t,r as n}from"./index-C3o0UbHZ.js";import{n as r,r as i,t as a}from"./webgl-xLT4z7BO.js";import{t as o}from"./m3-PaD3hXb8.js";import{_ as s,a as c,c as l,d as u,i as d,r as f}from"./m4-_xs1dbdM.js";import{_ as p,h as m,v as h}from"./geometries-Dj7g7vzL.js";var g=`#version 300 es

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
}`;async function v({container:e,webglContextAttributes:t}){let{gl:v,cleanUp:y}=r({container:e,webglContextAttributes:t}),b=await a({gl:v,vertexShaderSource:g,fragmentShaderSource:_}),x=v.getAttribLocation(b,`a_position`),S=v.getAttribLocation(b,`a_color`),C=v.getUniformLocation(b,`u_matrix`),w=v.createVertexArray();v.bindVertexArray(w);let T=v.createBuffer();v.bindBuffer(v.ARRAY_BUFFER,T),p(v),v.enableVertexAttribArray(x),v.vertexAttribPointer(x,3,v.FLOAT,!1,0,0);let E=v.createBuffer();v.bindBuffer(v.ARRAY_BUFFER,E),m(v),v.enableVertexAttribArray(S),v.vertexAttribPointer(S,3,v.UNSIGNED_BYTE,!0,0,0);let D={cameraAngle:0},O=new n({title:`Camera`});O.addBinding(D,`cameraAngle`,{label:`angle`,min:-360,max:360,step:1});let k=[0,1,0],A=[200,0,0];v.enable(v.CULL_FACE),v.enable(v.DEPTH_TEST),v.useProgram(b),v.bindVertexArray(w);function j(){v.viewport(0,0,v.canvas.width,v.canvas.height),v.clearColor(0,0,0,0),v.clear(v.COLOR_BUFFER_BIT|v.DEPTH_BUFFER_BIT);let e=l(o(60),v.canvas.width/v.canvas.height,1,2e3),t=s(o(D.cameraAngle));t=u(t,0,50,300);let n=[t[12],t[13],t[14]];t=d(n,A,k);let r=f(t),i=c(e,r);for(let e=0;e<5;++e){let t=e*Math.PI*2/5,n=Math.cos(t)*200,r=Math.sin(t)*200,a=u(i,n,0,r);v.uniformMatrix4fv(C,!1,a),v.drawArrays(v.TRIANGLES,0,h)}}return i({tick:j,cleanUp:()=>{O.dispose(),y()}})}var y=e();function b(){return(0,y.jsx)(t,{nativeScenario:v,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{b as default};