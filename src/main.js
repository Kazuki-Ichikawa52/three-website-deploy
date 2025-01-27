import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";

console.log(THREE);

// キャンバスの取得
const canvas = document.querySelector(".webgl");

// 必須の3要素の追加
const scene = new THREE.Scene();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.z = sizes.width < 400 ? 10 : 6; // スマホではカメラを遠ざける
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// オブジェクトの作成
const material = new THREE.MeshPhysicalMaterial({
  color: "#c6b3ff",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: false,
});

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

// スケール設定
const scale = sizes.width < 400 ? 0.7 : 1;
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
const particlesCount = sizes.width < 400 ? 300 : 700;
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

// リサイズ対応
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.position.z = sizes.width < 400 ? 10 : 6;

  const scale = sizes.width < 400 ? 0.7 : 1;
  mesh1.scale.set(scale, scale, scale);
  mesh2.scale.set(scale, scale, scale);
  mesh3.scale.set(scale, scale, scale);
  mesh4.scale.set(scale, scale, scale);
});

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
