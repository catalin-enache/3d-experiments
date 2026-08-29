import{Et as e,T as t,Wt as n,a as r,an as i,cn as a,d as o,kt as s,ln as c,m as l,n as u,p as d,r as f,rn as p}from"./index-CzKUGHpr.js";var m=c(a(),1),h=`uniform vec2 uResolution;

varying vec2 vUv;
varying vec2 vResolution;

void main() {
     gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
     vUv = uv;
     vResolution = uResolution;
}`,g=`#ifndef PI
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
#ifndef TIFMK_TRANSFORMATIONS_GLSL
#define TIFMK_TRANSFORMATIONS_GLSL

mat2 tifmk_getRotate2dMat(float angle){
    float c = cos(angle);
    float s = sin(angle);
    
    return mat2(c, s, -s, c);
    

}

mat2 tifmk_getScale2dMat(vec2 scale){
    return mat2(scale.x, 0.0, 0.0, scale.y);
}

vec2 tifmk_rotate2D(vec2 st, float rotation, vec2 center) {
    
    st -= center; 
    
    
    
    
    mat2 rot = tifmk_getRotate2dMat(rotation);
    st = rot * st;
    
    
    
    st += center; 
    return st;
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
#ifndef TIFMK_COLOR_GLSL
#define TIFMK_COLOR_GLSL

vec3 tifmk_palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b * cos( 6.283185 * (c * t + d) );
}

#endif
#ifndef TIFMK_RANDOM_SCALE
#define TIFMK_RANDOM_SCALE vec4(443.897, 441.423, 0.0973, 0.1099)
#endif

#ifndef TIFMK_RANDOM_GLSL
#define TIFMK_RANDOM_GLSL

float tifmk_random (in float x) {
    return fract(sin(x) * 1e4);
}

float tifmk_random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 tifmk_random2(vec2 st){
    st = vec2( dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)) );
    return fract(sin(st) * 43758.5453123);
}

vec3 tifmk_random3(vec3 p) {
    p = fract(p * TIFMK_RANDOM_SCALE.xyz);
    p += dot(p, p.yxz + 19.19);
    return fract((p.xxy + p.yzz) * p.zyx);
}

vec3 tifmk_random3( vec2 p ) {
    vec3 q = vec3( dot(p,vec2(127.1,311.7)),
    dot(p,vec2(269.5,183.3)),
    dot(p,vec2(419.2,371.9)) );
    return fract(sin(q)*43758.5453);
}

#endif

#ifndef TIFMK_VORONOI_GLSL
#define TIFMK_VORONOI_GLSL

struct VoronoiResult {
    vec2 point; 
    float dist; 
};

VoronoiResult tifmk_voronoi(vec2 st, float uTime) {
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    float m_dist = 8.; 
    vec2 m_point = vec2(0.0);
    vec2 m_diff;

    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = tifmk_random2(i_st + neighbor);
            
            point = sin(uTime + point * TWO_PI) / 2.0 + 0.5;
            
            vec2 diff = neighbor + point - f_st; 
            
            float dist = dot(diff, diff); 
            if (dist < m_dist) {
                m_dist = dist;
                m_point = point;
                m_diff = diff;
            }
        }
    }

    m_dist = sqrt(m_dist); 

    VoronoiResult result;
    result.point = m_point;
    result.dist = m_dist;
    return result;
}

VoronoiResult tifmk_voronoi_metaball(vec2 st, float uTime) {
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    float m_dist = 1.; 
    vec2 m_point = vec2(0.0);

    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = tifmk_random2(i_st + neighbor);
            
            point = sin(uTime + point * TWO_PI) / 2.0 + 0.5;
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);
            
            
            
            
            
            if (dist * m_dist < m_dist) {
                m_dist = dist * m_dist;
                m_point = point;
            }
        }
    }

    VoronoiResult result;
    result.point = m_point;
    result.dist = m_dist;
    return result;
}

VoronoiResult tifmk_voronoi_borders(vec2 st, float uTime) {
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    vec2 m_point = vec2(0.0);
    vec2 m_neighbour = vec2(0.0);
    vec2 m_diff = vec2(0.0);

    float m_dist = 8.;

    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = tifmk_random2(i_st + neighbor);
            
            point = sin(uTime + point * TWO_PI) / 2.0 + 0.5;
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);
            if (dist < m_dist) {
                m_dist = dist;
                m_neighbour = neighbor;
                m_diff = diff;
            }
        }
    }

    m_dist = 8.;
    
    for (int x = -2; x <= 2; x++) {
        for (int y = -2; y <= 2; y++) {
            vec2 neighbor = m_neighbour + vec2(float(x), float(y));
            vec2 point = tifmk_random2(i_st + neighbor);
            
            point = sin(uTime + point * TWO_PI) / 2.0 + 0.5;
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);
            if (dot(m_diff - diff, m_diff - diff) > 0.00001) {
                m_dist = min(m_dist, dot( 0.5*(m_diff + diff), normalize(diff - m_diff) ));
            }
        }
    }

    VoronoiResult result;
    result.point = m_diff; 
    result.dist = m_dist;
    return result;
}

VoronoiResult tifmk_voronoi(vec2 st) {
    return tifmk_voronoi(st, 0.0);
}

VoronoiResult tifmk_voronoi_metaball(vec2 st) {
    return tifmk_voronoi_metaball(st, 0.0);
}

VoronoiResult tifmk_voronoi_borders(vec2 st) {
    return tifmk_voronoi_borders(st, 0.0);
}

#endif
#ifndef TIFMK_RANDOM_SCALE
#define TIFMK_RANDOM_SCALE vec4(443.897, 441.423, 0.0973, 0.1099)
#endif

#ifndef TIFMK_RANDOM_GLSL
#define TIFMK_RANDOM_GLSL

float tifmk_random (in float x) {
    return fract(sin(x) * 1e4);
}

float tifmk_random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 tifmk_random2(vec2 st){
    st = vec2( dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)) );
    return fract(sin(st) * 43758.5453123);
}

vec3 tifmk_random3(vec3 p) {
    p = fract(p * TIFMK_RANDOM_SCALE.xyz);
    p += dot(p, p.yxz + 19.19);
    return fract((p.xxy + p.yzz) * p.zyx);
}

vec3 tifmk_random3( vec2 p ) {
    vec3 q = vec3( dot(p,vec2(127.1,311.7)),
    dot(p,vec2(269.5,183.3)),
    dot(p,vec2(419.2,371.9)) );
    return fract(sin(q)*43758.5453);
}

#endif

#ifndef TIFMK_WORLEY_JITTER
#define TIFMK_WORLEY_JITTER 1.0
#endif

#ifndef TIFMK_WORLEY_GLSL
#define TIFMK_WORLEY_GLSL

vec2 tifmk_worley2(vec2 p){
    vec2 n = floor( p );
    vec2 f = fract( p );

    float distF1 = 1.0;
    float distF2 = 1.0;
    vec2 off1 = vec2(0.0);
    vec2 pos1 = vec2(0.0);
    vec2 off2 = vec2(0.0);
    vec2 pos2 = vec2(0.0);
    for( int j= -1; j <= 1; j++ ) {
        for( int i=-1; i <= 1; i++ ) {
            vec2  g = vec2(i,j);
            vec2  o = tifmk_random2( n + g ) * TIFMK_WORLEY_JITTER;
            vec2  p = g + o;
            float d = distance(p, f);
            if (d < distF1) {
                distF2 = distF1;
                distF1 = d;
                off2 = off1;
                off1 = g;
                pos2 = pos1;
                pos1 = p;
            }
            else if (d < distF2) {
                distF2 = d;
                off2 = g;
                pos2 = p;
            }
        }
    }

    return vec2(distF1, distF2);
}

vec2 tifmk_worley2(vec3 p) {
    vec3 n = floor( p );
    vec3 f = fract( p );

    float distF1 = 1.0;
    float distF2 = 1.0;
    vec3 off1 = vec3(0.0);
    vec3 pos1 = vec3(0.0);
    vec3 off2 = vec3(0.0);
    vec3 pos2 = vec3(0.0);
    for( int k = -1; k <= 1; k++ ) {
        for( int j= -1; j <= 1; j++ ) {
            for( int i=-1; i <= 1; i++ ) {
                vec3  g = vec3(i,j,k);
                vec3  o = tifmk_random3( n + g ) * TIFMK_WORLEY_JITTER;
                vec3  p = g + o;
                float d = distance(p, f);
                if (d < distF1) {
                    distF2 = distF1;
                    distF1 = d;
                    off2 = off1;
                    off1 = g;
                    pos2 = pos1;
                    pos1 = p;
                }
                else if (d < distF2) {
                    distF2 = d;
                    off2 = g;
                    pos2 = p;
                }
            }
        }
    }

    return vec2(distF1, distF2);
}

#endif
#ifndef TIFMK_RANDOM_SCALE
#define TIFMK_RANDOM_SCALE vec4(443.897, 441.423, 0.0973, 0.1099)
#endif

#ifndef TIFMK_RANDOM_GLSL
#define TIFMK_RANDOM_GLSL

float tifmk_random (in float x) {
    return fract(sin(x) * 1e4);
}

float tifmk_random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 tifmk_random2(vec2 st){
    st = vec2( dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)) );
    return fract(sin(st) * 43758.5453123);
}

vec3 tifmk_random3(vec3 p) {
    p = fract(p * TIFMK_RANDOM_SCALE.xyz);
    p += dot(p, p.yxz + 19.19);
    return fract((p.xxy + p.yzz) * p.zyx);
}

vec3 tifmk_random3( vec2 p ) {
    vec3 q = vec3( dot(p,vec2(127.1,311.7)),
    dot(p,vec2(269.5,183.3)),
    dot(p,vec2(419.2,371.9)) );
    return fract(sin(q)*43758.5453);
}

#endif

#ifndef TIFMK_IQ_NOISE_GLSL
#define TIFMK_IQ_NOISE_GLSL

float tifmk_iqnoise( in vec2 x, float u, float v ) {
    vec2 p = floor(x);
    vec2 f = fract(x);

    float k = 1.0+63.0*pow(1.0-v,4.0);

    float va = 0.0;
    float wt = 0.0;
    for (int j=-2; j<=2; j++) {
        for (int i=-2; i<=2; i++) {
            vec2 g = vec2(float(i),float(j));
            vec3 o = tifmk_random3(p + g)*vec3(u,u,1.0);
            vec2 r = g - f + o.xy;
            float d = dot(r,r);
            float ww = pow( 1.0-smoothstep(0.0,1.414,sqrt(d)), k );
            va += o.z*ww;
            wt += ww;
        }
    }

    return va/wt;
}

#endif
#ifndef EIGHTH_PI
#define EIGHTH_PI 0.39269908169
#endif
#ifndef QTR_PI
#define QTR_PI 0.78539816339
#endif
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966192313216916398
#endif
#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif
#ifndef TAU
#define TAU 6.2831853071795864769252867665590
#endif
#ifndef INV_PI
#define INV_PI 0.31830988618379067153776752674503
#endif
#ifndef INV_SQRT_TAU
#define INV_SQRT_TAU 0.39894228040143267793994605993439  
#endif
#ifndef SQRT_HALF_PI
#define SQRT_HALF_PI 1.25331413732
#endif
#ifndef PHI
#define PHI 1.618033988749894848204586834
#endif
#ifndef EPSILON
#define EPSILON 0.0000001
#endif
#ifndef GOLDEN_RATIO
#define GOLDEN_RATIO 1.6180339887
#endif
#ifndef GOLDEN_RATIO_CONJUGATE 
#define GOLDEN_RATIO_CONJUGATE 0.61803398875
#endif
#ifndef GOLDEN_ANGLE 
#define GOLDEN_ANGLE 2.39996323
#endif
#ifndef DEG2RAD
#define DEG2RAD (PI / 180.0)
#endif
#ifndef RAD2DEG
#define RAD2DEG (180.0 / PI)
#endif
#ifndef RANDOM_SCALE
#ifdef RANDOM_HIGHER_RANGE
#define RANDOM_SCALE vec4(.1031, .1030, .0973, .1099)
#else
#define RANDOM_SCALE vec4(443.897, 441.423, .0973, .1099)
#endif
#endif

#ifndef FNC_RANDOM
#define FNC_RANDOM
float random(in float x) {
#ifdef RANDOM_SINLESS
    x = fract(x * RANDOM_SCALE.x);
    x *= x + 33.33;
    x *= x + x;
    return fract(x);
#else
    return fract(sin(x) * 43758.5453);
#endif
}

float random(in vec2 st) {
#ifdef RANDOM_SINLESS
    vec3 p3  = fract(vec3(st.xyx) * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
#else
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
#endif
}

float random(in vec3 pos) {
#ifdef RANDOM_SINLESS
    pos  = fract(pos * RANDOM_SCALE.xyz);
    pos += dot(pos, pos.zyx + 31.32);
    return fract((pos.x + pos.y) * pos.z);
#else
    return fract(sin(dot(pos.xyz, vec3(70.9898, 78.233, 32.4355))) * 43758.5453123);
#endif
}

float random(in vec4 pos) {
#ifdef RANDOM_SINLESS
    pos = fract(pos * RANDOM_SCALE);
    pos += dot(pos, pos.wzxy + 33.33);
    return fract((pos.x + pos.y) * (pos.z + pos.w));
#else
    float dot_product = dot(pos, vec4(12.9898,78.233,45.164,94.673));
    return fract(sin(dot_product) * 43758.5453);
#endif
}

vec2 random2(float p) {
    vec3 p3 = fract(vec3(p) * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xx + p3.yz) * p3.zy);
}

vec2 random2(vec2 p) {
    vec3 p3 = fract(p.xyx * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xx + p3.yz) * p3.zy);
}

vec2 random2(vec3 p3) {
    p3 = fract(p3 * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xx + p3.yz) * p3.zy);
}

vec3 random3(float p) {
    vec3 p3 = fract(vec3(p) * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xxy + p3.yzz) * p3.zyx); 
}

vec3 random3(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yxz + 19.19);
    return fract((p3.xxy + p3.yzz) * p3.zyx);
}

vec3 random3(vec3 p) {
    p = fract(p * RANDOM_SCALE.xyz);
    p += dot(p, p.yxz + 19.19);
    return fract((p.xxy + p.yzz) * p.zyx);
}

vec4 random4(float p) {
    vec4 p4 = fract(p * RANDOM_SCALE);
    p4 += dot(p4, p4.wzxy + 19.19);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);   
}

vec4 random4(vec2 p) {
    vec4 p4 = fract(p.xyxy * RANDOM_SCALE);
    p4 += dot(p4, p4.wzxy + 19.19);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}

vec4 random4(vec3 p) {
    vec4 p4 = fract(p.xyzx * RANDOM_SCALE);
    p4 += dot(p4, p4.wzxy + 19.19);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}

vec4 random4(vec4 p4) {
    p4 = fract(p4  * RANDOM_SCALE);
    p4 += dot(p4, p4.wzxy + 19.19);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}
#endif

#ifndef VORONOI_RANDOM_FNC 
#define VORONOI_RANDOM_FNC(UV) ( 0.5 + 0.5 * sin(time + TAU * random2(UV) ) ); 
#endif

#ifndef FNC_VORONOI
#define FNC_VORONOI
vec3 voronoi(vec2 uv, float time) {
    vec2 i_uv = floor(uv);
    vec2 f_uv = fract(uv);
    vec3 rta = vec3(0.0, 0.0, 10.0);
    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 neighbor = vec2(float(i),float(j));
            vec2 point = VORONOI_RANDOM_FNC(i_uv + neighbor);
            point = 0.5 + 0.5 * sin(time + TAU * point);
            vec2 diff = neighbor + point - f_uv;
            float dist = length(diff);
            if ( dist < rta.z ) {
                rta.xy = point;
                rta.z = dist;
            }
        }
    }
    return rta;
}

vec3 voronoi(vec2 p)  { return voronoi(p, 0.0); }
vec3 voronoi(vec3 p)  { return voronoi(p.xy, p.z); }
#endif

uniform int uPattern;
uniform vec4 uVars;
uniform float uTime;

varying vec2 vUv;
varying vec2 vResolution;

void main() {
    if (uPattern == 1) {
        vec2 st = vec2(vUv.x, vUv.y + vUv.x * uVars.x * 2.0);
        float steps = 10.0 + floor(uVars.y * 10.0);
        gl_FragColor = vec4(vec3(mod(st.y * steps, 1.0)), 1.0);
    } else if (uPattern == 2) {
        gl_FragColor = vec4(vec3(step(0.5, mod(vUv.y * 10.0, 1.0))), 1.0);
    }  else if (uPattern == 3) {
        gl_FragColor = vec4(vec3(step(0.9, mod((vUv.y) * 10.0, 1.0))) + vec3(step(0.9, mod((vUv.x) * 10.0, 1.0))), 1.0);
    } else if (uPattern == 4) {
        gl_FragColor = vec4(vec3(step(0.9, mod((vUv.y) * 10.0, 1.0))) * vec3(step(0.9, mod((vUv.x) * 10.0, 1.0))), 1.0);
    } else if (uPattern == 5) {
        vec3 barX = vec3(step(0.9, mod((vUv.y) * 10.0, 1.0))) * vec3(step(0.4, mod((vUv.x) * 10.0, 1.0)));
        vec3 barY = vec3(step(0.9, mod((vUv.x) * 10.0, 1.0))) * vec3(step(0.4, mod((vUv.y) * 10.0, 1.0)));
        gl_FragColor = vec4(barX + barY, 1.0);
    } else if (uPattern == 6) {
        float offsetStrength = uVars.x == 0.0 ? 1.0 : uVars.x * 2.0;
        float barX = step(0.4, mod(vUv.x * 10.0 - 0.2 * offsetStrength, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
        float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0 - 0.2 * offsetStrength, 1.0));
        float strength = barX + barY;
        gl_FragColor = vec4(vec3(strength), 1.0);
    } else if (uPattern == 7) {
        gl_FragColor = vec4(abs(0.5 - vec3(vUv.x)) * 2.0 ,1.0);
    } else if (uPattern == 8) {
        gl_FragColor = vec4(min(abs(0.5 - vec3(vUv.x)), abs(0.5 - vec3(vUv.y))), 1.0);
    } else if (uPattern == 9) {
        gl_FragColor = vec4(max(abs(0.5 - vec3(vUv.x)), abs(0.5 - vec3(vUv.y))), 1.0);
    } else if (uPattern == 10) {
        gl_FragColor = vec4(step(0.25, max(abs(0.5 - vec3(vUv.x)), abs(0.5 - vec3(vUv.y)))), 1.0);
    } else if (uPattern == 11) {
        vec3 square_1 = vec3(step(0.25, max(abs(0.5 - vec3(vUv.x)), abs(0.5 - vec3(vUv.y)))));
        vec3 square_2 = 1.0 - vec3(step(0.30, max(abs(0.5 - vec3(vUv.x)), abs(0.5 - vec3(vUv.y)))));
        gl_FragColor = vec4(square_1 * square_2, 1.0);
    } else if (uPattern == 12) {
        gl_FragColor = vec4(vec3(floor(vUv.y * 10.0) / 10.0), 1.0);
    } else if (uPattern == 13) {
        gl_FragColor = vec4(vec3(floor(vUv.y * 10.0) / 10.0 * floor(vUv.x * 10.0) / 10.0), 1.0);
    } else if (uPattern == 14) {
        gl_FragColor = vec4(vec3(tifmk_random(vUv.xy)), 1.0);
    } else if (uPattern == 15) {
        vec2 st = vUv.xy * 10.0;

        vec2 ipos = floor(st); 
        vec2 fpos = fract(st); 
        float rnd = tifmk_random(ipos);

        float col = 3.0;
        float row = 2.0;
        float cellMatch1 = tifmk_selectGridCell(st, int(floor(uVars.x * 10.0)), int(floor(uVars.x * 10.0)));
        float cellMatch2 = tifmk_selectGridCell(st, int(floor(uVars.y * 10.0)), int(floor(uVars.y * 10.0)));

        float circ = tifmk_circle(fpos, 0.3);

        vec3 bgColor = vec3(rnd);
        vec3 cellColor = vec3(0.2, 1.0, 0.2);

        float mask = circ * cellMatch1 + circ * cellMatch2;

        gl_FragColor = vec4(mix(bgColor, cellColor, mask), 1.0);

    } else if (uPattern == 16) {
        vec2 st = vUv.xy * 10.0;

        vec2 ipos = floor(st); 
        vec2 fpos = fract(st); 
        float rnd = tifmk_random(ipos);

        float color = 0.0;

        vec2 tile = tifmk_truchetPattern(fpos, rnd);

        if (floor(uVars.x * 10.0) == 0.0) {
            
            color = smoothstep(tile.x - 0.3, tile.x, tile.y) -
            smoothstep(tile.x, tile.x + 0.3, tile.y);
        } else if (floor(uVars.x * 10.0) == 1.0) {
            
            color = (step(length(tile), 0.6) - step(length(tile), 0.4)) +
                    (step(length(tile - vec2(1.)), 0.6) - step(length(tile - vec2(1.)), 0.4));
        } else {
            
            color = step(tile.x, tile.y);
        }

        gl_FragColor = vec4(vec3(color), 1.0);

    } else if (uPattern == 17) {
        gl_FragColor = vec4(1.0 - vec3(distance(vUv, vec2(uVars.x, uVars.y))), 1.0);
    } else if (uPattern == 18) {
        gl_FragColor = vec4(0.01 / vec3(distance(vUv, vec2(uVars.x, uVars.y))), 1.0);
    } else if (uPattern == 19) {
        vec2 vUvRot = tifmk_rotate2D(vUv, 2.0 * PI * uVars.x, vec2(0.5));
        float stretch = uVars.y == 0.0 ? 0.2 : (1.0 - uVars.y);
        float lightX = 0.01 / distance(vec2(vUvRot.x * stretch, vUvRot.y), vec2(0.5 * stretch, 0.5));
        float lightY = 0.01 / distance(vec2(vUvRot.x , vUvRot.y * stretch), vec2(0.5, 0.5 * stretch));
        gl_FragColor = vec4(vec3(lightX * lightY), 1.0);
    } else if (uPattern == 20) {
        vec2 wavedUv = vec2(
            vUv.x + sin(vUv.y * 30.0) * uVars.z,
            vUv.y + sin(vUv.x * 30.0) * uVars.z
        );
        float d = abs(distance(wavedUv, vec2(0.5)) - uVars.x);
        if (uVars.y * 10.0 > 1.0) {
            d = step(0.01, d);
        }
        gl_FragColor = vec4(vec3(d), 1.0);
    } else if (uPattern == 21) {
        float angle = atan(vUv.y - uVars.y, vUv.x - uVars.x) / (PI * 2.0) + 0.5;
        float angles = mod(angle * (uVars.z * 10.0 + 1.0), 1.0);
        gl_FragColor = vec4(vec3(angles), 1.0);
    } else if (uPattern == 22) {
        float angle = atan(vUv.y - 0.5, vUv.x - 0.5) / (PI * 2.0) + 0.5;
        float wave = sin(angle * (1.0 + uVars.x * 50.0));
        gl_FragColor = vec4(vec3(wave), 1.0);
    } else if (uPattern == 23) {
        float angle = atan(vUv.y - 0.5, vUv.x - 0.5) / (PI * 2.0) + 0.5;
        float sinusoid = sin(angle * (1.0 + uVars.y * 100.0));
        float radius = 0.25;

        if (floor(uVars.x * 10.0) < 1.0) {
            radius *= sinusoid;
        } else {
            radius += sinusoid / 50.0;
        }

        float d = abs(distance(vUv, vec2(0.5)) - radius);
        float circle = 1.0 - step(0.01, d);

        gl_FragColor = vec4(vec3(circle), 1.0);
    } else if (uPattern == 24) {
        float pNoise = tifmk_cnoise(vUv * (1.0 + uVars.x * 100.0));
        gl_FragColor = vec4(vec3(pNoise), 1.0);
    } else if (uPattern == 25) {
        float pNoise = step(0.1, tifmk_cnoise(vUv * (1.0 + uVars.x * 100.0)));
        gl_FragColor = vec4(vec3(pNoise), 1.0);
    } else if (uPattern == 26) {
        float pNoise = sin(tifmk_cnoise(vUv * (1.0 + uVars.x * 100.0)) * 20.0);
        gl_FragColor = vec4(vec3(pNoise), 1.0);
    } else if (uPattern == 27) {
        vec2 uv = vUv;
        uv = tifmk_rotate2D(uv, uVars.x * PI * 2.0, vec2(0.5, 0.5));
        uv *= vec2(3.0, 3.0);
        float isOddRow = step(1.0, mod(uv.y, 2.0)); 
        uv.x += uVars.z * isOddRow; 
        vec2 tile = fract(uv);
        ivec2 cell = ivec2(1, 1);
        float cellMatch = tifmk_selectGridCell(uv, cell.y, cell.x); 

        tile -= 0.5;
        float d = length(tile);
        vec2 dir = (d > 0.0) ? tile / d : vec2(0.0); 
        tile -= dir * ((1.0 - d) * 0.1);
        tile += 0.5;
        tile = tifmk_rotate2D(tile, uVars.y * PI * 2.0, vec2(0.5)); 
        float shape = tifmk_rectangle(tile, vec2(0.3, 0.2)); 
        tile = tifmk_rotate2D(tile, -uVars.y * PI * 2.0, vec2(0.5)); 

        float mask =  shape * cellMatch;

        gl_FragColor = vec4(mix(vec3(tile, 0.0), vec3(1.0,1.0,0.0), mask), 1.0);
    } else if (uPattern == 28) {
        
        vec2 st = vUv;
        vec2 v = (uVars.xy - vec2(0.5)) * 2.0;
        st = (st - vec2(0.5)) * 2.0;
        float circle = 1.0 - step(0.1, length(st - v));
        float f = dot(v, st - v) * 2.0; 
        float draw = circle + f;
        gl_FragColor = vec4(vec3(draw), 1.0);
    } else if (uPattern == 29) {
        
        vec2 st = vUv;

        vec2 f = fract(st);
        vec2 u = f*f*(3.0-2.0*f);

        float f0 = dot(vec2(1.0, 1.0), f - vec2(0.0, 0.0));
        float f1 = dot(vec2(0.0, 1.0), f - vec2(1.0, 0.0));
        float f2 = dot(vec2(1.0, 0.0), f - vec2(0.0, 1.0));
        float f3 = dot(vec2(0.0, 0.0), f - vec2(1.0, 1.0));

        vec2 rand = vec2(floor(uVars.x * 20.0), floor(uVars.y * 20.0));

        f0 = dot(tifmk_random2(rand + vec2(0.0,0.0) ), f - vec2(0.0,0.0));
        f1 = dot(tifmk_random2(rand + vec2(1.0,0.0) ), f - vec2(1.0,0.0));
        f2 = dot(tifmk_random2(rand + vec2(0.0,1.0) ), f - vec2(0.0,1.0));
        f3 = dot(tifmk_random2(rand + vec2(1.0,1.0) ), f - vec2(1.0,1.0));

        float m = mix(mix(f0, f1, u.x), mix(f2, f3, u.x), u.y) * 2.0;

        gl_FragColor = vec4(vec3(m), 1.0);

    }
    else if (uPattern == 30) {
        
        vec2 uv = vUv;
        uv = (uv - vec2(0.5)) * 2.0; 
        vec2 uv0 = uv;
        float d;
        vec3 finalColor = vec3(0.0);
        vec2 tile = uv;

        for (float i = 0.0; i < 4.0; i++) {
            tile *= 1.5;
            tile = fract(tile);
            tile = (tile - vec2(0.5));

            d = length(tile) * exp(-length(uv0));
            vec3 col = tifmk_palette(
                length(uv0) + i*.4 + uTime/4.,
                vec3(0.5, 0.5, 0.5),
                vec3(0.5, 0.5, 0.5),
                vec3(1.0, 1.0, 1.0),
                vec3(0.263, 0.416, 0.557)
            );

            d = sin(d * 8. + uTime)/8.;
            d = abs(d);

            d = pow(0.01 / d, 1.2); 

            finalColor += col * d;
        }

        gl_FragColor = vec4(finalColor, 1.0);

    } else if (uPattern == 31) {
        vec2 st = vUv;
        vec3 color = vec3(0.0);

        st *= 3.;

        vec2 i_st = floor(st);
        vec2 f_st = fract(st);

        
        VoronoiResult voronoiResult = tifmk_voronoi(st, uTime * .5);
        float m_dist = voronoiResult.dist;
        vec2 m_point = voronoiResult.point;

        color += dot(m_point, vec2(.3, .6)); 
        
        color.rb *= step(0.02, m_dist); 

        
        color.r += step(0.98, f_st.x) + step(0.98, f_st.y);

        gl_FragColor = vec4(color, 1.0);

    } else if (uPattern == 32) {
        vec2 st = vUv;
        vec3 color = vec3(0.0);

        st *= 3.;

        vec2 i_st = floor(st);
        vec2 f_st = fract(st);

        VoronoiResult voronoiResult = tifmk_voronoi_metaball(st, uTime * .5);
        float m_dist = voronoiResult.dist;
        vec2 m_point = voronoiResult.point;

        
        color += step(0.06, m_dist);

        gl_FragColor = vec4(color, 1.0);

    } else if (uPattern == 33) {
        vec4 color = vec4(vec3(0.0), 1.0);
        vec2 st = vUv;

        
        vec3 d2 = voronoi(vec2(st * 5. + uTime));
        vec3 d3 = voronoi(vec3(st * 5., uTime));

        color.rgb += mix(d2, d3, step(0.5, st.x));

        gl_FragColor = color;

    } else if (uPattern == 34 || uPattern == 35 || uPattern == 36 || uPattern == 37) {
        vec4 color = vec4(vec3(0.0), 1.0);
        vec2 st = vUv;

        
        vec2 d2 = tifmk_worley2(vec2(st*10.0 + uTime));
        vec2 d3 = tifmk_worley2(vec3(st*10.0, uTime));

        if (uPattern == 34) {
            
            color += mix(d2.x, d3.x, step(0.5, st.x));
        } else if (uPattern == 35) {
            
            color += mix(d2.y, d3.y, step(0.5, st.x));
        } else if (uPattern == 36) {
            
            color += mix(d2.y, d3.y, step(0.5, st.x));
            color -= mix(d2.x, d3.x, step(0.5, st.x));
        } else if (uPattern == 37) {
            
            color += mix(d2.y * d2.x, d3.y * d3.x, step(0.5, st.x));
        }

        gl_FragColor = color;

    }  else if (uPattern == 38) {
        vec2 st = vUv * 10.;
        vec3 color = vec3(0.0);
        VoronoiResult voronoiResult = tifmk_voronoi_borders(st, uTime * .5);
        color += voronoiResult.dist;
        color += 1. - smoothstep(0.01, 0.02, voronoiResult.dist); 
        color += 1. - smoothstep(0.05, 0.06, length(voronoiResult.point)); 

        gl_FragColor = vec4(color, 1.0);

    } else if (uPattern == 39) {
        vec2 st = vUv * 10.;
        vec3 color = vec3(0.0);
        float d = tifmk_iqnoise(st, uVars.x, uVars.y);

        gl_FragColor = vec4(vec3(d), 1.0);

    } else {
        gl_FragColor = vec4(vUv, 0.0, 1.0);
    }

}`,_=l(),v=new s(10,10,1,1);function y(){let{scene:r,camera:a,size:s}=d(),{material:c,uniforms:l}=(0,m.useMemo)(()=>{let e={uPattern:{value:1},uVars:{value:new i(0,0,0,0)},uTime:{value:0},uResolution:{value:new p(1,1)}};return{material:new n({vertexShader:h,fragmentShader:g,wireframe:!1,side:2,transparent:!1,uniforms:e}),uniforms:e}},[]);return(0,m.useEffect)(()=>{let e=new u({title:`Shader Patterns UV`});e.addBinding(l.uPattern,`value`,{label:`Pattern`,min:1,max:40,step:1});let t=e.addFolder({title:`Vars`});return t.addBinding(l.uVars.value,`x`,{label:`X`,min:0,max:1,step:.01}),t.addBinding(l.uVars.value,`y`,{label:`Y`,min:0,max:1,step:.01}),t.addBinding(l.uVars.value,`z`,{label:`Z`,min:0,max:1,step:.01}),t.addBinding(l.uVars.value,`w`,{label:`W`,min:0,max:1,step:.01}),()=>{e.dispose()}},[l]),(0,m.useEffect)(()=>{l.uResolution.value.set(s.width,s.height)},[s,l]),(0,m.useEffect)(()=>(r.background=new t(0),()=>{r.background=null}),[r]),(0,m.useEffect)(()=>{a.position.set(0,0,9),a.rotation.set(0,0,0),a instanceof e&&(a.zoom=65,a.updateProjectionMatrix())},[a]),o(({clock:e})=>{l.uTime.value=e.elapsedTime}),(0,m.useEffect)(()=>()=>{c.dispose()},[c]),(0,_.jsx)(f,{useCameraControls:!1,unselectableChildren:(0,_.jsx)(`mesh`,{position:[0,0,0],name:`mesh`,geometry:v,material:c})})}function b(){return(0,_.jsx)(r,{orthographic:!0,cameraProps:{zoom:55},children:(0,_.jsx)(y,{})})}export{b as default};