#ifndef random
    #define random random
    float random (in vec2 st) {
        return fract(sin(dot(st.xy,
                            vec2(12.9898,78.233)))*
            43758.5453123);
    }
#endif

#ifndef noise 
    #define noise noise
    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }
#endif

#ifndef ridged_multifractal
    #define ridged_multifractal ridged_multifractal
    float ridged_multifractal (in vec2 xy, in int octaves, in float scale, in float lacunarity, in float amplitude) {
        // Initial values
        float value = 0.0;
        // float scale = .5;
        float frequency = 1.;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5),
                            -sin(0.5), cos(0.50));
        // float amplitude = .5;
        //
        // Loop of octaves
        for (int i = 0; i < octaves; i++) {
            float n = abs(noise(frequency * xy * scale)) * -1.;
            value += amplitude * (n * n);
            xy = rot * xy * 2. + shift;
            frequency *= lacunarity;
            amplitude *= .5;
        }
        return value;
    } 


#endif


#ifndef fbm_2D 
    #define fbm_2D fbm_2D
    float fbm_2D (in vec2 xy, in int octaves, in float scale, in float lacunarity, in float amplitude) {
        // Initial values
        float value = 0.0;
        // float scale = .5;
        float frequency = 1.;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5),
                            -sin(0.5), cos(0.50));
        // float amplitude = .5;
        //
        // Loop of octaves
        for (int i = 0; i < octaves; i++) {
            value += amplitude * noise(frequency * xy * scale);
            xy = rot * xy * 2. + shift;
            frequency *= lacunarity;
            amplitude *= .5;
        }
        return value;
    }
#endif