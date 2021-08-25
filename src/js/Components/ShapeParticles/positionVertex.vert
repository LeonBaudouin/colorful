float seed1 = rand(aIndex + uSeed);
float seed2 = rand(aIndex + uSeed + 1.);
float seed3 = rand(aIndex + uSeed + 2.);

float prog = uTime * uSpeed + (aIndex * uIndividualOffset + uCycleOffset) * PI * 2.;
vec3 offset = getOffset(prog);
vec3 nextOffset = getOffset(prog + 0.0001);

vec3 dir = normalize(nextOffset - offset);
vec3 additionalOffset = randomTangent(dir, seed1);
float offsetAmount = seed2;
offset += additionalOffset * uSpreadFactor * offsetAmount;

vec4 rotation = quaternionLookRotation(-dir, vec3(0., 1., 0.));
float scale = remap(seed3, 0., 1., uScale - uVarScale, uScale + uVarScale);
transform(transformed, offset, rotation, vec3(scale));
