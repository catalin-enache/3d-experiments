import{t as e}from"./Texture-BAw-3tX2.js";import{E as t,Ft as n,Wt as r,g as i,gn as a,hn as o,i as s,p as c,r as l,s as u,un as d}from"./index-CcwAWkbw.js";var f=a(o(),1),p=`uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;
uniform float uIntensity;

attribute vec3 position;
attribute vec2 uv;
attribute float aRandom;

varying float vRandom;
varying float vElevation;
varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * uIntensity;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * uIntensity;
    modelPosition.z += elevation;
    modelPosition.y *= 0.5; 

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    
    
    vRandom = aRandom;
    vUv = uv;
    vElevation = elevation;
}`,m=`precision mediump float;

uniform sampler2D uTexture;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main() {

    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.r += vRandom * 0.4;
    textureColor.rgb *= vElevation * 0.35 + 1.0;
    gl_FragColor = textureColor;
}`;function h(e,t,{onTessellationChange:n}){let r=new l({title:`Shader Flag`});r.addBinding(e,`tessellation`,{label:`Tessellation`,min:1,max:256,step:1}).on(`change`,({value:e})=>{n(e)}),r.addBinding(t.uIntensity,`value`,{label:`Intensity`,min:0,max:1,step:.1});let i=r.addFolder({title:`Frequency`});return i.addBinding(t.uFrequency.value,`x`,{label:`X`,min:0,max:2,step:.1}),i.addBinding(t.uFrequency.value,`y`,{label:`Y`,min:0,max:2,step:.1}),r}var g=i(),_=new n(10,10,64,64),v=e=>{let n=e.attributes.position.count,r=new Float32Array(n);for(let e=0;e<n;e++)r[e]=Math.random();e.setAttribute(`aRandom`,new t(r,1))};v(_);function y(){let t=e(`textures/pbr/floors/FloorsCheckerboard_S_Diffuse.jpg`),{material:i,uniforms:a}=(0,f.useMemo)(()=>{let e={uIntensity:{value:.5},uFrequency:{value:new d(.5,.5)},uTime:{value:0},uTexture:{value:t}};return{material:new r({vertexShader:p,fragmentShader:m,wireframe:!1,side:2,transparent:!1,uniforms:e}),uniforms:e}},[t]);return(0,f.useEffect)(()=>{let e=h({tessellation:_.parameters.heightSegments},a,{onTessellationChange:e=>{let t=new n(10,10,e,e);v(t),_.copy(t),t.dispose()}});return()=>{e.dispose()}},[a]),c(({clock:e})=>{a.uTime.value=e.elapsedTime}),(0,f.useEffect)(()=>()=>{i.dispose()},[i]),(0,g.jsx)(s,{unselectableChildren:(0,g.jsx)(`mesh`,{position:[0,0,0],name:`mesh`,geometry:_,material:i})})}function b(){return(0,g.jsx)(u,{orthographic:!0,cameraProps:{zoom:55},children:(0,g.jsx)(y,{})})}export{b as default};