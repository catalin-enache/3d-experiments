import{t as e}from"./Texture-Dd9HbYV8.js";import{Dt as t,It as n,a as r,d as i,m as a,n as o,on as s,r as c,sn as l,tn as u,x as d}from"./index-BDVpO5fG.js";var f=l(s(),1),p=`uniform mat4 projectionMatrix;
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
}`,h=a(),g=new t(10,10,64,64),_=e=>{let t=e.attributes.position.count,n=new Float32Array(t);for(let e=0;e<t;e++)n[e]=Math.random();e.setAttribute(`aRandom`,new d(n,1))};_(g);function v(){let r=e(`textures/pbr/floors/FloorsCheckerboard_S_Diffuse.jpg`),{material:a,uniforms:s}=(0,f.useMemo)(()=>{let e={uIntensity:{value:.5},uFrequency:{value:new u(.5,.5)},uTime:{value:0},uTexture:{value:r}};return{material:new n({vertexShader:p,fragmentShader:m,wireframe:!1,side:2,transparent:!1,uniforms:e}),uniforms:e}},[r]);return(0,f.useEffect)(()=>{let e=new o({title:`Shader Flag`}),n={tessellation:g.parameters.heightSegments};e.addBinding(n,`tessellation`,{label:`Tessellation`,min:1,max:256,step:1}).on(`change`,({value:e})=>{let n=new t(10,10,e,e);_(n),g.copy(n),n.dispose()}),e.addBinding(s.uIntensity,`value`,{label:`Intensity`,min:0,max:1,step:.1});let r=e.addFolder({title:`Frequency`});return r.addBinding(s.uFrequency.value,`x`,{label:`X`,min:0,max:2,step:.1}),r.addBinding(s.uFrequency.value,`y`,{label:`Y`,min:0,max:2,step:.1}),()=>{e.dispose()}},[s]),i(({clock:e})=>{s.uTime.value=e.elapsedTime}),(0,f.useEffect)(()=>()=>{a.dispose()},[a]),(0,h.jsx)(c,{unselectableChildren:(0,h.jsx)(`mesh`,{position:[0,0,0],name:`mesh`,geometry:g,material:a})})}function y(){return(0,h.jsx)(r,{orthographic:!0,cameraProps:{zoom:55},children:(0,h.jsx)(v,{})})}export{y as default};