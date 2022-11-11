float curve = 1.0;
uniform sampler2D sssLUT;//Subsurface Scattering //https://developer.nvidia.com/gpugems/gpugems3/part-iii-rendering/chapter-14-advanced-techniques-realistic-real-time-skin
uniform float sssIntensity;
uniform float sssIntensity2;
void RE_Direct_Physical_Scattering( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
        RE_Direct_Physical( directLight, geometry, material, reflectedLight ) ;
        float wrappedDotNL = (dot(directLight.direction, geometry.normal) * 0.5 + 0.5);
        vec4 scatteringColor = texture2D(sssLUT, vec2(wrappedDotNL, 1.0 / curve  ));//散射颜色取决于入射夹角和曲率
        reflectedLight.directDiffuse += (1.0 - wrappedDotNL) * directLight.color * material.diffuseColor * scatteringColor.rgb * sssIntensity;//计算次表面散射并加入到漫反射中
}
#define  RE_Direct_Physical  RE_Direct_Physical_Scattering
