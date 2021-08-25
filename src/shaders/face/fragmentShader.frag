#define STANDARD
uniform mat4 modelViewMatrix;
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif
#include <common>
#include <bsdfs>
#include <envmap_common_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec3 vPosition;
varying vec3 vPositionW;
varying vec3 vNormalW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>

	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
  
	#ifdef ENVMAP_TYPE_CUBE
    vec3 normalVec = geometry.normal;
    vec3 camDir = geometry.position - cameraPosition;
    vec3 camDir2 = (modelViewMatrix * vec4(0., 0., 1., 0.)).xyz;
		// vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );
		// vec3 queryVec = vec3(worldNormal.x, worldNormal.yz );
		// vec4 envMapColor = textureCube( envMap, (modelViewMatrix * vec4(0., 0., 1., 0.)).xyz, 1. );


		vec3 color = vec3(1., 1., 1.);
		vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
		float fresnelTerm = dot(viewDirectionW, vNormalW);
		fresnelTerm = clamp(pow(.35 - fresnelTerm, 3.), 0., 1.);

		vec3 worldNormal = inverseTransformDirection( vPosition, viewMatrix );
		vec3 queryVec = vec3(worldNormal.x, worldNormal.yz );
		queryVec = mix(queryVec, viewDirectionW, 0.5);

		vec3 endVec = mix(queryVec, vPositionW, fresnelTerm);



		vec4 envMapColor = textureCube( envMap, vPosition, 1. );
		envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		gl_FragColor = envMapColor;
		// gl_FragColor = vec4( vPositionW, 1.);
	#endif
}