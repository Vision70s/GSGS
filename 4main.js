import * as GaussianSplats3D from './src/node_modules/@mkkellogg/gaussian-splats-3d/build/gaussian-splats-3d.module.js';
import * as THREE from 'three';

const viewer = new GaussianSplats3D.Viewer({
    'cameraUp': [0, -5, 0],
    'initialCameraPosition': [1, 0, -3],
    'inMemoryCompressionLevel': 1,
    'renderMode': GaussianSplats3D.RenderMode.OnChange,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Gradual,
    //'splatSortDistanceMapPrecision': 32,
    'freeIntermediateSplatData': true,
    'sceneFadeInRateMultiplier': 20,
    'dynamicScene': true,
    'enableOptionalEffects': true,
    'initialCameraLookAt': [0, 1, 0]
    
});

viewer.animatePointCloudToSplats({
    duration: 3000, // 3 секунды для основного перехода
    expandDuration: 5000, // 1 секунда для расширения сплатов
    maxSplatScale: 1.0, // Максимальный размер сплатов
    minSplatScale: 0.1, // Начальный размер сплатов
    maxVisibleRadius: 15.0, // Максимальный радиус видимости
});

viewer.addSplatScene('https://huggingface.co/spaces/Vision70s/GaussianVision70s/resolve/main/mag_cc_clean_7500.ksplat', {
    'splatAlphaRemovalThreshold': 1,
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