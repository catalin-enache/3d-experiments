import{Dt as e,Ht as t,a as n,m as r,on as i,r as a,rn as o,sn as s}from"./index-BpFcPLM4.js";import{t as c}from"./lil-gui.esm-BsdZdNnU.js";var l=s(i(),1),u=`varying vec2 vUv;

void main() {
     gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
     vUv = uv;
}`,d=`#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif

#ifndef TWO_PI
#define TWO_PI 6.28318530718
#endif

#ifndef TIFMK_MATH_GLSL
#define TIFMK_MATH_GLSL

float tifmk_modulo(float a, float b) {
    
    
    return a - floor(a / b) * b;
}

#endif
#ifndef TIFMK_BEZIER_GLSL
#define TIFMK_BEZIER_GLSL

float tifmk_slopeFromT (float t, float A, float B, float C){
    float dtdx = 1.0/(3.0*A*t*t + 2.0*B*t + C);
    return dtdx;
}

float tifmk_xFromT (float t, float A, float B, float C, float D){
    float x = A*(t*t*t) + B*(t*t) + C*t + D;
    return x;
}

float tifmk_yFromT (float t, float E, float F, float G, float H){
    float y = E*(t*t*t) + F*(t*t) + G*t + H;
    return y;
}

float tifmk_cubicBezier(float x, vec2 a, vec2 b){

    float y0a = 0.0; 
    float x0a = 0.0; 
    float y1a = a.y;    
    float x1a = a.x;    
    float y2a = b.y;    
    float x2a = b.x;    
    float y3a = 1.0; 
    float x3a = 1.0; 

    float A =   x3a - 3.0*x2a + 3.0*x1a - x0a;
    float B = 3.0*x2a - 6.0*x1a + 3.0*x0a;
    float C = 3.0*x1a - 3.0*x0a;
    float D =   x0a;

    float E =   y3a - 3.0*y2a + 3.0*y1a - y0a;
    float F = 3.0*y2a - 6.0*y1a + 3.0*y0a;
    float G = 3.0*y1a - 3.0*y0a;
    float H =   y0a;

    
    
    float currentt = x;
    for (int i=0; i < 5; i++){
        float currentx = tifmk_xFromT (currentt, A,B,C,D);
        float currentslope = tifmk_slopeFromT (currentt, A,B,C);
        currentt -= (currentx - x)*(currentslope);
        currentt = clamp(currentt,0.0,1.0);
    }

    float y = tifmk_yFromT (currentt,  E,F,G,H);
    return y;
}

#endif
#ifndef TIFMK_UV_GLSL
#define TIFMK_UV_GLSL

float tifmk_selectGridCell(vec2 pos, int row, int col) {
    vec2 ipos = floor(pos);
    float rowMatch = 1.0 - step(0.5, abs(ipos.y - float(row)));
    float colMatch = 1.0 - step(0.5, abs(ipos.x - float(col)));
    return colMatch * rowMatch;
    
}

vec2 tifmk_truchetPattern(in vec2 st, in float index){
    index = fract(((index - 0.5) * 2.0));
    if (index > 0.75) {
        st = vec2(1.0) - st; 
    } else if (index > 0.5) {
        st = vec2(1.0 - st.x, st.y); 
        
    } else if (index > 0.25) {
        
        st = vec2(1.0 - st.y, st.x); 
    }
    return st;
}

#endif
#ifndef TIFMK_PERLIN_NOISE_GLSL
#define TIFMK_PERLIN_NOISE_GLSL

vec2 tifmk_fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

vec4 tifmk_permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }

float tifmk_cnoise(vec2 P){
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); 
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = tifmk_permute(tifmk_permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; 
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = tifmk_fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

#endif
#ifndef TIFMK_SHAPES_GLSL
#define TIFMK_SHAPES_GLSL

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif

#ifndef TWO_PI
#define TWO_PI 6.28318530718
#endif

#ifndef TIFMK_MATH_GLSL
#define TIFMK_MATH_GLSL

float tifmk_modulo(float a, float b) {
    
    
    return a - floor(a / b) * b;
}

#endif

float tifmk_plot(vec2 p, float pct) { 
    return  smoothstep(pct - 0.01, pct, p.y) -
    smoothstep(pct, pct + 0.01, p.y);
}

float tifmk_lineSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    
    
    
    
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0 );
    return smoothstep(0.0, 0.001, length(pa - ba * h));
}

float tifmk_circle(in vec2 p, in float radius) {
    vec2 dist = p - vec2(0.5);
    return 1. - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(dist, dist) * 4.0);
}

float tifmk_rectangle(in vec2 p, in vec2 size) {
    p = p * 2.0 - 1.0; 
    return step(0.01, 1.0 - max( abs(p.x / size.x), abs(p.y / size.y) ));
}

float tifmk_roundedRectangle(in vec2 p) {
    p = p * 2.0 - 1.0; 
    return 1.0 - step(0.1, length(max(abs(p)-.5, 0.0)));
}

float tifmk_flower(in vec2 p, in int sides) {
    vec2 pos = (vec2(0.5) - p) * 2.0; 

    float r = length(pos);
    float a = atan(pos.y,pos.x);

    float f;
    
    f = cos(a * float(sides));
    
    
    

    return 1. - smoothstep(f, f+0.02 , r);
}

float tifmk_polygon(in vec2 p, in int sides) {
    p = (vec2(0.5) - p) * 2.0; 
    float d = 0.0;
    float a = atan(p.y, p.x) + PI;
    float N = float(sides);
    float r = TWO_PI / N; 
    
    
    d = cos(floor(.5 + a/r) * r - a) * length(p);
    return 1.0 - smoothstep(.3, .31, d);
}

#endif

uniform int uShape;
uniform vec4 uVars;

varying vec2 vUv;

void main() {
    vec2 st = vUv;
    float y = st.x;
    if (uShape == 1) {
        y = (sin(st.x * (1.0 - uVars.x) * 20.0) + 1.0) / 2.0 * (1.0 - uVars.y);
    } else if (uShape == 2) {
        y = pow(st.x, (1.0 - uVars.x) * 5.0);
    } else if (uShape == 3) {
        float x = st.x + uVars.x;
        y = smoothstep(0.2 + uVars.y, 0.5 - uVars.y, x) - smoothstep(0.5 + uVars.y, 0.8 - uVars.y, x);
    } else if (uShape == 4) {
        y = mod(st.x / (1.0 - uVars.z) - uVars.y, 0.1 + uVars.x);
    } else if (uShape == 5) {
        y = ceil(st.x * (1.0 - uVars.x) * 10.0) / 10.0;
    } else if (uShape == 6) {
        y = sign((st.x - uVars.x) * 2.0 - 1.0) * (1.0 - uVars.y);
    } else if (uShape == 7) {
        y = abs((st.x - uVars.x) * 2.0 - 1.0) * (1.0 - uVars.y);
    } else if (uShape == 8 || uShape == 9 || uShape == 10 || uShape == 11) {
        st -= 0.5;
        st *= 2.0; 
        float xRange = uVars.x * 2.0 - 1.0;
        float yRange = uVars.y * 2.0 - 1.0;
        float zRange = uVars.z * 2.0 - 1.0;
        float wRange = uVars.w * 2.0 - 1.0;

        vec2 a = vec2(xRange, yRange);
        vec2 b = vec2(zRange, wRange);

        vec3 color = vec3(0.0);
        float h = 0.0;

        vec2 pa = st - a, ba = b - a;
        
        
        h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); 

        vec2 projection = ba * h; 
        vec2 segmentTo_pa = pa - projection; 
        float distanceToTheSegment = length(segmentTo_pa);
        float line = smoothstep(0.0, 0.001, distanceToTheSegment);
        if (uShape == 8) {
            color = vec3(fract(h));
        } else if (uShape == 9) {
            color = vec3(abs(segmentTo_pa), 0.0);
        } else if (uShape == 10) {
            color = vec3(distanceToTheSegment);
        } else if (uShape == 11) {
            color = vec3(line);
        } else {
            color = vec3(0.0); 
        }

        color = mix(vec3(1.0, 0.0, 0.0), color, smoothstep(0.01, 0.02, distance(a, st))); 
        color = mix(vec3(0.0, 1.0, 0.0), color, smoothstep(0.01, 0.02, distance(b, st))); 

        gl_FragColor = vec4(color, 1.0);
        st = st * 0.5 + 0.5; 
        return;
    } else if (uShape == 12) {
        float ax = uVars.x;
        float ay = uVars.y;
        float bx = uVars.z;
        float by = uVars.w;

        vec2 a = vec2(ax, ay);
        vec2 b = vec2(bx, by);

        float l = tifmk_cubicBezier(st.x, a, b);
        vec3 color = vec3(smoothstep(l, l+0.001, st.y));

        color = mix(vec3(0.5), color, tifmk_lineSegment(st, vec2(0.0), a));
        color = mix(vec3(0.5), color, tifmk_lineSegment(st, vec2(1.0), b));
        color = mix(vec3(0.5), color, tifmk_lineSegment(st, a, b));
        color = mix(vec3(1.0,0.0,0.0), color, smoothstep(0.01,0.011,distance(a, st)));
        color = mix(vec3(1.0,0.0,0.0), color, smoothstep(0.01,0.011,distance(b, st)));

        gl_FragColor = vec4(color, 1.0);

        return;
    } else if (uShape == 13) {
        vec3 color = vec3(0.0);

        vec2 size = vec2(0.2, 0.2);
        float r = tifmk_rectangle(st, size);

        color = vec3(r);
        gl_FragColor = vec4(color, 1.0);
        return;
    } else if (uShape == 14) {
        vec3 color = vec3(0.0);
        float f = tifmk_flower(st, int(uVars[0] * 10.0));
        color = vec3(f);
        gl_FragColor = vec4(color, 1.0);
        return;
    } else if (uShape == 15) {
        vec3 color = vec3(0.0);
        float f = tifmk_polygon(st, int(uVars[0] * 10.0));
        color = vec3(f);
        gl_FragColor = vec4(color, 1.0);
        return;
    } else {
        st = st * 2.0 - 1.0; 
        vec3 color = vec3(length(max(abs(st)-.5, 0.0)));
        gl_FragColor = vec4(color, 1.0);
        st = st * 0.5 + 0.5; 
        return;
    }

    float pct = tifmk_plot(st, y);
    vec3 color = vec3(y);
    color = (1.0 - pct) * color + pct * vec3(0.0, 1.0, 0.0);
    gl_FragColor = vec4(color, 1.0);
}`,f=r(),p=new e(10,10,1,1),m={uShape:{value:1},uVars:{value:new o(0,0,0,0)}},h=new t({vertexShader:u,fragmentShader:d,wireframe:!1,side:2,transparent:!1,uniforms:m});function g(){return(0,l.useEffect)(()=>{let e=new c,t={shape:m.uShape.value,vars:{x:m.uVars.value.x,y:m.uVars.value.y,z:m.uVars.value.z,w:m.uVars.value.w}};e.add(t,`shape`,1,30,1).name(`Shape`).onChange(e=>{m.uShape.value=e});let n=e.addFolder(`Vars`);return n.add(t.vars,`x`,0,1,.01).name(`X`).onChange(e=>{m.uVars.value.x=e}),n.add(t.vars,`y`,0,1,.01).name(`Y`).onChange(e=>{m.uVars.value.y=e}),n.add(t.vars,`z`,0,1,.01).name(`Z`).onChange(e=>{m.uVars.value.z=e}),n.add(t.vars,`w`,0,1,.01).name(`W`).onChange(e=>{m.uVars.value.w=e}),()=>{e.destroy()}},[]),(0,f.jsx)(a,{useCameraControls:!1,useTransformControls:!1,selectableChildren:(0,f.jsx)(`mesh`,{position:[0,0,0],name:`mesh`,geometry:p,material:h})})}function _(){return(0,f.jsx)(n,{orthographic:!0,cameraProps:{zoom:55},children:(0,f.jsx)(g,{})})}export{_ as default};