import{t as e}from"./Texture-BAw-3tX2.js";import{g as t,gn as n,hn as r,i,s as a}from"./index-CcwAWkbw.js";import{t as o}from"./lil-gui.esm-BsdZdNnU.js";var s=n(r(),1),c=`varying vec2 vUv;

void main() {
     gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
     vUv = uv;
}`,l=`#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif
#ifndef FNC_POW3
#define FNC_POW3

float pow3(const in float v) { return v * v * v; }
vec2 pow3(const in vec2 v) { return v * v * v; }
vec3 pow3(const in vec3 v) { return v * v * v; }
vec4 pow3(const in vec4 v) { return v * v * v; }

#endif

#ifndef SAMPLE_CHANNEL
#define SAMPLE_CHANNEL 0
#endif

vec3 normalFromHeightMap(SAMPLER_TYPE heightMap, vec2 st, float strength, float offset)
{
    offset = pow3(offset) * 0.1;
    
    float p = SAMPLER_FNC(heightMap, st)[SAMPLE_CHANNEL];
    float h = SAMPLER_FNC(heightMap, st + vec2(offset, 0.0))[SAMPLE_CHANNEL];
    float v = SAMPLER_FNC(heightMap, st + vec2(0.0, offset))[SAMPLE_CHANNEL];

    vec3 a = vec3(1, 0, (h - p) * strength);
    vec3 b = vec3(0, 1, (v - p) * strength);

    return normalize(cross(a, b));
}

vec3 normalFromHeightMap(SAMPLER_TYPE heightMap, vec2 st, float strength)
{
    return normalFromHeightMap(heightMap, st, strength, 0.5);

}

uniform sampler2D uHeightMap;
uniform float uIntensity;
uniform float uOffset;

varying vec2 vUv;

void main() {
    vec4 textureColor = texture2D(uHeightMap, vUv);
    
    vec3 normal = normalFromHeightMap(uHeightMap, vUv, uIntensity, uOffset);
    normal = normal * 0.5 + 0.5; 
    gl_FragColor = vec4(normal, 1.0);
}`;function u(e){let t=new o;return t.add(e.uIntensity,`value`,0,10,.1).name(`Intensity`),t.add(e.uOffset,`value`,-1,1,.01).name(`Offset`),t}var d=t();function f(){let t=e(`textures/pbr/castle_brick_02/castle_brick_02_red_4k_disp.jpg`),n=(0,s.useRef)(null),r=(0,s.useMemo)(()=>({uHeightMap:{value:t},uIntensity:{value:2},uOffset:{value:.3}}),[t]);return(0,s.useEffect)(()=>{let{uIntensity:e,uOffset:t}=n.current.uniforms,r=u({uIntensity:e,uOffset:t});return()=>{r.destroy()}},[n]),(0,d.jsx)(i,{useTransformControls:!1,useCameraControls:!1,unselectableChildren:(0,d.jsxs)(`mesh`,{position:[0,0,0],name:`mesh`,children:[(0,d.jsx)(`planeGeometry`,{args:[10,10,1,1]}),(0,d.jsx)(`shaderMaterial`,{ref:n,vertexShader:c,fragmentShader:l,wireframe:!1,side:2,transparent:!1,uniforms:r})]})})}function p(){return(0,d.jsx)(a,{cameraProps:{position:[0,0,10]},children:(0,d.jsx)(f,{})})}export{p as default};