// Элементы интерфейса
const startScreen = document.getElementById('start-screen');
const statusEl = document.getElementById('status');
const messageEl = document.getElementById('message');
const progressTop = document.getElementById('progress-bar-top');
const closeButton = document.getElementById('close-button');
const modelInfo = document.getElementById('model-details');
const modelCache = {}; // Кэш моделей
const hintPanel = document.getElementById('hint-panel');
const hintToggle = document.getElementById('hint-toggle');

hintToggle.addEventListener('click', () => {
    hintPanel.style.display = 'none';
});

// Создание сцены
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// Освещение
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new THREE.RGBELoader()
    .setPath('hdr/')
    .load('photo_studio_broadway_hall_1k.hdr', function (texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.environment = envMap;
        scene.background = null;
        texture.dispose();
        pmremGenerator.dispose();
    });

// Draco-декодер
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');
const loader = new THREE.GLTFLoader();
loader.setDRACOLoader(dracoLoader);

// Управление камерой
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = true;
controls.minDistance = 5;
controls.maxDistance = 8;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2;
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Автовращение при бездействии
let idleTimeout = null;
const idleDelay = 10000;

function resetIdleTimer() {
    clearTimeout(idleTimeout);
    controls.autoRotate = false;
    idleTimeout = setTimeout(() => {
        controls.autoRotate = true;
    }, idleDelay);
}

['mousedown', 'keydown', 'wheel', 'touchstart'].forEach(event =>
    window.addEventListener(event, resetIdleTimer)
);
resetIdleTimer();

// Массив конфигов объектов для скрытия
// STUDIO
const studioObjects = [
    {
        name: 'living_20',
        threshold: 0.1,
        invert: false,
        direction: new THREE.Vector3(0, 0, -1)
    },
    {
        name: 'korobka3_001',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'living_Mirror',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'living_Tv_Screen',
        threshold: 0.1,
        invert: false,
        direction: new THREE.Vector3(1, 0, 1)
    },
    {
        name: 'living_Tv_Frame',
        threshold: 0.1,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'living_17_2',
        threshold: -0.1,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'korobka_topfacade001',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'living_10_2',
        threshold: -0.1,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'korobka3_003',
        threshold: 0.1,
        invert: false,
        direction: new THREE.Vector3(0, 0, -1)
    },
    {
        name: 'korobka3_004',
        threshold: 0.1,
        invert: false,
        direction: new THREE.Vector3(0, 0, -1)
    },
    {
        name: 'bathroom_04_2',
        threshold: -0.1,
        invert: false,
        direction: new THREE.Vector3(0, 0, -1)
    },
    {
        name: 'bathroom_05_2',
        threshold: -0.1,
        invert: false,
        direction: new THREE.Vector3(0, 0, -1)
    },
    {
        name: 'bathroom_Mirror',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, -1)
    },
    {
        name: 'korobka3_006',
        threshold: -0.2,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'korobka3_007',
        threshold: -0.1,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'living_11_2',
        threshold: -0.1,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'korobka_topfacade_2',
        threshold: -0.1,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'bathroom_04_1',
        threshold: -0.1,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'korobka3_008',
        threshold: -0.1,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'living_18_2',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
   /* {
        name: 'Living_Ceiling_Combined',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(-1, 0, 0)
    }*/
];

// BEDROOM
const bedroomObjects = [
    {
        name: 'korobka_000',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(-1, 0, 0)
    },
    {
        name: 'living_12_005',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(-1, 0, 0)
    },
    {
        name: 'korobka_001',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'living_09_2',
        threshold: -0.2,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'korobka_003',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'korobka_Caps2',
        threshold: -0.5,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'bathroom2_03_2',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'bathroom2_Banka_4',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'bathroom2_banka_7',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'bathroom2_Banka_8',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'bathroom2_Banka_3',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'bathroom2_Banka_2',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'korobka_004',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'living_08_2',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'living_12_3',
        threshold: -0.3,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'korobka_005',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(-1, 0, 0)
    },
    {
        name: 'living_09_3',
        threshold: -0.2,
        invert: false,
        direction: new THREE.Vector3(-1, 0, 0)
    },
    {
        name: 'living_hood',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(-1, 0, 0)
    },
    {
        name: 'living_11_2',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(-1, 0, 0)
    },
    {
        name: 'living_12_004',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(-1, 0, 0)
    },
    {
        name: 'korobka_006',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'bathroom2_Banka_5',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'bathroom2_Banka_6',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'bathroom2_Window',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'korobka_007',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'bathroom1_01_003',
        threshold: -0.25,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'bathroom1_WindowFrame',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'korobka_008',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'living_02_2',
        threshold: -0.5,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'living_12_2',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(0, 0, 1)
    },
    {
        name: 'korobka_009',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'bedroom_02_2',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'bathroom1_02_2',
        threshold: -0.1,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'bathroom1_01_2',
        threshold: -0.1,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    },
    {
        name: 'bathroom1_Mirror',
        threshold: 0,
        invert: false,
        direction: new THREE.Vector3(1, 0, 0)
    }
];

