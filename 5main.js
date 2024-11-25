import * as GaussianSplats3D from './src/node_modules/@mkkellogg/gaussian-splats-3d/build/gaussian-splats-3d.module.js';
import * as THREE from 'three';

const viewer = new GaussianSplats3D.Viewer({
    'cameraUp': [0, -5, 0],
    'initialCameraPosition': [1, 0, -3],
    'inMemoryCompressionLevel': 1,
    'renderMode': GaussianSplats3D.RenderMode.OnChange,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Gradual,
    'splatSortDistanceMapPrecision': 32,
    'sceneFadeInRateMultiplier': 20,
    'initialCameraLookAt': [0, 1, 0]
});

viewer.addSplatScene('https://huggingface.co/spaces/Vision70s/GaussianVision70s/resolve/main/MAG_750_2.ksplat', {
    'splatAlphaRemovalThreshold': 15,
    'showLoadingUI': true,
    'progressiveLoad': true,
    'position': [0, 1, 0],
    'rotation': [0, 0, 0, 1],
    'scale': [1.5, 1.5, 1.5]
})
.then(() => {
    viewer.start();

    // Запускаем анимацию перехода от точек к сплатам
    viewer.animatePointCloudToSplats();
})
.catch(error => {
    console.error("Ошибка при загрузке сцены:", error);
});
