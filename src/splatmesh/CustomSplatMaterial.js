import * as THREE from 'three';
import { SplatMaterial } from './SplatMaterial.js';

export class CustomSplatMaterial {
    static build(dynamicMode = false, enableOptionalEffects = false, antialiased = false,
                 maxScreenSpaceSplatSize = 2048, splatScale = 1.0, pointCloudModeEnabled = false, maxSphericalHarmonicsDegree = 0) {

        const customVertexVars = `
            uniform vec2 covariancesTextureSize;
            uniform highp sampler2D covariancesTexture;
            uniform highp usampler2D covariancesTextureHalfFloat;
            uniform int covariancesAreHalfFloat;

            void fromCovarianceHalfFloatV4(uvec4 val, out vec4 first, out vec4 second) {
                vec2 r = unpackHalf2x16(val.r);
                vec2 g = unpackHalf2x16(val.g);
                vec2 b = unpackHalf2x16(val.b);

                first = vec4(r.x, r.y, g.x, g.y);
                second = vec4(b.x, b.y, 0.0, 0.0);
            }
        `;

        let vertexShaderSource = SplatMaterial.buildVertexShaderBase(dynamicMode, enableOptionalEffects,
                                                                     maxSphericalHarmonicsDegree, customVertexVars);
        vertexShaderSource += this.buildVertexShaderProjection(antialiased, enableOptionalEffects, maxScreenSpaceSplatSize);
        const fragmentShaderSource = this.buildFragmentShader();

        const uniforms = SplatMaterial.getUniforms(dynamicMode, enableOptionalEffects,
                                                   maxSphericalHarmonicsDegree, splatScale, pointCloudModeEnabled);

        uniforms['covariancesTextureSize'] = { type: 'v2', value: new THREE.Vector2(1024, 1024) };
        uniforms['covariancesTexture'] = { type: 't', value: null };
        uniforms['covariancesTextureHalfFloat'] = { type: 't', value: null };
        uniforms['covariancesAreHalfFloat'] = { type: 'i', value: 0 };

        // Добавляем обязательные uniforms
        uniforms['centersColorsTexture'] = { type: 't', value: null };
        uniforms['sceneIndexesTexture'] = { type: 't', value: null };
        uniforms['focal'] = { type: 'v2', value: new THREE.Vector2(1.0, 1.0) };
        uniforms['viewport'] = { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) };

        return new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShaderSource,
            fragmentShader: fragmentShaderSource,
            transparent: true,
            alphaTest: 1.0,
            blending: THREE.NormalBlending,
            depthTest: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });
    }

    static buildVertexShaderProjection(antialiased, enableOptionalEffects, maxScreenSpaceSplatSize) {
        return `
            varying vec3 vPosition;
            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
    }

    static buildFragmentShader() {
        return `
            precision highp float;
            varying vec3 vPosition;

            void main() {
                vec3 color = vec3(abs(vPosition.x), abs(vPosition.y), abs(vPosition.z));
                gl_FragColor = vec4(color, 1.0);
            }
        `;
    }

    static createMaterial(dynamicMode = false, enableOptionalEffects = false, antialiased = false,
                          maxScreenSpaceSplatSize = 2048, splatScale = 1.0, pointCloudModeEnabled = false, maxSphericalHarmonicsDegree = 0) {
        return this.build(dynamicMode, enableOptionalEffects, antialiased,
                          maxScreenSpaceSplatSize, splatScale, pointCloudModeEnabled, maxSphericalHarmonicsDegree);
    }
}
