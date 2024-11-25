import * as GaussianSplats3D from './src/node_modules/@mkkellogg/gaussian-splats-3d/build/gaussian-splats-3d.module.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const renderWidth = 800;
const renderHeight = 600;

// Создаем контейнер для рендера
const rootElement = document.createElement('div');
rootElement.style.position = 'relative';
rootElement.style.width = renderWidth + 'px';
rootElement.style.height = renderHeight + 'px';
document.body.appendChild(rootElement);

// Рендер для 3D сцены
const renderer3D = new THREE.WebGLRenderer({ antialias: false, alpha: true });
renderer3D.setSize(renderWidth, renderHeight);
renderer3D.setClearColor(0x000000, 1); // Черный фон
rootElement.appendChild(renderer3D.domElement);

// Рендер для UI (спрайтов)
const rendererUI = new THREE.WebGLRenderer({ antialias: false, alpha: true });
rendererUI.setSize(renderWidth, renderHeight);
rendererUI.domElement.style.position = 'absolute';
rendererUI.domElement.style.top = '0';
rendererUI.domElement.style.left = '0';
rootElement.appendChild(rendererUI.domElement);

// Создаем основную сцену для 3D объектов и дополнительную для UI
const threeScene = new THREE.Scene(); // Для 3D объектов
const uiScene = new THREE.Scene();    // Для UI объектов

// Загружаем текстуру для спрайта и добавляем его только в UI-сцену
const textureLoader = new THREE.TextureLoader();
const spriteTexture = textureLoader.load('images/Button.png');
const spriteMaterial = new THREE.SpriteMaterial({
    map: spriteTexture,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    depthTest: true,
});
const sprite = new THREE.Sprite(spriteMaterial);
sprite.position.set(0, -1, 0);
uiScene.add(sprite); // Спрайт добавляется в UI-сцену

// Функция для обновления масштаба спрайта
function updateSpriteScale() {
    const distance = camera.position.distanceTo(sprite.position);
    const scaleFactor = distance * 0.3;
    sprite.scale.set(scaleFactor, scaleFactor, 1);
}

// Инициализация Viewer
const viewer = new GaussianSplats3D.Viewer({
    selfDrivenMode: false,
    threeScene: threeScene,
    renderer: renderer3D,
    camera: new THREE.PerspectiveCamera(65, renderWidth / renderHeight, 0.1, 500),
    useBuiltInControls: false,
});

const camera = viewer.camera;
camera.position.set(-1, -4, 6);
camera.up.set(0, -1, 0).normalize();
camera.lookAt(new THREE.Vector3(0, 4, 0));

