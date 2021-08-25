precision mediump float;
varying vec3 vPos;
varying vec2 vUv;
varying float vRow;
varying float vRay;

uniform float uTime;
uniform vec3 uColor;
uniform float uTotalRays;
uniform float uTotalRows;
uniform float uEventTimes[30];
uniform int uEventTypes[30];
const int eventCount = 30;

#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)
#pragma glslify: ease = require(glsl-easings/sine-in-out)

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

float quadraticThroughAGivenPoint (float x, float a, float b)
{
  
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 
  
  float A = (1.-b)/(1.-a) - (b/a);
  float B = (A*(a*a)-b)/a;
  float y = A*(x*x) - B*(x);
  y = min(1.,max(0.,y)); 
  
  return y;
}

float remap(float value, float start1, float stop1, float start2, float stop2)
{
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

float impulse( float k, float x ){
    float h = k*x;
    return h*exp(1.0-h);
}

float noise(float size, float evolSpeed, float offset)
{
    vec3 newPos = vPos * size;
    newPos.y -= uTime * evolSpeed * .5;
    return remap(snoise4(vec4(newPos, uTime * evolSpeed + offset)), -1., 1., 0., 1.);
}

float circleShape(float border, float radius)
{
	float dist = radius - distance(vUv, vec2(0.5));
	return smoothstep(0.0, border, dist);
}

void main()
{
    vec3 hsv = rgb2hsv(uColor);
    hsv.z = noise(.7, .01, 0.) / 2.;

    for (int i = 0; i < eventCount; i++)
    {
        int eventType = uEventTypes[i];
        float eventTime = uEventTimes[i];
        if (eventType == 0) {
            float sat = impulse(.25, uTime - vRow / 35. - eventTime);
            hsv.z = max(hsv.z, sat);
        }
        if (eventType == 1) {
            float index = abs(vRay / uTotalRays - .5) * 2.;
            float smoothedIndex = ease(1. - index);
            float sat = impulse(.8, uTime - smoothedIndex * 10. - eventTime);
            hsv.z = max(hsv.z, sat);
            hsv.z = max(hsv.z, impulse(.2, uTime - 10. - eventTime));
        }
        if (eventType == 2) {
            float ray = abs(vRay / uTotalRays - .5) * 2.;
            float rayPulse = impulse(.8, uTime - ease(1. - ray) * 10. - eventTime);
            float row = vRow / uTotalRows;
            float rowPulse = impulse(.4, uTime - ease(row) * 10. - eventTime);
            hsv.z = max(hsv.z, rayPulse);
            // hsv.z = max(hsv.z, impulse(.2, uTime - 10. - eventTime));
        }
    }
    if (hsv.z <= 0.01) discard;
    
	// final color
    
    gl_FragColor = vec4(hsv2rgb(hsv), circleShape(.2, .5));
}