precision highp float;
#define GLSLIFY 1

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vEyeVector;
varying vec3 vWorldNormal;

void main(void) {
	vec4 worldPosition = modelMatrix * vec4(position, 1.0);

	vEyeVector = normalize(worldPosition.xyz - cameraPosition);
	vWorldNormal = normalize(modelViewMatrix * vec4(normal, 0.0)).xyz;
    vNormal = normal;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
