import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";

// GUIの設定
const gui = new dat.GUI(); // GUIを有効化

// キャンバスの取得
const canvas = document.querySelector(".webgl");

// 必須の3要素の追加
const scene = new THREE.Scene();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// カメラ
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = sizes.width < 768 ? 10 : 6; // モバイルでは遠ざける
scene.add(camera);

// レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// マテリアルとオブジェクト
const material = new THREE.MeshPhysicalMaterial({
  color: "#c6b3ff",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: false,
});

// GUIをデスクトップ向けに設定
if (sizes.width >= 768) {
  gui.addColor(material, "color").name("Color");
  gui.add(material, "metalness").min(0).max(1).step(0.001).name("Metalness");
  gui.add(material, "roughness").min(0).max(1).step(0.001).name("Roughness");
}

// メッシュの作成
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

// スケール設定
const scale = sizes.width < 768 ? 0.7 : 1;
mesh1.scale.set(scale, scale, scale);
mesh2.scale.set(scale, scale, scale);
mesh3.scale.set(scale, scale, scale);
mesh4.scale.set(scale, scale, scale);

// 配置
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 3);
scene.add(mesh1, mesh2, mesh3, mesh4);

const meshes = [mesh1, mesh2, mesh3, mesh4];

// パーティクル
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = sizes.width < 768 ? 300 : 700;
const positionArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.025,
  color: "#ffffff",
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// ライト
const directionalLight = new THREE.DirectionalLight("ffffff", 5);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

// リサイズ処理
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.position.z = sizes.width < 768 ? 10 : 6;

  const scale = sizes.width < 768 ? 0.7 : 1;
  mesh1.scale.set(scale, scale, scale);
  mesh2.scale.set(scale, scale, scale);
  mesh3.scale.set(scale, scale, scale);
  mesh4.scale.set(scale, scale, scale);
});

// ホイール操作（デスクトップ用）
let speed = 0;
let rotation = 0;

window.addEventListener("wheel", (event) => {
  speed += event.deltaY * 0.0002; // ホイールで回転速度を調整
});

// タッチ操作（モバイル用）
let startY = 0;
window.addEventListener("touchstart", (event) => {
  startY = event.touches[0].clientY;
});

window.addEventListener("touchmove", (event) => {
  const deltaY = event.touches[0].clientY - startY;
  speed += deltaY * 0.0002; // スワイプで回転速度を調整
  startY = event.touches[0].clientY;
});

// 回転処理
function rot() {
  rotation += speed;
  speed *= 0.93; // 減速処理

  // ジオメトリ全体を回転
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);

  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);

  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);

  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));

  window.requestAnimationFrame(rot);
}

rot();

// アニメーション
const clock = new THREE.Clock();
const animate = () => {
  renderer.render(scene, camera);

  const delta = clock.getDelta();
  meshes.forEach((mesh) => {
    mesh.rotation.x += 0.1 * delta;
    mesh.rotation.y += 0.12 * delta;
  });

  window.requestAnimationFrame(animate);
};

animate();
