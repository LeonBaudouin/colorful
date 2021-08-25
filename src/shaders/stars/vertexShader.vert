precision mediump float;
precision mediump int;

uniform mat4 modelViewMatrix; 
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec2 vUv;
varying vec3 vNormal;

#define PI 3.14159265359

float random(float n){return fract(sin(n) * 43758.5453123);}

float remap(float value, float start1, float stop1, float start2, float stop2)
{
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

void main() {
	vUv = uv;
	vNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}