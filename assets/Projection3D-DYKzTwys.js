import{g as e,o as t,r as n}from"./index-CcwAWkbw.js";import{n as r,r as i,t as a}from"./webgl-BFJtxVZL.js";import{t as o}from"./m3-PaD3hXb8.js";import{b as s,c,g as l,l as u,p as d,s as f,v as p}from"./m4-BcdbHlg4.js";import{_ as m,b as h,y as g}from"./geometries-C08I9AYt.js";var _=`#version 300 es

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
}`;function y(e,{width:t,height:r,depth:i}){let a=new n({title:`Transform`});return a.addBinding(e,`projection`,{options:{Perspective:`perspective`,Orthographic:`orthographic`}}),a.addBinding(e,`translation`,{x:{min:-t/2,max:t/2,step:1},y:{min:-r/2,max:r/2,step:1},z:{min:-i,max:i,step:1}}),a.addBinding(e,`rotation`,{x:{min:-360,max:360,step:1},y:{min:-360,max:360,step:1},z:{min:-360,max:360,step:1}}),a.addBinding(e,`scale`,{x:{min:-5,max:5,step:.01},y:{min:-5,max:5,step:.01},z:{min:-5,max:5,step:.01}}),a}async function b({container:e,webglContextAttributes:t}){let{gl:n,cleanUp:b}=r({container:e,webglContextAttributes:t}),x=await a({gl:n,vertexShaderSource:_,fragmentShaderSource:v}),S=n.getAttribLocation(x,`a_position`),C=n.getAttribLocation(x,`a_color`),w=n.getUniformLocation(x,`u_matrix`),T=n.createVertexArray();n.bindVertexArray(T);let E=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,E),g(n),n.enableVertexAttribArray(S),n.vertexAttribPointer(S,3,n.FLOAT,!1,0,0);let D=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,D),m(n),n.enableVertexAttribArray(C),n.vertexAttribPointer(C,3,n.UNSIGNED_BYTE,!0,0,0);let O={projection:`orthographic`,translation:{x:0,y:0,z:-950},rotation:{x:40,y:25,z:325},scale:{x:1,y:1,z:1}},k=2e3,A=y(O,{width:n.canvas.width,height:n.canvas.height,depth:k});n.enable(n.CULL_FACE),n.enable(n.DEPTH_TEST),n.useProgram(x),n.bindVertexArray(T);function j(){n.viewport(0,0,n.canvas.width,n.canvas.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT);let{projection:e,translation:t,rotation:r,scale:i}=O,a=e===`orthographic`?f(-n.canvas.width/2,n.canvas.width/2,-n.canvas.height/2,n.canvas.height/2,-2e3,k):c(o(60),n.canvas.width/n.canvas.height,1,2e3);a=d(a,t.x,t.y,t.z),a=l(a,o(r.x)),a=p(a,o(r.y)),a=s(a,o(r.z)),a=u(a,i.x,i.y,i.z),n.uniformMatrix4fv(w,!1,a),n.drawArrays(n.TRIANGLES,0,h)}return i({tick:j,cleanUp:()=>{A.dispose(),b()}})}var x=e();function S(){return(0,x.jsx)(t,{nativeScenario:b,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{S as default};