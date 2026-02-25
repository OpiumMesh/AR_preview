export default {
  // Позиция и ограничения камеры
  camera: { hor: 15, vert: 30 },
  limits: { min: 5, max: 8 },

  // Информация в панели
  infoHTML: `
    <div class="detail-item">
      <strong>Optimized for AR</strong><br>
      Polys: 4.9m → 378k<br>
      Size: 1.42gb(Max+Textures) → 28mb<br>
      Used 1k textures
    </div>
  `,

  // Список объектов для скрытия
  hideObjects: [
    { name: 'living_20', threshold: 0.1, invert: false, direction: new THREE.Vector3(0, 0, -1) },
    { name: 'korobka3_001', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'living_Mirror', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'living_Tv_Screen', threshold: 0.1, invert: false, direction: new THREE.Vector3(1, 0, 1) },
    { name: 'living_Tv_Frame', threshold: 0.1, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'living_17_2', threshold: -0.1, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'korobka_topfacade001', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'living_10_2', threshold: -0.1, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'korobka3_003', threshold: 0.1, invert: false, direction: new THREE.Vector3(0, 0, -1) },
    { name: 'korobka3_004', threshold: 0.1, invert: false, direction: new THREE.Vector3(0, 0, -1) },
    { name: 'bathroom_04_2', threshold: -0.1, invert: false, direction: new THREE.Vector3(0, 0, -1) },
    { name: 'bathroom_05_2', threshold: -0.1, invert: false, direction: new THREE.Vector3(0, 0, -1) },
    { name: 'bathroom_Mirror', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, -1) },
    { name: 'korobka3_006', threshold: -0.2, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'korobka3_007', threshold: -0.1, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'living_11_2', threshold: -0.1, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'korobka_topfacade_2', threshold: -0.1, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'bathroom_04_1', threshold: -0.1, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'korobka3_008', threshold: -0.1, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'living_18_2', threshold: 0, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    //{ name: 'Living_Ceiling_Combined', threshold: 0.5, invert: false, direction: new THREE.Vector3(0, 1, 0) }
  ]
};