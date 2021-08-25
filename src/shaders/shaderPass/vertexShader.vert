precision highp float;
#define GLSLIFY 1

varying vec2 vUv;

void main(void) {
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
