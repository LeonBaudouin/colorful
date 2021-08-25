precision highp float;
#define GLSLIFY 1

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

varying vec3 vNormalW;
varying vec2 vUv;
varying vec3 vPositionW;

void main(void) {
    vUv = uv;
    vPositionW = position;
	vNormalW = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
