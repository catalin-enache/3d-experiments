import{g as e,o as t,r as n}from"./index-C3o0UbHZ.js";import{n as r,r as i,t as a}from"./webgl-xLT4z7BO.js";import{t as o}from"./m3-PaD3hXb8.js";import{a as s,c,f as l,g as u,i as d,l as f,m as p,o as m,p as h,r as g}from"./m4-_xs1dbdM.js";import{a as _,c as v,d as y,i as b,l as x,n as S,r as C,t as w,u as T}from"./geometries-Dj7g7vzL.js";function E(e,t,n){function r(r,i){let a=e.createVertexArray();e.bindVertexArray(a);let o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o),r(e),e.enableVertexAttribArray(t),e.vertexAttribPointer(t,3,e.FLOAT,!1,0,0);let s=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,s),i(e),e.enableVertexAttribArray(n),e.vertexAttribPointer(n,3,e.FLOAT,!1,0,0),a}return{cube:{vao:r(_,b),vertexCount:v},sphere:{vao:r(T,x),vertexCount:y},plane:{vao:r(S,w),vertexCount:C}}}var D=-80,O=140,k=180,A=10;function j({cube:e,sphere:t,plane:n}){return{outsideWorld:[{mesh:n,color:[.55,.55,.6,1],world:()=>f(p(l(0,D,0),o(-90)),1e3,1e3,1)},...[[-75,10,A,k],[75,10,A,k],[0,105,160,A]].map(([t,n,r,i])=>({mesh:e,color:[.45,.3,.2,1],world:()=>f(l(t,n,0),r,i,A)})),{mesh:e,color:[.9,.6,.2,1],world:()=>f(l(70,-60,90),40,40,40)},{mesh:t,color:[.9,.9,.9,1],world:()=>f(l(-30,-40,-220),40,40,40)}],insideWorld:[{mesh:t,color:[.2,.8,.4,1],world:e=>f(l(-30+Math.sin(e)*40,-30+Math.abs(Math.sin(e*2))*40,-120),35,35,35)},{mesh:e,color:[.9,.2,.5,1],world:e=>{let t=l(10,10,-200);return t=u(t,e*.6),t=p(t,e*.4),f(t,130,130,130)}}],portal:{mesh:n,color:[.1,.15,.35,1],world:f(l(0,10,0),O,k,1)}}}function M(e){let t=new n({title:`Stencil Portal`});t.addBinding(e,`useStencil`,{label:`use stencil`});let r=t.addBinding(e,`animateCamera`,{label:`animate camera`}),i=t.addBinding(e,`cameraAngle`,{label:`camera angle`,min:-180,max:180,step:1,disabled:e.animateCamera});return r.on(`change`,({value:e})=>{i.disabled=e}),t.addBinding(e,`cameraHeight`,{label:`camera height`,min:-60,max:300,step:1}),t}var N=`#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;

void main() {
  gl_Position = u_worldViewProjection * a_position;

  
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
}`,P=`#version 300 es
precision highp float;

in vec3 v_normal;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

uniform bool u_unlit;

out vec4 outColor;

void main() {
  if (u_unlit) {
    outColor = u_color;
    return;
  }

  vec3 normal = normalize(v_normal);

  
  
  float light = max(dot(normal, u_reverseLightDirection), 0.0);
  float ambient = 0.25;

  outColor = u_color;
  outColor.rgb *= ambient + (1.0 - ambient) * light;
}`;async function F({container:e,webglContextAttributes:t}){let{gl:n,cleanUp:l}=r({container:e,webglContextAttributes:t}),u=await a({gl:n,vertexShaderSource:N,fragmentShaderSource:P}),f=n.getAttribLocation(u,`a_position`),p=n.getAttribLocation(u,`a_normal`),_=n.getUniformLocation(u,`u_worldViewProjection`),v=n.getUniformLocation(u,`u_worldInverseTranspose`),y=n.getUniformLocation(u,`u_color`),b=n.getUniformLocation(u,`u_reverseLightDirection`),x=n.getUniformLocation(u,`u_unlit`),{outsideWorld:S,insideWorld:C,portal:w}=j(E(n,f,p)),T={useStencil:!0,cameraAngle:25,animateCamera:!0,cameraHeight:80},D=M(T),O=[0,-10,-60],k=[0,1,0],A=m([.5,.7,1]);n.enable(n.CULL_FACE),n.enable(n.DEPTH_TEST),n.useProgram(u);function F({mesh:e,color:t},r,i){n.uniformMatrix4fv(_,!1,s(i,r)),n.uniformMatrix4fv(v,!1,h(g(r))),n.uniform4fv(y,t),n.bindVertexArray(e.vao),n.drawArrays(n.TRIANGLES,0,e.vertexCount)}let I=0,L=0,R=!1;function z({timer:e}){let t=e.getElapsed();n.viewport(0,0,n.canvas.width,n.canvas.height),n.clearColor(0,0,0,0),n.clearStencil(0),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT|n.STENCIL_BUFFER_BIT),T.animateCamera?(I+=Math.min(.1,e.getDelta()),L=Math.sin(I*.3)*50):R&&(T.cameraAngle=Math.round(L),D.refresh()),R=T.animateCamera;let r=o(T.animateCamera?L:T.cameraAngle),i=[Math.sin(r)*420,T.cameraHeight,Math.cos(r)*420],a=c(o(60),n.canvas.width/n.canvas.height,1,3e3),l=g(d(i,O,k)),u=s(a,l);n.uniform3fv(b,A),n.uniform1i(x,0),n.disable(n.STENCIL_TEST);for(let e of S)F(e,e.world(t),u);T.useStencil&&(n.enable(n.STENCIL_TEST),n.stencilFunc(n.ALWAYS,1,255),n.stencilOp(n.KEEP,n.KEEP,n.REPLACE),n.colorMask(!1,!1,!1,!1),n.depthMask(!1),F(w,w.world,u),n.colorMask(!0,!0,!0,!0),n.depthMask(!0),n.stencilFunc(n.EQUAL,1,255),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.depthFunc(n.ALWAYS),n.depthRange(1,1),n.uniform1i(x,1),F(w,w.world,u),n.uniform1i(x,0),n.depthRange(0,1),n.depthFunc(n.LESS));for(let e of C)F(e,e.world(t),u);n.disable(n.STENCIL_TEST)}return i({tick:z,cleanUp:()=>{D.dispose(),l()}})}var I=e();function L(){return(0,I.jsx)(t,{nativeScenario:F,options:{webglContextAttributes:{preserveDrawingBuffer:!1,stencil:!0}}})}export{L as default};