precision highp float;
#define GLSLIFY 1

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

uniform float uTime;
uniform vec4 uDirection;
uniform sampler2D uGradient;

uniform float uFresnelPower;
uniform vec3 uFresnelColor;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float remap(float value, float low1, float high1, float low2, float high2) {
  return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

vec3 transform(inout vec3 position, vec3 T, vec4 R, vec3 S) {
  //applies the scale
  position *= S;
  //computes the rotation where R is a (vec4) quaternion
  position += 2.0 * cross(R.xyz, cross(R.xyz, position) + R.w * position);
  //translates the transformed 'blueprint'
  position += T;
  //return the transformed position
  return position;
}

float stripe(float progress, float stripeStep, float fadeSize) {
  return smoothstep(stripeStep-fadeSize, stripeStep+fadeSize, sin(progress));
}

vec3 stripes(float progress) {
  float smallStripe = stripe(progress * 100., 0.9, 0.02);
  float wideStripe = stripe(progress * 100., 0.6, 0.02);
  

  vec3 bgColor = vec3(0.0235, 0.0078, 0.1451);
  vec3 wideStripeColor = vec3(0., 1., 1.);
  vec3 smallStripeColor = vec3(1.0, 0.0, 0.0);
  vec3 color = bgColor;
  color = mix(color, wideStripeColor, wideStripe);
  color = mix(color, smallStripeColor, smallStripe);

  return color;
}

float fresnel(vec3 eyeVector, vec3 worldNormal) {
	return pow(1.0 + dot( eyeVector, worldNormal), 3.0);
}
float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
	return pow(1.0 + dot( eyeVector, worldNormal), power);
}

void main() {
  vec3 position = vWorldPosition;
  transform(position, vec3(0.), uDirection, vec3(1.));
  position.z += uTime * 0.05;
  float prog = position.z
    + snoise(position * 5.) * 0.05
    + snoise(position * vec3(500., 500., 1.)) * 0.002;
  // float prog = position.z ;

  float loopProg = fract(prog * 10.);
  float offsetProg = fract(prog * 10. + 0.5);

  vec3 mainColor = texture2D(uGradient, vec2(loopProg, 0.5)).xyz;
  vec3 firstColor = texture2D(uGradient, vec2(0., 0.5)).xyz;
  vec3 lastColor = texture2D(uGradient, vec2(1., 0.5)).xyz;


  float limit = 0.46;
  float onMakeOver = step(offsetProg, 1. - limit) - step(offsetProg, limit);
  onMakeOver = clamp(onMakeOver, 0., 1.);
  float progMakeOver = remap(offsetProg, limit, 1. - limit, 1., 0.);
  vec3 makeOverColor = mix(firstColor, lastColor, progMakeOver);

	vec3 normal = vWorldNormal;
	float f = fresnel(vec3(0., 0., -1.), normal, uFresnelPower);

  vec3 color = mix(mainColor, makeOverColor, onMakeOver);
  color = mix(color, uFresnelColor, f);
  gl_FragColor = vec4(color, 1.0);
}
