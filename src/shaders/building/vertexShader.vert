precision highp float;
#define GLSLIFY 1

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;
attribute float index;

varying float vIndex;

void main(void) {
    vIndex = index;
    vec3 newPos = position;
    newPos.x += index;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
