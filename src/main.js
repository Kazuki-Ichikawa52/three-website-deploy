import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";

console.log(THREE);

/**
 * UIでバックを実装
 */
const gui = new dat.GUI();

// キャンバスの取得
const canvas = document.querySelector(".webgl");

/**
 * 必須の3要素の追加
 */

// シーン
const scene = new THREE.Scene();

// サイズ設定
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

camera.position.z = sizes.width < 400 ? 10 : 6; // モバイルではカメラを遠ざける
scene.add(camera);

// レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, // レンダラーによる背景遮断を透明に
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // デバイスピクセル比を制限

/** オブジェクトの作成 */

// マテリアル
const material = new THREE.MeshPhysicalMaterial({
  color: "#c6b3ff",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: false,
});

// デスクトップ版ではGUIを表示
if (sizes.width >= 768) {
  gui.addColor(material, "color").name("Color");
  gui.add(material, "metalness").min(0).max(1).step(0.001).name("Metalness");
  gui.add(material, "roughness").min(0).max(1).step(0.001).name("Roughness");
}

// メッシュ
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

// 初期スケール設定（スマホ向け）
const scale = sizes.width < 400 ? 0.7 : 1;
mesh1.scale.set(scale, scale, scale);
mesh2.scale.set(scale, scale, scale);
mesh3.scale.set(scale, scale, scale);
mesh4.scale.set(scale, scale, scale);

// 回転用に配置する
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 3);

scene.add(mesh1, mesh2, mesh3, mesh4);
const meshes = [mesh1, mesh2, mesh3, mesh4];

/**
 * パーティクルを追加
 */

// パーティクルジオメトリ
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = sizes.width < 400 ? 300 : 700; // モバイルではパーティクルを減少
const positionArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

// パーティクルマテリアル
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.025,
  color: "#ffffff",
});

// パーティクルメッシュ化
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * ライトを追加
 */
const directionalLight = new THREE.DirectionalLight("ffffff", 5);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

// ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  // サイズのアップデート
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // レンダラーのアップデート
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // カメラ位置を調整
  camera.position.z = sizes.width < 400 ? 10 : 6;

  // スケール調整
  const scale = sizes.width < 400 ? 0.7 : 1;
  mesh1.scale.set(scale, scale, scale);
  mesh2.scale.set(scale, scale, scale);
  mesh3.scale.set(scale, scale, scale);
  mesh4.scale.set(scale, scale, scale);

  // モバイルとデスクトップでGUIの表示を切り替え
  if (sizes.width >= 400 && gui._hidden) {
    gui.show();
  } else if (sizes.width < 400 && !gui._hidden) {
    gui.hide();
  }
});

// アニメーション
const clock = new THREE.Clock();

const animate = () => {
  renderer.render(scene, camera);

  const getDeltaTime = clock.getDelta();

  // メッシュを回転させる
  for (const mesh of meshes) {
    mesh.rotation.x += 0.1 * getDeltaTime;
    mesh.rotation.y += 0.12 * getDeltaTime;
  }

  window.requestAnimationFrame(animate);
};

animate();
