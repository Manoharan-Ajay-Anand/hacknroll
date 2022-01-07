#include <musgrave>
// #include <domain-warp>
#include <voronoi>
#include <metaballs>

varying float qnoise;
// varying float noise;

varying vec2 vUv;
uniform vec2 resolution;
uniform float scale;
uniform float time;
uniform bool redhell;
uniform float rcolor;
uniform float gcolor;
uniform float bcolor;
uniform sampler2D texture1;
// #define USE_DEFAULTS

#ifndef random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}
#endif


// Value noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH

#ifndef random
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}
#endif


mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float lines(in vec2 pos, float b){
    float scale = 10.0;
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*3.1415)+b*2.0))*.5);
}


vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


void main() {
    vec4 text_color = texture2D( texture1, vUv * scale / 2.);    //vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y )
    // gl_FragColor.w = 1.0;
    // gl_FragColor = text_color;
    // return;
    float r, g, b;
    // vec2 st = gl_FragCoord.xy / resolution.xy; ///u_resolution.xy;   // this is just screen UV
    vec2 st = vUv;
    vec3 color = vec3(0.0);
    vec2 m_pos = vec2(st.x  + time * 0.2,st.y);   //* vec2(10.,3.)
    vec2 pos = vec2(st.x  + time * 0.1,st.y);
    // vec2 pos = st.xy + time * 1.;
    // float noise = noise(st*3.0);
    // float fractal = fbm_2D(pos, 8, 12., 1., 0.5);
    // color += fractal;
    // color = vec3(mix(noise,fractal,abs(sin(time))));
    // color += fbm(pos, 8, 50., 2.2)

    // musgrave

    float m1 = fbm_2D(m_pos,8,150.,2.,0.002); //150.
    float m2 = fbm_2D(m_pos,8,30.,2.2,0.015);   //30.
    pos.y = m_pos.y + m1 + m2;
    // color += 

    // gl_FragColor = vec4(vec3(m1 + m2),1.0);
    // return;
    //
    color = voronoi(pos, 20.) - smoothVoronoi(pos, 20.);  //domain_warp   //metaballs   voronoi


    vec3 step1 = vec3(0.);
    vec3 step2 = vec3(0.06);
    vec3 step3 = vec3(0.074);

    vec3 firstColor = vec3(0,0,0);
    vec3 secondColor = vec3(0.543,0.789,0.815);  //0.086, 0.764, 1.   //0.042,0.347,0.451   //0.042,0.347,0.451   0.543,0.789,0.815  0.543,0.834,1.
    vec3 thirdColor = vec3(0.087, 0.665, 1.);//vec3(1.,1.,1.);  0.087, 0.665, 1.

    color = mix(firstColor, secondColor, smoothstep(step1, step2, color));
    color = mix(color, thirdColor, smoothstep(step2, step3, color));

    vec4 color4 = vec4(color,1.0);

    vec3 fac = mix(color, vec3(1.0) - color, 1.0);//rgb2hsv();
    float lumi = dot(fac, vec3(0.05, 1., 1.));   //0.299, 0.587, 0.114     0.2126, 0.7152, 0.0722
    vec4 emi_color = color4 * 0.75;
    vec4 trans_col = vec4(0.);

    color4 = mix(emi_color,trans_col,lumi);


    gl_FragColor = color4 + text_color;//mix(color4,text_color,0.75);//vec4(lumi);//vec4(color, 1.0);
    // gl_FragColor = gl_FragColor * texture2D( map,vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );
    // float pattern = pos.x;
    // pos = rotate2d( noise(pos) ) * pos;
    // pattern = lines(pos,.5);
    // gl_FragColor = vec4(vec3(pattern), 1.0);
    // if (!redhell == true) {
    //     r = sin(qnoise * scale + rcolor);
    //     g = normalize(qnoise * scale + (gcolor / 2.0));
    //     b = tan(qnoise * scale + bcolor);
    // } else {
    //     r = normalize(qnoise * scale + rcolor);
    //     g = cos(qnoise * scale + gcolor);
    //     b = sin(qnoise * scale + bcolor);
    // }
    // gl_FragColor = vec4(r, g, b, 1.0);
}