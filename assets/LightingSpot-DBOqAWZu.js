import{g as e,o as t,r as n}from"./index-CcwAWkbw.js";import{n as r,r as i,t as a}from"./webgl-BFJtxVZL.js";import{t as o}from"./m3-PaD3hXb8.js";import{a as s,c,d as l,g as u,h as d,i as f,l as p,m,n as h,o as ee,r as g,v as _}from"./m4-BcdbHlg4.js";import{b as v,d as y,f as b,n as x,r as S,t as C,u as te,v as ne,y as re}from"./geometries-C08I9AYt.js";var ie=`#version 300 es

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
}`,ae=`#version 300 es
precision highp float;

float interleavedGradientNoise(vec2 p) {
  
  
  
  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
}

float sineHash(vec2 p) {
  
  
  
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float dither(vec2 p, float strength) {
  
  
  float noise = interleavedGradientNoise(p) + sineHash(p) - 1.0;
  
  return noise * strength / 255.0;
}

in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform vec4 u_color;

uniform float u_falloffDistance;

uniform bool u_unlit;
uniform float u_shininess;
uniform vec3 u_lightColor;

uniform vec3 u_lightDirection;

uniform float u_innerLimit;
uniform float u_outerLimit;

uniform bool u_dithering;

uniform float u_ditherStrength;

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

  
  
  
  
  
  
  
  
  
  float dotFromDirection = dot(-surfaceToLightDirection, u_lightDirection);

  
  
  
  
  
  
  float inLight = smoothstep(
    u_outerLimit,
    max(u_innerLimit, u_outerLimit + 0.0001),
    dotFromDirection
  );
  
  float light = max(dot(normal, surfaceToLightDirection), 0.0);
  float specular = step(0.0001, light) * pow(max(dot(normal, halfVector), 0.0), u_shininess);

  
  float distanceToLight = length(v_surfaceToLight);
  float d = distanceToLight / u_falloffDistance;
  float attenuation = 1.0 / (1.0 + d * d);

  
  light *= attenuation * inLight;
  specular *= attenuation * inLight;

  outColor = u_color;
  outColor.rgb *= light * u_lightColor;
  outColor.rgb += specular * u_lightColor;

  
  if (u_dithering) {
    outColor.rgb += dither(gl_FragCoord.xy, u_ditherStrength);
  }
}`;function oe(e){let t=new n({title:`Lighting Spot`});t.addBinding(e,`rotation`,{min:-360,max:360,step:1});for(let n of[`scaleX`,`scaleY`,`scaleZ`])t.addBinding(e,n,{min:.1,max:3,step:.1});t.addBinding(e,`inverseTranspose`,{label:`inverse transpose`}),t.addBinding(e,`dithering`),t.addBinding(e,`ditherStrength`,{label:`dither strength`,min:0,max:4,step:.25});let r=t.addFolder({title:`Light`});for(let t of[`lightX`,`lightY`,`lightZ`])r.addBinding(e,t,{min:-300,max:300,step:1});r.addBinding(e,`falloffDistance`,{label:`half brightness at`,min:10,max:1e3,step:1}),r.addBinding(e,`lightColor`,{label:`light color`,color:{type:`float`}}),r.addBinding(e,`shininess`,{min:1,max:500,step:1});let i=t.addFolder({title:`Spot`});for(let t of[`targetX`,`targetY`,`targetZ`])i.addBinding(e,t,{min:-300,max:300,step:1});return i.addBinding(e,`innerAngle`,{label:`inner angle`,min:0,max:90,step:1}),i.addBinding(e,`outerAngle`,{label:`outer angle`,min:0,max:90,step:1}),t}async function w({container:e,webglContextAttributes:t}){let{gl:n,cleanUp:w}=r({container:e,webglContextAttributes:t}),T=await a({gl:n,vertexShaderSource:ie,fragmentShaderSource:ae}),E=n.getAttribLocation(T,`a_position`),D=n.getAttribLocation(T,`a_normal`),O=n.getUniformLocation(T,`u_world`),k=n.getUniformLocation(T,`u_worldViewProjection`),A=n.getUniformLocation(T,`u_worldInverseTranspose`),j=n.getUniformLocation(T,`u_color`),M=n.getUniformLocation(T,`u_lightWorldPosition`),N=n.getUniformLocation(T,`u_falloffDistance`),P=n.getUniformLocation(T,`u_unlit`),F=n.getUniformLocation(T,`u_viewWorldPosition`),I=n.getUniformLocation(T,`u_shininess`),L=n.getUniformLocation(T,`u_lightColor`),R=n.getUniformLocation(T,`u_lightDirection`),z=n.getUniformLocation(T,`u_innerLimit`),B=n.getUniformLocation(T,`u_outerLimit`),se=n.getUniformLocation(T,`u_dithering`),V=n.getUniformLocation(T,`u_ditherStrength`);function H(e,t){let r=n.createVertexArray();n.bindVertexArray(r);let i=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,i),e(n),n.enableVertexAttribArray(E),n.vertexAttribPointer(E,3,n.FLOAT,!1,0,0);let a=n.createBuffer();return n.bindBuffer(n.ARRAY_BUFFER,a),t(n),n.enableVertexAttribArray(D),n.vertexAttribPointer(D,3,n.FLOAT,!1,0,0),r}let U=H(y,te),W=[{vao:H(re,ne),vertexCount:v,position:[-70,0,0],size:1,color:[.8,.8,.8,1]},{vao:U,vertexCount:b,position:[80,0,0],size:60,color:[.6,.6,.6,1]}],G=H(x,C),K=m(0,-80,0);K=u(K,o(-90)),K=p(K,600,600,1);let ce=[.7,.7,.7,1],q=n.createVertexArray();n.bindVertexArray(q);let J=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,J),n.bufferData(n.ARRAY_BUFFER,24,n.DYNAMIC_DRAW),n.enableVertexAttribArray(E),n.vertexAttribPointer(E,3,n.FLOAT,!1,0,0);let Y=new Float32Array(6),X={rotation:0,scaleX:1,scaleY:1,scaleZ:1,inverseTranspose:!0,lightX:0,lightY:180,lightZ:150,falloffDistance:400,lightColor:{r:1,g:1,b:1},shininess:150,targetX:0,targetY:-30,targetZ:0,innerAngle:20,outerAngle:30,dithering:!0,ditherStrength:1},le=oe(X),Z=[100,150,250],ue=[0,0,0],Q=[0,1,0];n.enable(n.CULL_FACE),n.enable(n.DEPTH_TEST),n.useProgram(T);function $(e,t){n.uniformMatrix4fv(O,!1,e),n.uniformMatrix4fv(k,!1,s(t,e)),n.uniformMatrix4fv(A,!1,X.inverseTranspose?d(g(e)):e)}function de(){n.viewport(0,0,n.canvas.width,n.canvas.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT);let e=c(o(60),n.canvas.width/n.canvas.height,1,2e3),t=f(Z,ue,Q),r=g(t),i=s(e,r),a=[X.lightX,X.lightY,X.lightZ],u=[X.targetX,X.targetY,X.targetZ];n.uniform3fv(M,a),n.uniform1f(N,X.falloffDistance),n.uniform1i(P,0),n.uniform3fv(F,Z),n.uniform1f(I,X.shininess);let{lightColor:d}=X;n.uniform3fv(L,[d.r,d.g,d.b]),n.uniform3fv(R,ee(l(u,a)));let v=Math.min(X.innerAngle,X.outerAngle);n.uniform1f(z,Math.cos(o(v))),n.uniform1f(B,Math.cos(o(X.outerAngle))),n.uniform1i(se,+!!X.dithering),n.uniform1f(V,X.ditherStrength);for(let{vao:e,vertexCount:t,position:r,size:a,color:s}of W){let c=m(r[0],r[1],r[2]);c=_(c,o(X.rotation)),c=p(c,X.scaleX*a,X.scaleY*a,X.scaleZ*a),$(c,i),n.uniform4fv(j,s),n.bindVertexArray(e),n.drawArrays(n.TRIANGLES,0,t)}$(K,i),n.uniform4fv(j,ce),n.bindVertexArray(G),n.drawArrays(n.TRIANGLES,0,S),$(p(m(a[0],a[1],a[2]),5,5,5),i),n.uniform4fv(j,[d.r,d.g,d.b,1]),n.uniform1i(P,1),n.bindVertexArray(U),n.drawArrays(n.TRIANGLES,0,b),Y.set(a,0),Y.set(u,3),n.bindBuffer(n.ARRAY_BUFFER,J),n.bufferSubData(n.ARRAY_BUFFER,0,Y),$(h(),i),n.bindVertexArray(q),n.drawArrays(n.LINES,0,2)}return i({tick:de,cleanUp:()=>{le.dispose(),w()}})}var T=e();function E(){return(0,T.jsx)(t,{nativeScenario:w,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{E as default};