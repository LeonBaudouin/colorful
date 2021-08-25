precision highp float;
#define GLSLIFY 1

uniform vec3 cameraPosition;
uniform sampler2D uEnvMap;
uniform vec2 uResolution;
uniform float uIor;
uniform float uFresnelPower;
uniform vec3 uFresnelColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vEyeVector;
varying vec3 vWorldNormal;

float Fresnel(vec3 eyeVector, vec3 worldNormal) {
	return pow(1.0 + dot( eyeVector, worldNormal), 3.0);
}
float Fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
	return pow(1.0 + dot( eyeVector, worldNormal), power);
}

void main() {
	// get screen coordinates
	vec2 uv = gl_FragCoord.xy / uResolution;

	vec3 normal = vWorldNormal;
	// calculate refraction and add to the screen coordinates
	vec3 refracted = refract(vec3(0., 0., -1.), normal, 1.0/uIor);
	uv += refracted.xy;
	
	// sample the background texture
	vec4 tex = texture2D(uEnvMap, uv);
	float f = Fresnel(vec3(0., 0., -1.), normal, uFresnelPower);

	vec3 outputColor = mix(tex.rgb, uFresnelColor, f);
	gl_FragColor = vec4(outputColor, 1.0);
	// gl_FragColor = vec4(, 1.);
}
