import{t as e}from"./Texture-Cga3_1ou.js";import{Bt as t,C as n,an as r,dn as i,g as a,i as o,jt as s,p as c,r as l,s as u,un as d}from"./index-BNeGMLFQ.js";var f=i(d(),1),p=`uniform mat4 projectionMatrix;
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
}`,h=a(),g=new s(10,10,64,64),_=e=>{let t=e.attributes.position.count,r=new Float32Array(t);for(let e=0;e<t;e++)r[e]=Math.random();e.setAttribute(`aRandom`,new n(r,1))};_(g);function v(){let n=e(`textures/pbr/floors/FloorsCheckerboard_S_Diffuse.jpg`),{material:i,uniforms:a}=(0,f.useMemo)(()=>{let e={uIntensity:{value:.5},uFrequency:{value:new r(.5,.5)},uTime:{value:0},uTexture:{value:n}};return{material:new t({vertexShader:p,fragmentShader:m,wireframe:!1,side:2,transparent:!1,uniforms:e}),uniforms:e}},[n]);return(0,f.useEffect)(()=>{let e=new l({title:`Shader Flag`}),t={tessellation:g.parameters.heightSegments};e.addBinding(t,`tessellation`,{label:`Tessellation`,min:1,max:256,step:1}).on(`change`,({value:e})=>{let t=new s(10,10,e,e);_(t),g.copy(t),t.dispose()}),e.addBinding(a.uIntensity,`value`,{label:`Intensity`,min:0,max:1,step:.1});let n=e.addFolder({title:`Frequency`});return n.addBinding(a.uFrequency.value,`x`,{label:`X`,min:0,max:2,step:.1}),n.addBinding(a.uFrequency.value,`y`,{label:`Y`,min:0,max:2,step:.1}),()=>{e.dispose()}},[a]),c(({clock:e})=>{a.uTime.value=e.elapsedTime}),(0,f.useEffect)(()=>()=>{i.dispose()},[i]),(0,h.jsx)(o,{unselectableChildren:(0,h.jsx)(`mesh`,{position:[0,0,0],name:`mesh`,geometry:g,material:i})})}function y(){return(0,h.jsx)(u,{orthographic:!0,cameraProps:{zoom:55},children:(0,h.jsx)(v,{})})}export{y as default};