// Элементы интерфейса
const startScreen = document.getElementById('start-screen');
const statusEl = document.getElementById('status');
const messageEl = document.getElementById('message');
const progressTop = document.getElementById('progress-bar-top');
const closeButton = document.getElementById('close-button');
const modelInfo = document.getElementById('model-details');
const hintPanel = document.getElementById('hint-panel');
const hintToggle = document.getElementById('hint-toggle');

hintToggle.addEventListener('click', () => {
    hintPanel.style.display = 'none';
});

// Сцена, камера, рендерер
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// Освещение и HDR
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new THREE.RGBELoader()
    .setPath('hdr/')
    .load('photo_studio_broadway_hall_1k.hdr', texture => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.environment = envMap;
        scene.background = null;
        texture.dispose();
        pmremGenerator.dispose();
    });

// Загрузчик GLTF + Draco
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');
const loader = new THREE.GLTFLoader().setDRACOLoader(dracoLoader);

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
Object.assign(controls, {
    enablePan: false,
    enableZoom: true,
    minDistance: 5,
    maxDistance: 8,
    minPolarAngle: Math.PI / 4,
    maxPolarAngle: Math.PI / 2,
    enableDamping: true,
    dampingFactor: 0.05
});

// Автовращение
let idleTimeout = null;
const idleDelay = 10000;
const resetIdleTimer = () => {
    clearTimeout(idleTimeout);
    controls.autoRotate = false;
    idleTimeout = setTimeout(() => controls.autoRotate = true, idleDelay);
};
['mousedown', 'keydown', 'wheel', 'touchstart'].forEach(e => window.addEventListener(e, resetIdleTimer));
resetIdleTimer();

// Глобальные переменные
const modelCache = {};
let hideObjects = [];

// Спиннер и статус
const spinner = document.getElementById('loading-spinner');

function updateStatus(text, progress = 0, isError = false) {
    progressTop.style.width = progress + '%';
    statusEl.style.opacity = '1';
    statusEl.style.display = 'block';
    messageEl.textContent = text;

    spinner.style.display = progress > 0 && progress < 100 ? 'block' : 'none';

    if (isError) statusEl.classList.add('error');
    else statusEl.classList.remove('error');

    if (progress >= 100) {
        setTimeout(() => {
            statusEl.style.opacity = '0';
            progressTop.style.width = '0%';
            setTimeout(() => statusEl.style.display = 'none', 500);
        }, 500);
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
        scene.add(modelCache[modelPath].clone(true));
        setupCameraAndInfo(modelPath, scene.children[scene.children.length - 1]);
        updateStatus('Готово', 100);
        closeButton.style.display = 'block';
        return;
    }

    updateStatus('Загрузка модели...', 10);

    loader.load(
        modelPath,
        gltf => {
            updateStatus('Обработка модели...', 90);
            clearScene();
            const model = gltf.scene;
            modelCache[modelPath] = model.clone(true);
            scene.add(model);
            setupCameraAndInfo(modelPath, model);
            updateStatus('Готово', 100);
            closeButton.style.display = 'block';
        },
        xhr => {
            const loadedMB = (xhr.loaded / 1024 / 1024).toFixed(1);
            const progress = xhr.lengthComputable 
                ? 10 + (xhr.loaded / xhr.total) * 90 
                : Math.min(10 + xhr.loaded * 0.00005, 90);
            updateStatus(`Загружается: ${loadedMB} MB`, progress);
        },
        error => {
            console.error('Ошибка загрузки:', error);
            updateStatus('Ошибка загрузки модели.', 0, true);
        }
    );
}

function clearScene() {
    for (let i = scene.children.length - 1; i >= 0; i--) {
        const child = scene.children[i];
        if (child.type !== 'AmbientLight') scene.remove(child);
    }
}

async function setupCameraAndInfo(modelPath, sceneObject) {
    hideObjects = [];

    const box = new THREE.Box3().setFromObject(sceneObject);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    const distance = size * 1.2;

    // Динамически подгружаем конфиг модели
    let config;
    try {
        if (modelPath.includes('Studio_Baked')) {
            config = (await import('./models/Studio_Baked.config.js')).default;
        } else if (modelPath.includes('Bedroom_Baked')) {
            config = (await import('./models/Bedroom_Baked.config.js')).default;
        } else {
            console.warn('Конфиг для модели не найден:', modelPath);
            return;
        }
    } catch (e) {
        console.error('Ошибка загрузки конфига:', e);
        return;
    }

    // Камера
    camera.position.copy(center.clone().add(new THREE.Vector3(config.camera.hor, config.camera.vert, distance)));
    controls.target.copy(center);
    controls.update();

    controls.minDistance = config.limits.min;
    controls.maxDistance = config.limits.max;

    // Скрываемые объекты
    sceneObject.traverse(child => {
        if (child.isMesh && child.material?.envMapIntensity !== undefined) {
            child.material.envMapIntensity = 0.75;
            child.material.needsUpdate = true;
        }

        if (child.isMesh || child.isGroup) {
            for (const cfg of config.hideObjects) {
                if (child.name === cfg.name) {
                    hideObjects.push({ obj: child, config: cfg });
                    //console.log(`Объект ${cfg.name} найден — включено скрытие`);
                }
            }
        }
    });

    // Информация о модели
    modelInfo.innerHTML = config.infoHTML || 
        `<div class="detail-item"><strong>Info missing</strong><br>Add info to ${modelPath}.config.js</div>`;
    modelInfo.style.display = 'block';
}

// Выбор модели
document.querySelectorAll('.model-option').forEach(option => {
    option.addEventListener('click', () => {
        loadModel(option.getAttribute('data-model'));
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

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Анимация
function animate() {
    requestAnimationFrame(animate);
    controls.update();

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

            obj.traverse(o => {
                if (o.isMesh) o.visible = shouldBeVisible;
            });

            // Отладка
            // console.log(`${config.name}: dot = ${dotHorizontal.toFixed(3)} | visible = ${shouldBeVisible}`);
        });
    }

    renderer.render(scene, camera);
}

animate();