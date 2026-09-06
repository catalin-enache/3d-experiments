import{t as e}from"./Texture-DgXmKVqj.js";import{E as t,Pt as n,Ut as r,g as i,hn as a,i as o,ln as s,mn as c,p as l,r as u,s as d}from"./index-DACYGU7l.js";var f=a(c(),1),p=`uniform mat4 projectionMatrix;
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
}`,h=i(),g=new n(10,10,64,64),_=e=>{let n=e.attributes.position.count,r=new Float32Array(n);for(let e=0;e<n;e++)r[e]=Math.random();e.setAttribute(`aRandom`,new t(r,1))};_(g);function v(){let t=e(`textures/pbr/floors/FloorsCheckerboard_S_Diffuse.jpg`),{material:i,uniforms:a}=(0,f.useMemo)(()=>{let e={uIntensity:{value:.5},uFrequency:{value:new s(.5,.5)},uTime:{value:0},uTexture:{value:t}};return{material:new r({vertexShader:p,fragmentShader:m,wireframe:!1,side:2,transparent:!1,uniforms:e}),uniforms:e}},[t]);return(0,f.useEffect)(()=>{let e=new u({title:`Shader Flag`}),t={tessellation:g.parameters.heightSegments};e.addBinding(t,`tessellation`,{label:`Tessellation`,min:1,max:256,step:1}).on(`change`,({value:e})=>{let t=new n(10,10,e,e);_(t),g.copy(t),t.dispose()}),e.addBinding(a.uIntensity,`value`,{label:`Intensity`,min:0,max:1,step:.1});let r=e.addFolder({title:`Frequency`});return r.addBinding(a.uFrequency.value,`x`,{label:`X`,min:0,max:2,step:.1}),r.addBinding(a.uFrequency.value,`y`,{label:`Y`,min:0,max:2,step:.1}),()=>{e.dispose()}},[a]),l(({clock:e})=>{a.uTime.value=e.elapsedTime}),(0,f.useEffect)(()=>()=>{i.dispose()},[i]),(0,h.jsx)(o,{unselectableChildren:(0,h.jsx)(`mesh`,{position:[0,0,0],name:`mesh`,geometry:g,material:i})})}function y(){return(0,h.jsx)(d,{orthographic:!0,cameraProps:{zoom:55},children:(0,h.jsx)(v,{})})}export{y as default};