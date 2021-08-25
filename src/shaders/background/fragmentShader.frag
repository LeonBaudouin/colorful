precision mediump float;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPositionW;

uniform vec3 uInsideColor;
uniform vec3 uOutsideColor;

uniform vec3 uCameraPosition;

uniform float uGradientStart;
uniform float uGradientEnd;


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
    vec3 viewDirectionW = normalize(uCameraPosition - vPositionW);
    float fresnelTerm = dot(viewDirectionW, vNormalW);
	fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);
    float dist = cremap(fresnelTerm, uGradientStart, uGradientEnd, 0., 1.);
    float mixValue = dist + random(vUv * 100.) / 10.;
    // float mixValue = dist;
    vec3 color = mix(uInsideColor, uOutsideColor, mixValue);
    // gl_FragColor = vec4(color, 1.);
    gl_FragColor = vec4(normalize(vNormalW), 1.);
}
