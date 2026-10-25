import{g as e,o as t,r as n}from"./index-CcwAWkbw.js";import{n as r,r as i,t as a}from"./webgl-BFJtxVZL.js";import{t as o}from"./m3-PaD3hXb8.js";import{a as s,c,h as l,i as u,l as d,m as f,r as p,v as m}from"./m4-BcdbHlg4.js";import{b as h,d as g,f as _,u as v,v as y,y as b}from"./geometries-C08I9AYt.js";var x=`#version 300 es

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
}`;function C(e){let t=new n({title:`Lighting Point`});t.addBinding(e,`rotation`,{min:-360,max:360,step:1});for(let n of[`scaleX`,`scaleY`,`scaleZ`])t.addBinding(e,n,{min:.1,max:3,step:.1});t.addBinding(e,`inverseTranspose`,{label:`inverse transpose`});let r=t.addFolder({title:`Light position`});for(let t of[`lightX`,`lightY`,`lightZ`])r.addBinding(e,t,{min:-300,max:300,step:1});return r.addBinding(e,`falloffDistance`,{label:`half brightness at`,min:10,max:1e3,step:1}),r.addBinding(e,`lightColor`,{label:`light color`,color:{type:`float`}}),r.addBinding(e,`shininess`,{min:1,max:500,step:1}),t}async function w({container:e,webglContextAttributes:t}){let{gl:n,cleanUp:w}=r({container:e,webglContextAttributes:t}),T=await a({gl:n,vertexShaderSource:x,fragmentShaderSource:S}),E=n.getAttribLocation(T,`a_position`),D=n.getAttribLocation(T,`a_normal`),O=n.getUniformLocation(T,`u_world`),k=n.getUniformLocation(T,`u_worldViewProjection`),A=n.getUniformLocation(T,`u_worldInverseTranspose`),j=n.getUniformLocation(T,`u_color`),M=n.getUniformLocation(T,`u_lightWorldPosition`),N=n.getUniformLocation(T,`u_falloffDistance`),P=n.getUniformLocation(T,`u_unlit`),F=n.getUniformLocation(T,`u_viewWorldPosition`),I=n.getUniformLocation(T,`u_shininess`),L=n.getUniformLocation(T,`u_lightColor`);function R(e,t){let r=n.createVertexArray();n.bindVertexArray(r);let i=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,i),e(n),n.enableVertexAttribArray(E),n.vertexAttribPointer(E,3,n.FLOAT,!1,0,0);let a=n.createBuffer();return n.bindBuffer(n.ARRAY_BUFFER,a),t(n),n.enableVertexAttribArray(D),n.vertexAttribPointer(D,3,n.FLOAT,!1,0,0),r}let z=R(g,v),B=[{vao:R(b,y),vertexCount:h,position:[-70,0,0],size:1,color:[.8,.8,.8,1]},{vao:z,vertexCount:_,position:[80,0,0],size:60,color:[.6,.6,.6,1]}],V={rotation:0,scaleX:1,scaleY:1,scaleZ:1,inverseTranspose:!0,lightX:-110,lightY:24,lightZ:109,falloffDistance:200,lightColor:{r:1,g:1,b:1},shininess:150},H=C(V),U=[100,150,250],W=[0,0,0],G=[0,1,0];n.enable(n.CULL_FACE),n.enable(n.DEPTH_TEST),n.useProgram(T);function K(){n.viewport(0,0,n.canvas.width,n.canvas.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT);let e=c(o(60),n.canvas.width/n.canvas.height,1,2e3),t=u(U,W,G),r=p(t),i=s(e,r),a=[V.lightX,V.lightY,V.lightZ];n.uniform3fv(M,a),n.uniform1f(N,V.falloffDistance),n.uniform1i(P,0),n.uniform3fv(F,U),n.uniform1f(I,V.shininess);let{lightColor:h}=V;n.uniform3fv(L,[h.r,h.g,h.b]);for(let{vao:e,vertexCount:t,position:r,size:a,color:c}of B){let u=f(r[0],r[1],r[2]);u=m(u,o(V.rotation)),u=d(u,V.scaleX*a,V.scaleY*a,V.scaleZ*a);let h=s(i,u),g=V.inverseTranspose?l(p(u)):u;n.uniformMatrix4fv(O,!1,u),n.uniformMatrix4fv(k,!1,h),n.uniformMatrix4fv(A,!1,g),n.uniform4fv(j,c),n.bindVertexArray(e),n.drawArrays(n.TRIANGLES,0,t)}let g=d(f(a[0],a[1],a[2]),5,5,5);n.uniformMatrix4fv(O,!1,g),n.uniformMatrix4fv(k,!1,s(i,g)),n.uniformMatrix4fv(A,!1,l(p(g))),n.uniform4fv(j,[h.r,h.g,h.b,1]),n.uniform1i(P,1),n.bindVertexArray(z),n.drawArrays(n.TRIANGLES,0,_)}return i({tick:K,cleanUp:()=>{H.dispose(),w()}})}var T=e();function E(){return(0,T.jsx)(t,{nativeScenario:w,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{E as default};