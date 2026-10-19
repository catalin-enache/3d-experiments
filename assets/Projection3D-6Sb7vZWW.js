import{g as e,o as t,r as n}from"./index-7pWkORit.js";import{n as r,r as i,t as a}from"./webgl-DB6cWIQO.js";import{t as o}from"./m3-PaD3hXb8.js";import{c as s,d as c,g as l,l as u,m as d,s as f,v as p}from"./m4-_xs1dbdM.js";import{_ as m,h,v as g}from"./geometries-Dj7g7vzL.js";var _=`#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  
  gl_Position = u_matrix * a_position;

  
  v_color = a_color;
}`,v=`#version 300 es
precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
  outColor = v_color;
}`;async function y({container:e,webglContextAttributes:t}){let{gl:y,cleanUp:b}=r({container:e,webglContextAttributes:t}),x=await a({gl:y,vertexShaderSource:_,fragmentShaderSource:v}),S=y.getAttribLocation(x,`a_position`),C=y.getAttribLocation(x,`a_color`),w=y.getUniformLocation(x,`u_matrix`),T=y.createVertexArray();y.bindVertexArray(T);let E=y.createBuffer();y.bindBuffer(y.ARRAY_BUFFER,E),m(y),y.enableVertexAttribArray(S),y.vertexAttribPointer(S,3,y.FLOAT,!1,0,0);let D=y.createBuffer();y.bindBuffer(y.ARRAY_BUFFER,D),h(y),y.enableVertexAttribArray(C),y.vertexAttribPointer(C,3,y.UNSIGNED_BYTE,!0,0,0);let O={projection:`orthographic`,translation:{x:0,y:0,z:-950},rotation:{x:40,y:25,z:325},scale:{x:1,y:1,z:1}},k=2e3,A=new n({title:`Transform`});A.addBinding(O,`projection`,{options:{Perspective:`perspective`,Orthographic:`orthographic`}}),A.addBinding(O,`translation`,{x:{min:-y.canvas.width/2,max:y.canvas.width/2,step:1},y:{min:-y.canvas.height/2,max:y.canvas.height/2,step:1},z:{min:-2e3,max:k,step:1}}),A.addBinding(O,`rotation`,{x:{min:-360,max:360,step:1},y:{min:-360,max:360,step:1},z:{min:-360,max:360,step:1}}),A.addBinding(O,`scale`,{x:{min:-5,max:5,step:.01},y:{min:-5,max:5,step:.01},z:{min:-5,max:5,step:.01}}),y.enable(y.CULL_FACE),y.enable(y.DEPTH_TEST),y.useProgram(x),y.bindVertexArray(T);function j(){y.viewport(0,0,y.canvas.width,y.canvas.height),y.clearColor(0,0,0,0),y.clear(y.COLOR_BUFFER_BIT|y.DEPTH_BUFFER_BIT);let{projection:e,translation:t,rotation:n,scale:r}=O,i=e===`orthographic`?f(-y.canvas.width/2,y.canvas.width/2,-y.canvas.height/2,y.canvas.height/2,-2e3,k):s(o(60),y.canvas.width/y.canvas.height,1,2e3);i=c(i,t.x,t.y,t.z),i=d(i,o(n.x)),i=l(i,o(n.y)),i=p(i,o(n.z)),i=u(i,r.x,r.y,r.z),y.uniformMatrix4fv(w,!1,i),y.drawArrays(y.TRIANGLES,0,g)}return i({tick:j,cleanUp:()=>{A.dispose(),b()}})}var b=e();function x(){return(0,b.jsx)(t,{nativeScenario:y,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{x as default};