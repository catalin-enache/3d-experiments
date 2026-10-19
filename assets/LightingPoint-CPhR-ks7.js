import{g as e,o as t,r as n}from"./index-7pWkORit.js";import{n as r,r as i,t as a}from"./webgl-DB6cWIQO.js";import{t as o}from"./m3-PaD3hXb8.js";import{a as s,c,f as l,g as u,i as d,l as f,p,r as m}from"./m4-_xs1dbdM.js";import{_ as h,d as g,g as _,l as v,u as y,v as b}from"./geometries-Dj7g7vzL.js";var x=`#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform vec3 u_lightWorldPosition;

uniform vec3 u_viewWorldPosition;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;

out vec3 v_surfaceToLight;

out vec3 v_surfaceToView;

void main() {
  gl_Position = u_worldViewProjection * a_position;

  
  v_normal = mat3(u_worldInverseTranspose) * a_normal;

  
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  
  
  
  
  
  
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

  
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}`,S=`#version 300 es
precision highp float;

in vec3 v_normal;

in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform vec4 u_color;

uniform float u_falloffDistance;

uniform bool u_unlit;

uniform float u_shininess;

uniform vec3 u_lightColor;

out vec4 outColor;

void main() {
  if (u_unlit) {
    outColor = u_color;
    return;
  }

  
  
  
  vec3 normal = normalize(v_normal);

  
  
  
  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);

  
  
  
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  
  
  
  float light = max(dot(normal, surfaceToLightDirection), 0.0);

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  float specular = step(0.0001, light) * pow(max(dot(normal, halfVector), 0.0), u_shininess);

  
  
  
  
  
  
  
  
  float distanceToLight = length(v_surfaceToLight);
  float d = distanceToLight / u_falloffDistance;
  float attenuation = 1.0 / (1.0 + d * d);
  
  light *= attenuation;
  specular *= attenuation;

  outColor = u_color;

  
  
  
  outColor.rgb *= light * u_lightColor;

  
  
  
  outColor.rgb += specular * u_lightColor;
}`;async function C({container:e,webglContextAttributes:t}){let{gl:C,cleanUp:w}=r({container:e,webglContextAttributes:t}),T=await a({gl:C,vertexShaderSource:x,fragmentShaderSource:S}),E=C.getAttribLocation(T,`a_position`),D=C.getAttribLocation(T,`a_normal`),O=C.getUniformLocation(T,`u_world`),k=C.getUniformLocation(T,`u_worldViewProjection`),A=C.getUniformLocation(T,`u_worldInverseTranspose`),j=C.getUniformLocation(T,`u_color`),M=C.getUniformLocation(T,`u_lightWorldPosition`),N=C.getUniformLocation(T,`u_falloffDistance`),P=C.getUniformLocation(T,`u_unlit`),F=C.getUniformLocation(T,`u_viewWorldPosition`),I=C.getUniformLocation(T,`u_shininess`),L=C.getUniformLocation(T,`u_lightColor`);function R(e,t){let n=C.createVertexArray();C.bindVertexArray(n);let r=C.createBuffer();C.bindBuffer(C.ARRAY_BUFFER,r),e(C),C.enableVertexAttribArray(E),C.vertexAttribPointer(E,3,C.FLOAT,!1,0,0);let i=C.createBuffer();return C.bindBuffer(C.ARRAY_BUFFER,i),t(C),C.enableVertexAttribArray(D),C.vertexAttribPointer(D,3,C.FLOAT,!1,0,0),n}let z=R(y,v),B=[{vao:R(h,_),vertexCount:b,position:[-70,0,0],size:1,color:[.8,.8,.8,1]},{vao:z,vertexCount:g,position:[80,0,0],size:60,color:[.6,.6,.6,1]}],V={rotation:0,scaleX:1,scaleY:1,scaleZ:1,inverseTranspose:!0,lightX:-110,lightY:24,lightZ:109,falloffDistance:200,lightColor:{r:1,g:1,b:1},shininess:150},H=new n({title:`Lighting Point`});H.addBinding(V,`rotation`,{min:-360,max:360,step:1});for(let e of[`scaleX`,`scaleY`,`scaleZ`])H.addBinding(V,e,{min:.1,max:3,step:.1});H.addBinding(V,`inverseTranspose`,{label:`inverse transpose`});let U=H.addFolder({title:`Light position`});for(let e of[`lightX`,`lightY`,`lightZ`])U.addBinding(V,e,{min:-300,max:300,step:1});U.addBinding(V,`falloffDistance`,{label:`half brightness at`,min:10,max:1e3,step:1}),U.addBinding(V,`lightColor`,{label:`light color`,color:{type:`float`}}),U.addBinding(V,`shininess`,{min:1,max:500,step:1});let W=[100,150,250],G=[0,0,0],K=[0,1,0];C.enable(C.CULL_FACE),C.enable(C.DEPTH_TEST),C.useProgram(T);function q(){C.viewport(0,0,C.canvas.width,C.canvas.height),C.clearColor(0,0,0,0),C.clear(C.COLOR_BUFFER_BIT|C.DEPTH_BUFFER_BIT);let e=c(o(60),C.canvas.width/C.canvas.height,1,2e3),t=d(W,G,K),n=m(t),r=s(e,n),i=[V.lightX,V.lightY,V.lightZ];C.uniform3fv(M,i),C.uniform1f(N,V.falloffDistance),C.uniform1i(P,0),C.uniform3fv(F,W),C.uniform1f(I,V.shininess);let{lightColor:a}=V;C.uniform3fv(L,[a.r,a.g,a.b]);for(let{vao:e,vertexCount:t,position:n,size:i,color:a}of B){let c=l(n[0],n[1],n[2]);c=u(c,o(V.rotation)),c=f(c,V.scaleX*i,V.scaleY*i,V.scaleZ*i);let d=s(r,c),h=V.inverseTranspose?p(m(c)):c;C.uniformMatrix4fv(O,!1,c),C.uniformMatrix4fv(k,!1,d),C.uniformMatrix4fv(A,!1,h),C.uniform4fv(j,a),C.bindVertexArray(e),C.drawArrays(C.TRIANGLES,0,t)}let h=f(l(i[0],i[1],i[2]),5,5,5);C.uniformMatrix4fv(O,!1,h),C.uniformMatrix4fv(k,!1,s(r,h)),C.uniformMatrix4fv(A,!1,p(m(h))),C.uniform4fv(j,[a.r,a.g,a.b,1]),C.uniform1i(P,1),C.bindVertexArray(z),C.drawArrays(C.TRIANGLES,0,g)}return i({tick:q,cleanUp:()=>{H.dispose(),w()}})}var w=e();function T(){return(0,w.jsx)(t,{nativeScenario:C,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{T as default};