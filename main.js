import * as GaussianSplats3D from './src/node_modules/@mkkellogg/gaussian-splats-3d/build/gaussian-splats-3d.module.js';
import * as THREE from 'three';


const viewer = new GaussianSplats3D.Viewer({
    
    'cameraUp': [0, -1, 0],
    'initialCameraPosition': [1, 1, 6],
    'freeIntermediateSplatData': true,
    'dynamicScene': true,

    'enableSIMDInSort': true,
    'inMemoryCompressionLevel': 2,
    'renderMode': GaussianSplats3D.RenderMode.OnChange,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Default,
    'antialiased': true,
    'initialCameraLookAt': [0, 1, 0]
    
});
viewer.addSplatScene('https://huggingface.co/spaces/Vision70s/GaussianVision70s/resolve/main/OrigCrop.ply', {
    'splatAlphaRemovalThreshold': 4,
    'showLoadingUI': true,
    'progressiveLoad': true,
    'position': [0, 1, 0],
    'rotation': [0, 0, 0, 1],
    'scale': [1.5, 1.5, 1.5]
})
.then(() => {
    viewer.start();
});