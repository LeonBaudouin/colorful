precision highp float;
#define GLSLIFY 1

varying float vIndex;

void main() {
	gl_FragColor = vec4(vec3(vIndex / 10.), 1.0);
}