precision highp float;
#define GLSLIFY 1

varying vec3 vWorldNormal;

void main() {
  vec3 lightDir = normalize(vec3(1.));
  float lightAmount = dot(lightDir, vWorldNormal);
  gl_FragColor = vec4(vec3(lightAmount), 1.);
}
