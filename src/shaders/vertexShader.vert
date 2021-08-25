precision mediump float;
precision mediump int;

uniform mat4 modelViewMatrix; 
uniform mat4 projectionMatrix;

uniform float uSize;
uniform float uTime;
uniform float uRadius;
uniform float uTotalRows;
uniform float uTotalRays;
uniform float uAngleMult;

attribute vec3 position;
attribute vec2 uv;

attribute float row;
attribute float pindex;
attribute float ray;

varying vec3 vPos;
varying vec2 vUv;
varying float vRow;
varying float vRay;
varying float vAngle;

#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

#define PI 3.14159265359

float random(float n){return fract(sin(n) * 43758.5453123);}

float remap(float value, float start1, float stop1, float start2, float stop2)
{
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

void main() {
	vUv = uv;
	vRow = row;
	vRay = ray;

	float radius = (uRadius / uTotalRows) * mix(1., .8, mod(ray, 2.)) * row;
	float angle = ((ray + .5) / uTotalRays) * PI * 2. * uAngleMult - PI * uAngleMult + PI / 2.;

	float x = cos(angle) * radius;
	float y = sin(angle) * radius - 1.5;
	float z = -10. + radius;
	vec3 displaced = vec3(x, y, z);
	
	float noise = remap(snoise4(vec4(displaced, uTime * .01)), -1., 1., .1, 1.);
	float noiseAngle = PI / 2. * noise;
	float noiseRad = fract(noise * 100.);
	vec3 noiseDisplace = vec3(cos(noiseAngle) * noiseRad, sin(noiseAngle) * noiseRad, 0.);

	vPos = position * uSize * noise * 2. + displaced;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
}