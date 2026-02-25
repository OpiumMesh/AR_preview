export default {
  camera: 
  { hor: 40, vert: 30 },
  limits:
  { min: 7, max: 11 },

  infoHTML: `
    <div class="detail-item">
      <strong>Optimized for AR</strong><br>
      Polys: 14.2m → 826k<br>
      Size: 3.44gb(Max+Textures) → 33mb<br>
      Used 1k textures
    </div>
  `,

  hideObjects: [
    { name: 'korobka_000', threshold: 0, invert: false, direction: new THREE.Vector3(-1, 0, 0) },
    { name: 'living_12_005', threshold: 0, invert: false, direction: new THREE.Vector3(-1, 0, 0) },
    { name: 'korobka_001', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'living_09_2', threshold: -0.2, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'korobka_003', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'korobka_Caps2', threshold: -0.5, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'bathroom2_03_2', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'bathroom2_Banka_4', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'bathroom2_banka_7', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'bathroom2_Banka_8', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'bathroom2_Banka_3', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'bathroom2_Banka_2', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'korobka_004', threshold: 0, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'living_08_2', threshold: 0, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'living_12_3', threshold: -0.3, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'korobka_005', threshold: 0, invert: false, direction: new THREE.Vector3(-1, 0, 0) },
    { name: 'living_09_3', threshold: -0.2, invert: false, direction: new THREE.Vector3(-1, 0, 0) },
    { name: 'living_hood', threshold: 0, invert: false, direction: new THREE.Vector3(-1, 0, 0) },
    { name: 'living_11_2', threshold: -0.25, invert: false, direction: new THREE.Vector3(-1, 0, 0) },
    { name: 'living_12_004', threshold: -0.25, invert: false, direction: new THREE.Vector3(-1, 0, 0) },
    { name: 'korobka_006', threshold: 0, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'bathroom2_Banka_5', threshold: 0, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'bathroom2_Banka_6', threshold: 0, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'bathroom2_Window', threshold: 0, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'korobka_007', threshold: 0.05, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'bathroom1_01_003', threshold: -0.2, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'bathroom1_Banka_2', threshold: 0.35, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'bathroom1_WindowFrame', threshold: 0.1, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'korobka_008', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'living_02_2', threshold: -0.5, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'living_12_2', threshold: 0, invert: false, direction: new THREE.Vector3(0, 0, 1) },
    { name: 'korobka_009', threshold: 0, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'bedroom_02_2', threshold: -0.3, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'bathroom1_02_2', threshold: -0.1, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'bathroom1_01_2', threshold: -0.1, invert: false, direction: new THREE.Vector3(1, 0, 0) },
    { name: 'bathroom1_Mirror', threshold: 0, invert: false, direction: new THREE.Vector3(1, 0, 0) }
  ]
};