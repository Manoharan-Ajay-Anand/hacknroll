// #include <noise_utils>
#include <classicnoise2D>

//   // Classic Perlin noise, periodic variant
// float pnoise(vec2 P, vec2 rep)
//   {
//     vec2 Pi0 = mod(floor(P), rep); // Integer part, modulo period
//     vec2 Pi1 = mod(Pi0 + vec2(1.0), rep); // Integer part + 1, mod period
//     Pi0 = mod289(Pi0);
//     Pi1 = mod289(Pi1);
//     vec2 Pf0 = fract(P); // Fractional part for interpolation
//     vec2 Pf1 = Pf0 - vec2(1.0); // Fractional part - 1.0
//     vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);    //Gets a unique corner coordinate to be passed to permute function
//     vec4 iy = vec4(Pi0.yy, Pi1.yy);

//     vec4 ixy = permute(permute(ix) + iy);

//     vec4 gx0 = ixy * (1.0 / 5.0);
//     vec4 gy0 = fract(floor(gx0) * (1.0 / 5.0)) - 0.5;
//     gx0 = fract(gx0);

//     vec2 g00 = vec2(gx0.x,gy0.x);
//     vec2 g10 = vec2(gx0.y,gy0.y);
//     vec2 g01 = vec2(gx0.z,gy0.z);
//     vec2 g11 = vec2(gx0.w,gy0.w);

//     float inf00 = dot(g00, Pf0);
//     float inf10 = dot(g10, vec2(Pf1.x, Pf0.y));
//     float inf01 = dot(g01, vec2(Pf0.x, Pf1.y));
//     float inf11 = dot(g11, Pf1);

//     vec2 fade_xy = fade(Pf0);
//     vec2 lerp_x = mix(vec2(inf00,inf01),vec2(inf10,inf11), fade_xy);
//     float lerp_final = mix(lerp_x.x,lerp_x.y, fade_xy.y);
//     return 1.5 * lerp_final;
// }



  // Turbulence By Jaume Sanchez => https://codepen.io/spite/
  
  varying vec2 vUv;
  varying float noise;
  varying float qnoise;
  varying float displacement;
  
  uniform float time;
  uniform float displace;
  uniform float scale;
  uniform float pointscale;
  uniform float decay;
  uniform float size;
  uniform float complex;
  uniform float waves;
  uniform float eqcolor;
  uniform bool fragment;

  float turbulence( vec2 p) {
    float t = - 0.005;
    for (float f = 1.0 ; f <= 2.0 ; f++ ){ // 1.0
      float power = pow( 1.3, f );
      t += abs( pnoise( vec2( power * p ), vec2( 10.0, 10.0 ) ) / power );
    }
    return t;
  }

  void main() {

    vUv = uv * scale;

    // noise = (2.0 *  - waves) * turbulence( decay * abs(vUv + time))* scale;
    // qnoise = (0.3 *  - eqcolor) * turbulence( decay * abs(vUv + time))* scale;
    // float b = pnoise( complex * (vUv) + vec2( (decay * 2.0) * time ), vec2( 100.0 ) );
    
    // // displacement = - atan(noise) + tan(b * displace);
    // displacement = tan(b * displace);
    // vec3 newPosition = (position) + (normal * displacement);
    gl_Position = (projectionMatrix * modelViewMatrix) * vec4( position, abs(size) );
    gl_PointSize = (3.0);
  }