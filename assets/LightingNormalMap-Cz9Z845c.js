import{g as e,o as t,r as n}from"./index-CcwAWkbw.js";import{n as r,r as i,t as a}from"./webgl-BFJtxVZL.js";import{t as o}from"./m3-PaD3hXb8.js";import{_ as s,a as c,c as l,h as u,i as d,l as f,r as p,v as m}from"./m4-BcdbHlg4.js";import{a as h,c as g,i as _,o as v,s as y}from"./geometries-C08I9AYt.js";var b=`#version 300 es

in vec4 a_position;
in vec3 a_normal;

in vec4 a_tangent;
in vec2 a_texcoord;

uniform mat4 u_worldViewProjection;
uniform mat4 u_world;

uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;
out vec4 v_tangent;
out vec2 v_texcoord;

void main() {
  gl_Position = u_worldViewProjection * a_position;

  
  
  
  
  
  
  v_normal = mat3(u_worldInverseTranspose) * a_normal; 
  v_tangent = vec4(mat3(u_world) * a_tangent.xyz, a_tangent.w); 
  v_texcoord = a_texcoord;
}`,x=`#version 300 es
precision highp float;

in vec3 v_normal;
in vec4 v_tangent;
in vec2 v_texcoord;

uniform sampler2D u_normalMap;
uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

out vec4 outColor;

void main() {
  
  

  
  vec3 normal = normalize(v_normal);
  
  
  vec3 tangent = normalize(v_tangent.xyz - dot(v_tangent.xyz, normal) * normal);
  
  vec3 bitangent = cross(normal, tangent) * v_tangent.w;
  
  
  
  
  mat3 tbn = mat3(tangent, bitangent, normal);

  
  

  vec3 mapNormal = texture(u_normalMap, v_texcoord).rgb * 2.0 - 1.0;
  vec3 worldNormal = normalize(tbn * mapNormal);

  float light = max(dot(worldNormal, u_reverseLightDirection), 0.0);

  outColor = vec4(u_color.rgb * light, u_color.a);
}`;function S(e){let t=new n({title:`Lighting Normal Map`}),r=t.addFolder({title:`Cube`});for(let t of[`rotationX`,`rotationY`])r.addBinding(e,t,{min:-180,max:180,step:1});for(let t of[`scaleX`,`scaleY`,`scaleZ`])r.addBinding(e,t,{min:.1,max:3,step:.1});let i=t.addFolder({title:`Light`});return i.addBinding(e,`lightHorizontalYaw`,{label:`left/right`,min:-180,max:180,step:1}),i.addBinding(e,`lightVerticalPitch`,{label:`bottom/top`,min:-90,max:90,step:1}),t}var C=`textures/normals/Test2.png`;async function w({container:e,webglContextAttributes:t}){let{gl:n,cleanUp:w}=r({container:e,webglContextAttributes:t}),T=await new Promise((e,t)=>{let n=new Image;n.src=C,n.onload=()=>e(n),n.onerror=e=>t(e)}),E=await a({gl:n,vertexShaderSource:b,fragmentShaderSource:x}),D=n.getAttribLocation(E,`a_position`),O=n.getAttribLocation(E,`a_normal`),k=n.getAttribLocation(E,`a_tangent`),A=n.getAttribLocation(E,`a_texcoord`),j=n.getUniformLocation(E,`u_worldViewProjection`),M=n.getUniformLocation(E,`u_world`),N=n.getUniformLocation(E,`u_worldInverseTranspose`),P=n.getUniformLocation(E,`u_normalMap`),F=n.getUniformLocation(E,`u_reverseLightDirection`),I=n.getUniformLocation(E,`u_color`),L=n.createVertexArray();n.bindVertexArray(L);let R=[{location:D,size:3,setData:h},{location:O,size:3,setData:_},{location:k,size:4,setData:v},{location:A,size:2,setData:y}];for(let{location:e,size:t,setData:r}of R){let i=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,i),r(n),n.enableVertexAttribArray(e),n.vertexAttribPointer(e,t,n.FLOAT,!1,0,0)}let z=n.createTexture();n.bindTexture(n.TEXTURE_2D,z),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!0),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,T),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.generateMipmap(n.TEXTURE_2D);let B={rotationX:20,rotationY:-30,scaleX:1,scaleY:1,scaleZ:1,lightHorizontalYaw:30,lightVerticalPitch:30},V=S(B),H=[0,0,400],U=[0,0,0],W=[0,1,0],G=[1,1,1,1];n.enable(n.CULL_FACE),n.enable(n.DEPTH_TEST),n.useProgram(E),n.bindVertexArray(L),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,z),n.uniform1i(P,0);function K(){n.viewport(0,0,n.canvas.width,n.canvas.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT);let e=l(o(60),n.canvas.width/n.canvas.height,1,2e3),t=d(H,U,W),r=p(t),i=c(e,r),a=s(o(B.rotationX));a=m(a,o(B.rotationY)),a=f(a,B.scaleX*150,B.scaleY*150,B.scaleZ*150);let h=c(i,a),_=u(p(a)),v=o(B.lightHorizontalYaw),y=o(B.lightVerticalPitch),b=Math.cos(y),x=[b*Math.sin(v),Math.sin(y),b*Math.cos(v)];n.uniformMatrix4fv(j,!1,h),n.uniformMatrix4fv(M,!1,a),n.uniformMatrix4fv(N,!1,_),n.uniform3fv(F,x),n.uniform4fv(I,G),n.drawArrays(n.TRIANGLES,0,g)}return i({tick:K,cleanUp:()=>{V.dispose(),w()}})}var T=e();function E(){return(0,T.jsx)(t,{nativeScenario:w,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{E as default};