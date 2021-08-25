precision highp float;
#define GLSLIFY 1

uniform sampler2D tDiffuse;
uniform sampler2D tMaskTexture;
uniform sampler2D tSecondScene;

varying vec2 vUv;


void main(void) {
    vec4 defaultColor = texture2D(tDiffuse, vUv);
    vec4 secondScene = texture2D(tSecondScene, vUv);
    float mask = texture2D(tMaskTexture, vUv).r;
    gl_FragColor = vec4(defaultColor.rgb, 1. - mask);
    // gl_FragColor = vec4(defaultColor);
    // gl_FragColor = vec4(vec3(1.), .1);
    gl_FragColor = mix(defaultColor, secondScene, mask);
    // gl_FragColor = texture2D(tMaskTexture, vUv);
    gl_FragColor = defaultColor;
}