// Настроим OrbitControls
const controls = new OrbitControls(camera, rendererUI.domElement, renderer3D.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

// Анимация камеры
let isAnimating = false;
const startPos = new THREE.Vector3();
const startTarget = new THREE.Vector3();
const endPos = new THREE.Vector3();
const endTarget = new THREE.Vector3();
let animationProgress = 1;

// Создаем первый куб - белый, меньшего размера, с регулируемой позицией
const smallCubeGeometry = new THREE.BoxGeometry(3, 2, 0.5); // Размеры 0.5 x 0.5 x 0.5
const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Белый цвет

const smallCube = new THREE.Mesh(smallCubeGeometry, whiteMaterial);
smallCube.position.set(-1, 0, -3); // Позиция: левее и немного выше
threeScene.add(smallCube); // Добавляем только в threeScene

// Создаем второй куб - белый, большего размера, с регулируемой позицией
const largeCubeGeometry = new THREE.BoxGeometry(4, 0.3, 1.5); // Размеры 1.5 x 1.5 x 1.5
const largeCube = new THREE.Mesh(largeCubeGeometry, whiteMaterial);
largeCube.position.set(-0.1, 0, -1); // Позиция в центре
threeScene.add(largeCube); // Добавляем только в threeScene

smallCube.renderOrder = -1; // Отрисовывать сначала
largeCube.renderOrder = -1; // Отрисовывать сначала

function animateCameraTo(position, target, duration = 1.5, easing = "power1.inOut") {
    // Устанавливаем стартовые позиции
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();

    // Целевые позиции
    const endPos = new THREE.Vector3(...position);
    const endTarget = new THREE.Vector3(...target);

    // Анимация камеры с использованием GSAP
    gsap.to(startPos, {
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        duration: duration,
        ease: easing,
        onUpdate: () => {
            camera.position.copy(startPos);
            controls.update();
        }
    });

    // Анимация цели
    gsap.to(startTarget, {
        x: endTarget.x,
        y: endTarget.y,
        z: endTarget.z,
        duration: duration,
        ease: easing,
        onUpdate: () => {
            controls.target.copy(startTarget);
            controls.update();
        }
    });
}

// function animateCameraAlongCurve(controlPoints, targetPoints, duration = 3) {
//     if (isAnimating) return;

//     // Убедитесь, что это массив объектов THREE.Vector3
//     if (!controlPoints.every(p => p instanceof THREE.Vector3) || !targetPoints.every(p => p instanceof THREE.Vector3)) {
//         console.error("All points in controlPoints and targetPoints must be instances of THREE.Vector3.");
//         return;
//     }

//     const curve = new THREE.CatmullRomCurve3(controlPoints);
//     const targetCurve = new THREE.CatmullRomCurve3(targetPoints);

//     let animationProgress = 0;
//     isAnimating = true;

//     const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

//     const animate = () => {
//         if (!isAnimating) return;

//         animationProgress += 0.02 / duration;
//         const easedProgress = easeInOutQuad(Math.min(animationProgress, 1));

//         const cameraPosition = curve.getPoint(easedProgress);
//         const targetPosition = targetCurve.getPoint(easedProgress);

//         if (!cameraPosition || !targetPosition) {
//             console.error("Failed to get valid points from curves.");
//             return;
//         }

//         camera.position.copy(cameraPosition);
//         controls.target.copy(targetPosition);
//         controls.update();

//         if (animationProgress >= 1) {
//             isAnimating = false;
//         } else {
//             requestAnimationFrame(animate);
//         }
//     };

//     animate();
// }


// Контейнер для кнопок
const buttonContainer = document.createElement('div');
buttonContainer.style.position = 'absolute';
buttonContainer.style.top = '10px';
buttonContainer.style.left = '10px';
document.body.appendChild(buttonContainer);

function createButton(label, position, target) {
    const button = document.createElement('button');
    button.innerText = label;
    button.classList.add('custom-button');
    button.onclick = () => animateCameraTo(position, target);
    buttonContainer.appendChild(button);
}

// Создаем кнопки для разных видов
createButton('Front View', [0, 0, 5], [0, 0, 0]);
createButton('Top View', [0, -5, 0], [0, 0, 0]);
createButton('Side View', [5, -1, 0], [0, 0, 0]);

// Загружаем внешний файл и добавляем его в Viewer
viewer.addSplatScene('https://huggingface.co/spaces/Vision70s/GaussianVision70s/resolve/main/roomCropMaxCleaned.ply', {
    progressiveLoad: true,
}).then(() => {
    animate();
});

// Raycaster и обработчик клика для UI
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(sprite);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject === sprite) {
            window.open('https://example.com', '_blank');
        }
    }
}
window.addEventListener('click', onMouseClick, false);

// Анимация сцены
function animate() {
    requestAnimationFrame(() => setTimeout(animate, 1000 / 30)); // Ограничение FPS до 30

    if (!isAnimating) controls.update();
    updateSpriteScale();

    viewer.update();
    viewer.render();
    rendererUI.render(uiScene, camera); // Рендерим только uiScene в rendererUI
}

animate();

// Точки траектории камеры
const controlPoints = [
    new THREE.Vector3(5.42161, -4.21597, 6.63870),
    new THREE.Vector3(0, -2, 3),
    new THREE.Vector3(-5, 0, 1),
    new THREE.Vector3(-11.32055, -0.16361, -1.30606)
];

// Точки направления камеры
const targetPoints = [
    new THREE.Vector3(5, -4, 5),
    new THREE.Vector3(0, -1, 2),
    new THREE.Vector3(-6, 0, 0),
    new THREE.Vector3(-10, -0.1, -2)
];

// Проверка точек
controlPoints.forEach((point, index) => {
    console.log(`Control point ${index}:`, point, 'Is Vector3:', point instanceof THREE.Vector3);
});

targetPoints.forEach((point, index) => {
    console.log(`Target point ${index}:`, point, 'Is Vector3:', point instanceof THREE.Vector3);
});

// Анимация
animateCameraAlongCurve(controlPoints, targetPoints, 3);

