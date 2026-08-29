import{t as e}from"./Texture-Bii7xIc6.js";import{Rt as t,a as n,cn as r,d as i,kt as a,ln as o,m as s,n as c,r as l,rn as u,x as d}from"./index-CzKUGHpr.js";var f=o(r(),1),p=`uniform mat4 projectionMatrix;
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
}`,h=s(),g=new a(10,10,64,64),_=e=>{let t=e.attributes.position.count,n=new Float32Array(t);for(let e=0;e<t;e++)n[e]=Math.random();e.setAttribute(`aRandom`,new d(n,1))};_(g);function v(){let n=e(`textures/pbr/floors/FloorsCheckerboard_S_Diffuse.jpg`),{material:r,uniforms:o}=(0,f.useMemo)(()=>{let e={uIntensity:{value:.5},uFrequency:{value:new u(.5,.5)},uTime:{value:0},uTexture:{value:n}};return{material:new t({vertexShader:p,fragmentShader:m,wireframe:!1,side:2,transparent:!1,uniforms:e}),uniforms:e}},[n]);return(0,f.useEffect)(()=>{let e=new c({title:`Shader Flag`}),t={tessellation:g.parameters.heightSegments};e.addBinding(t,`tessellation`,{label:`Tessellation`,min:1,max:256,step:1}).on(`change`,({value:e})=>{let t=new a(10,10,e,e);_(t),g.copy(t),t.dispose()}),e.addBinding(o.uIntensity,`value`,{label:`Intensity`,min:0,max:1,step:.1});let n=e.addFolder({title:`Frequency`});return n.addBinding(o.uFrequency.value,`x`,{label:`X`,min:0,max:2,step:.1}),n.addBinding(o.uFrequency.value,`y`,{label:`Y`,min:0,max:2,step:.1}),()=>{e.dispose()}},[o]),i(({clock:e})=>{o.uTime.value=e.elapsedTime}),(0,f.useEffect)(()=>()=>{r.dispose()},[r]),(0,h.jsx)(l,{unselectableChildren:(0,h.jsx)(`mesh`,{position:[0,0,0],name:`mesh`,geometry:g,material:r})})}function y(){return(0,h.jsx)(n,{orthographic:!0,cameraProps:{zoom:55},children:(0,h.jsx)(v,{})})}export{y as default};