// Переменные для объектов
let hideObjects = [];

// Спиннер и прогресс
const spinner = document.getElementById('loading-spinner');

// Обновление статуса
function updateStatus(text, progress = 0, isError = false) {
    progressTop.style.width = progress + '%';
    statusEl.style.opacity = '1';
    statusEl.style.display = 'block';
    messageEl.textContent = text;

    if (progress > 0 && progress < 100) {
        spinner.style.display = 'block';
    } else {
        spinner.style.display = 'none';
    }

    if (isError) {
        statusEl.classList.add('error');
    } else {
        statusEl.classList.remove('error');
        if (progress >= 100) {
            setTimeout(() => {
                statusEl.style.opacity = '0';
                progressTop.style.width = '0%';
                setTimeout(() => statusEl.style.display = 'none', 500);
            }, 500);
        }
    }
}

// Загрузка модели
function loadModel(modelPath) {
    startScreen.style.display = 'none';
    statusEl.style.display = 'block';
    statusEl.classList.remove('error');

    if (modelCache[modelPath]) {
        updateStatus('Загрузка из кэша...', 90);
        clearScene();
        const cachedScene = modelCache[modelPath].clone(true);
        scene.add(cachedScene);
        setupCameraAndInfo(modelPath, cachedScene);
        updateStatus('Готово', 100);
        closeButton.style.display = 'block';
        return;
    }

    updateStatus('Загрузка модели...', 10);

    loader.load(
        modelPath,
        (gltf) => {
            updateStatus('Обработка модели...', 90);
            clearScene();
            const originalScene = gltf.scene;
            modelCache[modelPath] = originalScene.clone(true);
            scene.add(originalScene);
            setupCameraAndInfo(modelPath, originalScene);
            updateStatus('Готово', 100);
            closeButton.style.display = 'block';
        },
        (xhr) => {
            const loadedMB = (xhr.loaded / 1024 / 1024).toFixed(1);
            if (xhr.lengthComputable && xhr.total > 0) {
                const totalMB = (xhr.total / 1024 / 1024).toFixed(1);
                const percent = (xhr.loaded / xhr.total) * 100;
                const progress = 10 + percent * 0.8;
                updateStatus(`Загружается: ${loadedMB} MB / ${totalMB} MB (${Math.round(progress)}%)`, progress);
            } else {
                const fakeProgress = Math.min(10 + xhr.loaded * 0.00005, 90);
                updateStatus(`Загрузка... (${loadedMB} MB)`, fakeProgress);
            }
        },
        (error) => {
            console.error('Ошибка загрузки:', error);
            updateStatus('Ошибка загрузки модели.', 0, true);
        }
    );
}

function clearScene() {
    while (scene.children.length > 1) {
        scene.remove(scene.children[1]);
    }
}

