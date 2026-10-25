import{g as e,o as t,r as n}from"./index-CcwAWkbw.js";import{n as r,r as i,t as a}from"./webgl-BFJtxVZL.js";import{t as o}from"./m3-PaD3hXb8.js";import{a as s,c,i as l,m as u,r as d}from"./m4-BcdbHlg4.js";import{g as f,h as p,m}from"./geometries-C08I9AYt.js";var h=`#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  
  gl_Position = u_matrix * a_position;

  
  v_color = a_color;
}`,g=`#version 300 es
precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
  outColor = v_color;
}`;function _(e){let t=new n({title:`Target`});return t.addBinding(e,`targetAngle`,{label:`angle`,min:-360,max:360,step:1}),t.addBinding(e,`targetHeight`,{label:`height`,min:50,max:300,step:1}),t}async function v({container:e,webglContextAttributes:t}){let{gl:n,cleanUp:v}=r({container:e,webglContextAttributes:t}),y=await a({gl:n,vertexShaderSource:h,fragmentShaderSource:g}),b=n.getAttribLocation(y,`a_position`),x=n.getAttribLocation(y,`a_color`),S=n.getUniformLocation(y,`u_matrix`),C=n.createVertexArray();n.bindVertexArray(C);let w=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,w),m(n),n.enableVertexAttribArray(b),n.vertexAttribPointer(b,3,n.FLOAT,!1,0,0);let T=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,T),p(n),n.enableVertexAttribArray(x),n.vertexAttribPointer(x,3,n.UNSIGNED_BYTE,!0,0,0);let E={targetAngle:0,targetHeight:200},D=_(E),O=[0,1,0],k=[500,300,500],A=[0,-100,0];n.enable(n.CULL_FACE),n.enable(n.DEPTH_TEST),n.useProgram(y),n.bindVertexArray(C);function j(e,t){n.uniformMatrix4fv(S,!1,s(t,e)),n.drawArrays(n.TRIANGLES,0,f)}function M(){n.viewport(0,0,n.canvas.width,n.canvas.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT);let e=c(o(60),n.canvas.width/n.canvas.height,1,2e3),t=l(k,A,O),r=d(t),i=s(e,r),a=o(E.targetAngle),f=[Math.sin(a)*300,E.targetHeight,Math.cos(a)*300];for(let e=0;e<5;++e){let t=(e/4-.5)*5*150;for(let e=0;e<5;++e){let n=(e/4-.5)*5*150;j(l([n,0,t],f,O),i)}}j(u(f[0],f[1],f[2]),i)}return i({tick:M,cleanUp:()=>{D.dispose(),v()}})}var y=e();function b(){return(0,y.jsx)(t,{nativeScenario:v,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{b as default};