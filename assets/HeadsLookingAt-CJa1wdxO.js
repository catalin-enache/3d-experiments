import{g as e,o as t,r as n}from"./index-C3o0UbHZ.js";import{n as r,r as i,t as a}from"./webgl-xLT4z7BO.js";import{t as o}from"./m3-PaD3hXb8.js";import{a as s,c,f as l,i as u,r as d}from"./m4-_xs1dbdM.js";import{f,m as p,p as m}from"./geometries-Dj7g7vzL.js";var h=`#version 300 es

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
}`;async function _({container:e,webglContextAttributes:t}){let{gl:_,cleanUp:v}=r({container:e,webglContextAttributes:t}),y=await a({gl:_,vertexShaderSource:h,fragmentShaderSource:g}),b=_.getAttribLocation(y,`a_position`),x=_.getAttribLocation(y,`a_color`),S=_.getUniformLocation(y,`u_matrix`),C=_.createVertexArray();_.bindVertexArray(C);let w=_.createBuffer();_.bindBuffer(_.ARRAY_BUFFER,w),f(_),_.enableVertexAttribArray(b),_.vertexAttribPointer(b,3,_.FLOAT,!1,0,0);let T=_.createBuffer();_.bindBuffer(_.ARRAY_BUFFER,T),m(_),_.enableVertexAttribArray(x),_.vertexAttribPointer(x,3,_.UNSIGNED_BYTE,!0,0,0);let E={targetAngle:0,targetHeight:200},D=new n({title:`Target`});D.addBinding(E,`targetAngle`,{label:`angle`,min:-360,max:360,step:1}),D.addBinding(E,`targetHeight`,{label:`height`,min:50,max:300,step:1});let O=[0,1,0],k=[500,300,500],A=[0,-100,0];_.enable(_.CULL_FACE),_.enable(_.DEPTH_TEST),_.useProgram(y),_.bindVertexArray(C);function j(e,t){_.uniformMatrix4fv(S,!1,s(t,e)),_.drawArrays(_.TRIANGLES,0,p)}function M(){_.viewport(0,0,_.canvas.width,_.canvas.height),_.clearColor(0,0,0,0),_.clear(_.COLOR_BUFFER_BIT|_.DEPTH_BUFFER_BIT);let e=c(o(60),_.canvas.width/_.canvas.height,1,2e3),t=u(k,A,O),n=d(t),r=s(e,n),i=o(E.targetAngle),a=[Math.sin(i)*300,E.targetHeight,Math.cos(i)*300];for(let e=0;e<5;++e){let t=(e/4-.5)*5*150;for(let e=0;e<5;++e){let n=(e/4-.5)*5*150;j(u([n,0,t],a,O),r)}}j(l(a[0],a[1],a[2]),r)}return i({tick:M,cleanUp:()=>{D.dispose(),v()}})}var v=e();function y(){return(0,v.jsx)(t,{nativeScenario:_,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{y as default};