import{g as e,o as t,r as n}from"./index-6FzA5AJq.js";import{n as r,r as i,t as a}from"./webgl-vSbijmij.js";import{t as o}from"./m3-PaD3hXb8.js";import{a as s,c,g as l,h as u,i as d,l as f,p,r as m}from"./m4-_xs1dbdM.js";import{a as h,c as g,i as _,o as v,s as y}from"./geometries-Dj7g7vzL.js";var b=`#version 300 es

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
}`,S=`textures/normals/Test2.png`;async function C({container:e,webglContextAttributes:t}){let{gl:C,cleanUp:w}=r({container:e,webglContextAttributes:t}),T=await new Promise((e,t)=>{let n=new Image;n.src=S,n.onload=()=>e(n),n.onerror=e=>t(e)}),E=await a({gl:C,vertexShaderSource:b,fragmentShaderSource:x}),D=C.getAttribLocation(E,`a_position`),O=C.getAttribLocation(E,`a_normal`),k=C.getAttribLocation(E,`a_tangent`),A=C.getAttribLocation(E,`a_texcoord`),j=C.getUniformLocation(E,`u_worldViewProjection`),M=C.getUniformLocation(E,`u_world`),N=C.getUniformLocation(E,`u_worldInverseTranspose`),P=C.getUniformLocation(E,`u_normalMap`),F=C.getUniformLocation(E,`u_reverseLightDirection`),I=C.getUniformLocation(E,`u_color`),L=C.createVertexArray();C.bindVertexArray(L);let R=[{location:D,size:3,setData:h},{location:O,size:3,setData:_},{location:k,size:4,setData:v},{location:A,size:2,setData:y}];for(let{location:e,size:t,setData:n}of R){let r=C.createBuffer();C.bindBuffer(C.ARRAY_BUFFER,r),n(C),C.enableVertexAttribArray(e),C.vertexAttribPointer(e,t,C.FLOAT,!1,0,0)}let z=C.createTexture();C.bindTexture(C.TEXTURE_2D,z),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,!0),C.texImage2D(C.TEXTURE_2D,0,C.RGBA,C.RGBA,C.UNSIGNED_BYTE,T),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,!1),C.generateMipmap(C.TEXTURE_2D);let B={rotationX:20,rotationY:-30,scaleX:1,scaleY:1,scaleZ:1,lightHorizontalYaw:30,lightVerticalPitch:30},V=new n({title:`Lighting Normal Map`}),H=V.addFolder({title:`Cube`});for(let e of[`rotationX`,`rotationY`])H.addBinding(B,e,{min:-180,max:180,step:1});for(let e of[`scaleX`,`scaleY`,`scaleZ`])H.addBinding(B,e,{min:.1,max:3,step:.1});let U=V.addFolder({title:`Light`});U.addBinding(B,`lightHorizontalYaw`,{label:`left/right`,min:-180,max:180,step:1}),U.addBinding(B,`lightVerticalPitch`,{label:`bottom/top`,min:-90,max:90,step:1});let W=[0,0,400],G=[0,0,0],K=[0,1,0],q=[1,1,1,1];C.enable(C.CULL_FACE),C.enable(C.DEPTH_TEST),C.useProgram(E),C.bindVertexArray(L),C.activeTexture(C.TEXTURE0),C.bindTexture(C.TEXTURE_2D,z),C.uniform1i(P,0);function J(){C.viewport(0,0,C.canvas.width,C.canvas.height),C.clearColor(0,0,0,0),C.clear(C.COLOR_BUFFER_BIT|C.DEPTH_BUFFER_BIT);let e=c(o(60),C.canvas.width/C.canvas.height,1,2e3),t=d(W,G,K),n=m(t),r=s(e,n),i=u(o(B.rotationX));i=l(i,o(B.rotationY)),i=f(i,B.scaleX*150,B.scaleY*150,B.scaleZ*150);let a=s(r,i),h=p(m(i)),_=o(B.lightHorizontalYaw),v=o(B.lightVerticalPitch),y=Math.cos(v),b=[y*Math.sin(_),Math.sin(v),y*Math.cos(_)];C.uniformMatrix4fv(j,!1,a),C.uniformMatrix4fv(M,!1,i),C.uniformMatrix4fv(N,!1,h),C.uniform3fv(F,b),C.uniform4fv(I,q),C.drawArrays(C.TRIANGLES,0,g)}return i({tick:J,cleanUp:()=>{V.dispose(),w()}})}var w=e();function T(){return(0,w.jsx)(t,{nativeScenario:C,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{T as default};