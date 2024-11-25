import * as GaussianSplats3D from './src/node_modules/@mkkellogg/gaussian-splats-3d/build/gaussian-splats-3d.module.js';
import * as THREE from 'three';


const viewer = new GaussianSplats3D.Viewer({
    
    'cameraUp': [0, -1, 0],
    'sphericalHarmonicsDegree': 2,
    'sceneFadeInRateMultiplier': 2,
    'splatSortDistanceMapPrecision': 32,
    //'enableSIMDInSort': true,
    //'ignoreDevicePixelRatio': true,
    //'sharedMemoryForWorkers': false,
    'initialCameraPosition': [	4.35871, -5.84837, 5.89695],
    //'freeIntermediateSplatData': true,
    'dynamicScene': true,
    //'inMemoryCompressionLevel': 1,
    //'renderMode': GaussianSplats3D.RenderMode.OnChange,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Gradual,
   // 'antialiased': true,
    'initialCameraLookAt': [0, 1, 0]
    
});
viewer.addSplatScene('https://huggingface.co/datasets/Vision70s/3dgs/resolve/main/colorcropppppp.ksplat', {
    'splatAlphaRemovalThreshold': 2,
    'enableOptionalEffects': true, // enableOptionalEffects
    'showLoadingUI': true,
    'progressiveLoad': true,
    'position': [0, 1, 0],
    'rotation': [0, 0, 0, 1],
    'scale': [1.5, 1.5, 1.5],

})
.then(() => {
    viewer.start();

    // Запускаем анимацию перехода от точек к сплатам
    // viewer.animatePointCloudToSplats();
})
.catch(error => {
    console.error("Ошибка при загрузке сцены:", error);
});
