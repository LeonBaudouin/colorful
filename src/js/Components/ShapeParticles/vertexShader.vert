attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;

attribute float aIndex;

uniform float uTime;

varying vec3 vWorldNormal;

#define PI 3.14159265359

vec4 quaternionLookRotation(vec3 fw, vec3 up) {
  vec3 forward = normalize(fw);

  vec3 vector = normalize(forward);
  vec3 vector2 = normalize(cross(up, vector));
  vec3 vector3 = cross(vector, vector2);
  float m00 = vector2.x;
  float m01 = vector2.y;
  float m02 = vector2.z;
  float m10 = vector3.x;
  float m11 = vector3.y;
  float m12 = vector3.z;
  float m20 = vector.x;
  float m21 = vector.y;
  float m22 = vector.z;


  float num8 = (m00 + m11) + m22;
  vec4 quaternion;
  if (num8 > 0.) {
    float num = sqrt(num8 + 1.);
    quaternion.w = num * 0.5;
    num = 0.5 / num;
    quaternion.x = (m12 - m21) * num;
    quaternion.y = (m20 - m02) * num;
    quaternion.z = (m01 - m10) * num;
    return quaternion;
  }
  if ((m00 >= m11) && (m00 >= m22))
  {
    float num7 = sqrt(((1. + m00) - m11) - m22);
    float num4 = 0.5 / num7;
    quaternion.x = 0.5 * num7;
    quaternion.y = (m01 + m10) * num4;
    quaternion.z = (m02 + m20) * num4;
    quaternion.w = (m12 - m21) * num4;
    return quaternion;
  }
  if (m11 > m22)
  {
    float num6 = sqrt(((1. + m11) - m00) - m22);
    float num3 = 0.5 / num6;
    quaternion.x = (m10+ m01) * num3;
    quaternion.y = 0.5 * num6;
    quaternion.z = (m21 + m12) * num3;
    quaternion.w = (m20 - m02) * num3;
    return quaternion; 
  }
  float num5 = sqrt(((1. + m22) - m00) - m11);
  float num2 = 0.5 / num5;
  quaternion.x = (m20 + m02) * num2;
  quaternion.y = (m21 + m12) * num2;
  quaternion.z = 0.5 * num5;
  quaternion.w = (m01 - m10) * num2;
  return quaternion;
}


float rand(float n){return fract(sin(n) * 43758.5453123);}

float remap(float value, float start1, float stop1, float start2, float stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
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

// https://stackoverflow.com/a/55465266
vec3 randomTangent(vec3 vector) {
  vec3 normal = normalize(vector);
  vec3 tangent = cross(normal, vec3(-normal.z, normal.x, normal.y));
  vec3 bitangent = cross(normal, tangent);
  float angle = remap(rand(aIndex), 0., 1., -PI, PI);
  return normalize(tangent * sin(angle) + bitangent * cos(angle));
}

vec3 getOffset(float var) {
  return vec3(
    cos(var),
    sin(var * 2.) * 0.2,
    sin(var)
  ) * 3.;
}

void main() {
  vec3 pos = position;

  float prog = uTime * 0.5 + aIndex * 0.0314;
  vec3 offset = getOffset(prog);
  vec3 nextOffset = getOffset(prog + 0.0001);

  vec3 dir = normalize(nextOffset - offset);
  vec3 additionalOffset = randomTangent(dir);
  float offsetAmount = rand(aIndex + 1.);
  offset += additionalOffset * .3 * offsetAmount;

  vec4 rotation = quaternionLookRotation(-dir, vec3(1., 0., 0.));

  transform(pos, offset, rotation, vec3(.05));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  vec3 normalVec = normal;
  transform(normalVec, vec3(0.), rotation, vec3(1.));
	vWorldNormal = normalize(modelMatrix * vec4(normalVec, 0.0)).xyz;
}
