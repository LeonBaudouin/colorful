precision mediump float;
varying vec2 vUv;

#pragma glslify: ease = require(glsl-easings/back-in)


float random(float n){return fract(sin(n) * 43758.5453123);}

float random(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float remap(float value, float start1, float stop1, float start2, float stop2)
{
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

float cremap(float value, float start1, float stop1, float start2, float stop2) {
    float r = remap(value, start1, stop1, start2, stop2);
    return clamp(r, start2, stop2);
}

void main()
{
    vec2 uv = vUv * vec2(2., 1.);
    float gridSize = 70.;
    vec2 cellUv = fract(uv * gridSize);
    vec2 cellId = floor(uv * gridSize) * 1000.;

    float randVal = random(cellId);
    vec2 randomPoint = vec2(
        randVal,
        fract(randVal * 10.)
    );

    float df = 1. - clamp(
        distance(cellUv, randomPoint),
        0.,
        1.
    );

    float starBaseSize = 0.08;
    float starVarSize = 0.07;

    float randVar = (fract(randVal * 100.) * 2. - 1.) * starVarSize;
    float starSize = starBaseSize + randVar;
    starSize = (1. - step(starSize, 0.04)) * starSize;
    float star = cremap(
        df,
        1. - starSize, 1.,
        0., 1.
    );
    star = clamp(ease(star), 0., 1.);
    vec3 starColor = vec3(star);
    starColor += cremap(
        df,
        1. - starSize * 2., 1.,
        0., 1.
    ) * vec3(0., 0.5, 1.) / 5.;
    // float star = step(1. - starSize, df);
    

    // gl_FragColor = vec4(vec3(cellUv.x, cellUv.y, 1.), 1.);
    gl_FragColor = vec4(starColor, 1.);
}