import * as GaussianSplats3D from './src/node_modules/@mkkellogg/gaussian-splats-3d/build/gaussian-splats-3d.module.js';
import * as THREE from 'three';

// Создаем новую сцену Three.js
const threeScene = new THREE.Scene();

// Добавляем освещение в сцену
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
threeScene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
threeScene.add(directionalLight);

// Получаем кнопки из HTML
const view1Button = document.getElementById('view1Button');
const view2Button = document.getElementById('view2Button');
const view3Button = document.getElementById('view3Button');

// Переменные для управления состоянием сцены
let isSceneAdded = false; // Следим, добавлена ли сцена
let activeSceneIndex = 0; // Индекс текущей активной сцены

// Создаем Viewer
const viewer = new GaussianSplats3D.Viewer({
    threeScene,
    cameraUp: [0, -1, 0],
    initialCameraPosition: [-2, -2, 4],
    initialCameraLookAt: [0, 1.65, 0]
});

// Функция для загрузки начальной сцены при старте
function loadInitialScene() {
    console.log('Загружаем начальную сцену...');
    viewer.addSplatScene('https://huggingface.co/spaces/Vision70s/GaussianVision70s/resolve/main/archViz_compressed.ply', {
        showLoadingUI: true,
        progressiveLoad: true,
        position: [0, 1, 0],
        rotation: [0, 0, 0, 1],
        scale: [1.0, 1.0, 1.0]
    })
    .then(() => {
        console.log('Начальная сцена успешно загружена.');
        isSceneAdded = true; // Сцена добавлена
        activeSceneIndex = 0; // Индекс первой сцены
        viewer.start();
        viewer.animatePointCloudToSplats();
    })
    .catch(error => {
        console.error('Ошибка загрузки начальной сцены:', error);
    });
}

// Загрузка начальной сцены при старте
loadInitialScene();

// Обработчик для кнопки View 1 — Перемещение камеры
view1Button.addEventListener('click', () => {
    animateCameraTo(
        [-0.82647, 1.42209, -2.02626], // Новая позиция камеры
        [-0.22964, 2.01912, -0.46573], // Новая цель камеры
        3,                             // Длительность анимации
        "power1.inOut"                 // Тип easing
    );
});

view2Button.addEventListener('click', () => {
    if (!isSceneAdded) {
        console.log('Добавляем сцену...');
        viewer.addSplatScene('https://huggingface.co/datasets/Vision70s/3dgs/resolve/main/4testCROP.ksplat', {
            showLoadingUI: true,
            progressiveLoad: true,
            position: [0, 1, 0],
            rotation: [0, 0, 0, 1],
            scale: [1.0, 1.0, 1.0]
        })
        .then(() => {
            console.log('Сцена успешно добавлена.');
            isSceneAdded = true; // Ставим флаг, что сцена добавлена
            activeSceneIndex = viewer.getSceneCount() - 1; // Обновляем индекс активной сцены

            // Перемещаем камеру в новую позицию после загрузки
            animateCameraTo(
                [3.67092, -2.66199, 5.80182], // Новая позиция камеры
                [0, 1, 0],                   // Цель камеры (можно изменить)
                2,                           // Длительность анимации
                "power1.inOut"               // Тип easing
            );
        })
        .catch(error => {
            console.error('Ошибка при добавлении сцены:', error);
        });
    } else {
        console.log('Сцена уже добавлена. Повторное добавление пропущено.');
    }
});

// Обработчик для кнопки View 3 — Удаление сцены
view3Button.addEventListener('click', () => {
    if (isSceneAdded) {
        console.log('Удаляем сцену...');
        viewer.removeSplatScene(activeSceneIndex) // Удаляем активную сцену
            .then(() => {
                console.log('Сцена успешно удалена.');
                isSceneAdded = false; // Сбрасываем флаг, что сцена удалена
                activeSceneIndex = -1; // Сбрасываем индекс активной сцены
            })
            .catch(error => {
                console.error('Ошибка при удалении сцены:', error);
            });
    } else {
        console.warn('Нет сцены для удаления.');
    }
});

// Обновляем сцены в цикле рендеринга
viewer.renderer.setAnimationLoop(() => {
    viewer.update();
});

// Функция для анимации камеры
function animateCameraTo(position, target, duration = 1.5, easing = "power1.inOut") {
    const startPos = viewer.camera.position.clone();
    const startTarget = viewer.controls.target.clone();

    const endPos = new THREE.Vector3(...position);
    const endTarget = new THREE.Vector3(...target);

    // Анимация позиции камеры
    gsap.to(startPos, {
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        duration: duration,
        ease: easing,
        onUpdate: () => {
            viewer.camera.position.copy(startPos);
            viewer.controls.update();
        }
    });

    // Анимация цели камеры
    gsap.to(startTarget, {
        x: endTarget.x,
        y: endTarget.y,
        z: endTarget.z,
        duration: duration,
        ease: "power1.inOut",
        onUpdate: () => {
            viewer.controls.target.copy(startTarget);
            viewer.controls.update();
        }
    });
}