function setupCameraAndInfo(modelPath, sceneObject) {
    hideObjects = [];

    const box = new THREE.Box3().setFromObject(sceneObject);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    const distance = size * 1.2;

    const cameraPosition = {
        'models/Studio_Baked.glb': { hor: 15, vert: 30 },
        'models/Bedroom_Baked.glb': { hor: 40, vert: 30 }
    };
    const CameraPos = cameraPosition[modelPath] || { hor: 0, vert: 0 };

    camera.position.copy(center.clone().add(new THREE.Vector3(CameraPos.hor, CameraPos.vert, distance)));
    controls.target.copy(center);
    controls.update();

    const cameraLimits = {
        'models/Studio_Baked.glb': { min: 5, max: 8 },
        'models/Bedroom_Baked.glb': { min: 7, max: 11 }
    };
    const limits = cameraLimits[modelPath] || { min: 1, max: 20 };
    controls.minDistance = limits.min;
    controls.maxDistance = limits.max;

    // Выбираем правильный конфиг в зависимости от модели
    let currentConfig = [];
    if (modelPath.includes('Studio_Baked.glb')) {
        currentConfig = studioObjects;
    } else if (modelPath.includes('Bedroom_Baked.glb')) {
        currentConfig = bedroomObjects;
    } else {
        console.warn('Неизвестная модель, скрытие объектов отключено');
    }

    sceneObject.traverse((child) => {
        if (child.isMesh && child.material && child.material.envMapIntensity !== undefined) {
            child.material.envMapIntensity = 0.75;
            child.material.needsUpdate = true;
        }

        if (child.isMesh || child.isGroup) {
            for (const config of currentConfig) {
                if (child.name === config.name) {
                    hideObjects.push({ obj: child, config });
                    console.log(`Объект ${config.name} найден — включено скрытие`);
                }
            }
        }
    });

    const manualInfoHTML = {
        'models/Studio_Baked.glb': `
            <div class="detail-item">
                <strong>Optimized for AR</strong><br>
                Polys: 4.9m → 378k<br>
                Size: 1.42gb(Max+Textures) → 28mb<br>
                Used 1k textures
            </div>`,
        'models/Bedroom_Baked.glb': `
            <div class="detail-item">
                <strong>Optimized for AR</strong><br>
                Polys: 14.2m → 826k<br>
                Size: 3.44gb(Max+Textures) → 33mb<br>
                Used 1k textures
            </div>`
    };
    const detailsHTML = manualInfoHTML[modelPath] || 
        `<div class="detail-item"><strong>Info missing</strong><br>Add this model to manualInfoHTML</div>`;
    modelInfo.innerHTML = detailsHTML;
    modelInfo.style.display = 'block';
}

// Обработчики выбора модели
document.querySelectorAll('.model-option').forEach(option => {
    option.addEventListener('click', () => {
        const modelPath = option.getAttribute('data-model');
        loadModel(modelPath);
    });
});

// Закрытие модели
closeButton.addEventListener('click', () => {
    clearScene();
    modelInfo.style.display = 'none';
    closeButton.style.display = 'none';
    startScreen.style.display = 'flex';
    camera.position.set(0, 0, 5);
    controls.target.set(0, 0, 0);
    controls.update();
    hideObjects = [];
});

// Подгонка размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Анимация
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Скрытие всех объектов при виде сзади
    if (hideObjects.length > 0) {
        hideObjects.forEach(({ obj, config }) => {
            if (!obj) return;

            const objectPos = new THREE.Vector3();
            obj.getWorldPosition(objectPos);

            const toCameraHorizontal = new THREE.Vector3(
                camera.position.x - objectPos.x,
                0,
                camera.position.z - objectPos.z
            );

            if (toCameraHorizontal.lengthSq() < 0.01) {
                obj.traverse(o => { if (o.isMesh) o.visible = true; });
                return;
            }

            toCameraHorizontal.normalize();

            const forwardHorizontal = new THREE.Vector3();
            if (config.direction) {
                forwardHorizontal.copy(config.direction).normalize();
            } else {
                obj.getWorldDirection(forwardHorizontal);
                forwardHorizontal.y = 0;
                forwardHorizontal.normalize();
            }

            const dotHorizontal = toCameraHorizontal.dot(forwardHorizontal);

            let shouldBeVisible = dotHorizontal >= (config.threshold || 0);
            if (config.invert) shouldBeVisible = !shouldBeVisible;

            obj.traverse((o) => {
                if (o.isMesh) {
                    o.visible = shouldBeVisible;
                }
            });

            // Отладка — оставь включённой для проверки
            console.log(`${config.name}: dot = ${dotHorizontal.toFixed(3)} | visible = ${shouldBeVisible}`);
        });
    }

    renderer.render(scene, camera);
}

animate();