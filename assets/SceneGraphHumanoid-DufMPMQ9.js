import{g as e,o as t}from"./index-CcwAWkbw.js";import{n,r,t as i}from"./webgl-BFJtxVZL.js";import{t as a}from"./m3-PaD3hXb8.js";import{a as o,c as s,i as c,n as l,r as u}from"./m4-BcdbHlg4.js";import{c as d,l as f}from"./geometries-C08I9AYt.js";import{n as p,r as m,t as h}from"./TRS-BPqjtGLj.js";var g={name:`point between feet`,draw:!1,children:[{name:`waist`,translation:[0,3,0],children:[{name:`torso`,translation:[0,2,0],children:[{name:`neck`,translation:[0,1,0],children:[{name:`head`,translation:[0,1,0]}]},{name:`left-arm`,translation:[-1,0,0],children:[{name:`left-forearm`,translation:[-1,0,0],children:[{name:`left-hand`,translation:[-1,0,0]}]}]},{name:`right-arm`,translation:[1,0,0],children:[{name:`right-forearm`,translation:[1,0,0],children:[{name:`right-hand`,translation:[1,0,0]}]}]}]},{name:`left-leg`,translation:[-1,-1,0],children:[{name:`left-calf`,translation:[0,-1,0],children:[{name:`left-foot`,translation:[0,-1,0]}]}]},{name:`right-leg`,translation:[1,-1,0],children:[{name:`right-calf`,translation:[0,-1,0],children:[{name:`right-foot`,translation:[0,-1,0]}]}]}]}]};function _(){let e={};function t({name:n,translation:r,draw:i=!0,children:a=[]},o){let s=new h({translation:r&&[...r]}),c=new p(s);c.setParent(o),e[n]={node:c,trs:s,draw:i};for(let e of a)t(e,c);return c}return{root:t(g,null),parts:e,drawnParts:Object.values(e).filter(({draw:e})=>e)}}var v=`#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}`,y=`#version 300 es
precision highp float;

in vec4 v_color;

uniform vec4 u_colorMult;
uniform vec4 u_colorOffset;

out vec4 outColor;

void main() {
  outColor = v_color * u_colorMult + u_colorOffset;
}`;async function b({container:e,webglContextAttributes:t}){let{gl:p,cleanUp:h}=n({container:e,webglContextAttributes:t}),g=await i({gl:p,vertexShaderSource:v,fragmentShaderSource:y}),b=p.getAttribLocation(g,`a_position`),S=p.getAttribLocation(g,`a_color`),C=p.getUniformLocation(g,`u_matrix`),w=p.getUniformLocation(g,`u_colorMult`),T=p.getUniformLocation(g,`u_colorOffset`),E=p.createVertexArray();p.bindVertexArray(E);let D=p.createBuffer();p.bindBuffer(p.ARRAY_BUFFER,D),p.bufferData(p.ARRAY_BUFFER,f,p.STATIC_DRAW),p.enableVertexAttribArray(b),p.vertexAttribPointer(b,3,p.FLOAT,!1,0,0);let O=p.createBuffer();p.bindBuffer(p.ARRAY_BUFFER,O);let k=m(d,6);p.bufferData(p.ARRAY_BUFFER,k,p.STATIC_DRAW),p.enableVertexAttribArray(S),p.vertexAttribPointer(S,4,p.UNSIGNED_BYTE,!0,0,0);let{root:A,parts:j,drawnParts:M}=_(),N={position:[4,3.5,10],target:[0,3.5,0],up:[0,1,0]},P=a(60),F=l(),I=l();p.enable(p.CULL_FACE),p.enable(p.DEPTH_TEST),p.useProgram(g),p.bindVertexArray(E),p.uniform4fv(w,[.4,.4,.4,1]),p.uniform4fv(T,[0,0,.6,0]);function L({timer:e}){p.viewport(0,0,p.canvas.width,p.canvas.height),p.clearColor(0,0,0,0),p.clear(p.COLOR_BUFFER_BIT|p.DEPTH_BUFFER_BIT);let t=p.canvas.width/p.canvas.height,n=s(P,t,1,200),r=c(N.position,N.target,N.up),i=u(r);o(n,i,F),x(j,e.getElapsed()),A.updateWorldMatrix();for(let{node:e}of M)o(F,e.worldMatrix,I),p.uniformMatrix4fv(C,!1,I),p.drawArrays(p.TRIANGLES,0,d)}return r({tick:L,cleanUp:()=>{p.deleteBuffer(D),p.deleteBuffer(O),p.deleteVertexArray(E),p.deleteProgram(g),h()}})}function x(e,t){let n=t*3,r=t=>e[t].trs.rotation;e[`point between feet`].trs.translation[1]=Math.abs(Math.sin(n)),r(`left-leg`)[0]=Math.sin(n),r(`right-leg`)[0]=-Math.sin(n),r(`left-calf`)[0]=-Math.sin(n+.1)*.4,r(`right-calf`)[0]=Math.sin(n+.1)*.4,r(`left-foot`)[0]=-Math.sin(n+.1)*.4,r(`right-foot`)[0]=Math.sin(n+.1)*.4,r(`left-arm`)[2]=Math.sin(n)*.4,r(`right-arm`)[2]=Math.sin(n)*.4,r(`left-forearm`)[2]=Math.sin(n+.1)*.4,r(`right-forearm`)[2]=Math.sin(n+.1)*.4,r(`left-hand`)[2]=Math.sin(n-.1)*.4,r(`right-hand`)[2]=Math.sin(n-.1)*.4,r(`waist`)[1]=Math.sin(n)*.4,r(`torso`)[1]=Math.sin(n)*.4,r(`neck`)[1]=Math.sin(n+.25)*.4,r(`head`)[1]=Math.sin(n+.5)*.4,r(`head`)[0]=Math.cos(n*2)*.4}var S=e();function C(){return(0,S.jsx)(t,{nativeScenario:b,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{C as default};