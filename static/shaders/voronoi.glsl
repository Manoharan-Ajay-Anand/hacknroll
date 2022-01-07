

#ifndef random2
    #define random2 random2
    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
#endif

#ifndef smooth_voronoi
    #define smooth_voronoi smooth_voronoi
    vec3 smoothVoronoi( in vec2 x, in float scale )  //TODO: Change to float and generalise as a function than just a color
    {
        x *= scale;
        vec3 color = vec3(.0);
        vec2 p = floor( x );
        vec2  f = fract( x );

        float res = 0.0;
        for( int j=-1; j<=1; j++ )
        for( int i=-1; i<=1; i++ )
        {
            // ivec2 b = ivec2( i, j );
            vec2 b = vec2( i, j );
            vec2  r = vec2( b ) - f + random2( p + b );
            float d = length( r );

            res += exp2( -32.0*d );
        }
        color += (-(1.0/32.0)*log2( res ));
        return color;
    }

#endif

#ifndef voronoi
    #define voronoi voronoi
    vec3 voronoi(in vec2 st, in float scale){  //in float u_time
        vec3 color = vec3(.0);
        // Scale
        st *= scale;//20.;

        // Tile the space
        vec2 i_st = floor(st);
        vec2 f_st = fract(st);

        float m_dist = 1.;  // minimum distance

        for (int y= -1; y <= 1; y++) {
            for (int x= -1; x <= 1; x++) {
                // Neighbor place in the grid
                vec2 neighbor = vec2(float(x),float(y));

                // Random position from current + neighbor place in the grid
                vec2 point = random2(i_st + neighbor);

                // Animate the point
                // point = 0.5 + 0.5*sin(u_time + 6.2831*point);

                // Vector between the pixel and the point
                vec2 diff = neighbor + point - f_st;

                // Distance to the point
                float dist = length(diff);

                // Keep the closer distance
                // if( m_dist == -1.){
                //     m_dist = dist;
                // } else {
                m_dist = min(m_dist, dist);   // causes the discontinuity because it essentailly chooses the closet point
                // }
            }
        }

        // Draw the min distance (distance field)
        color += m_dist; // 0 to 1 range, 1 being white.

        // tint acording the closest point position
        // color.rg = m_point;

        // Draw cell center
        // color += 1.-step(.02, m_dist);

        // Draw grid
        // color.r += step(.98, f_st.x) + step(.98, f_st.y);

        // Show isolines
        // color -= step(.7,abs(sin(27.0*m_dist)))*.5;
        return color;
    }
#endif