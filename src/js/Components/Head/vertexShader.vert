precision highp float;
#define GLSLIFY 1

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main(void) {
	vWorldNormal = normalize(modelViewMatrix * vec4(normal, 0.0)).xyz;
	vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
