import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as dat from "dat.gui";
import gsap from "gsap";

// Debug
const gui = new dat.GUI({ closed: true });
// gui.hide();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const textloader = new THREE.TextureLoader();
const matcaptexture = textloader.load("/static/texture/diff.png");
const nicetexture = textloader.load("/static/texture/color.png");
const startexture = textloader.load(
  "/static/texture/particlePack_1.1/PNG (Transparent)/star_08.png"
);

// const axeshelper = new THREE.AxesHelper();
// scene.add(axeshelper);

// lights
const pointlight = new THREE.PointLight(0xbf40bf);
pointlight.position.set(5, -5, 5);
const pointlight2 = new THREE.PointLight(0x00ffff);
pointlight2.position.set(5, 5, 5);
scene.add(pointlight, pointlight2);

/**
 * Object
 */
var textGeomentry = null;
var textMaterial = null;
var text = null;

// crystal
const crystalGeomenty = new THREE.OctahedronGeometry(1, 0);
const whiteBasicMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
const shinyMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0.2,
  shininess: 0.9,
  transparent: true,
  opacity: 0.7,
});
const crystal = new THREE.Mesh(crystalGeomenty, shinyMaterial);
const crystal2 = crystal.clone();
crystal.position.x = -4;
crystal2.position.x = 4;
scene.add(crystal, crystal2);

// group
const group = new THREE.Group();

// font loader
const fontloader = new FontLoader();
fontloader.load("/static/fonts/helvetiker_regular.typeface.json", (font) => {
  textGeomentry = new TextGeometry(
    "    Balakrishna \n Web Developer \n Game Developer",
    {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    }
  );
  // textGeomentry.computeBoundingBox();
  // textGeomentry.translate(
  //   -(textGeomentry.boundingBox.max.x - 0.02) * 0.5,
  //   -(textGeomentry.boundingBox.max.y - 0.02) * 0.5,
  //   -(textGeomentry.boundingBox.max.z - 0.03) * 0.5
  // );
  textGeomentry.center();
  console.log(textGeomentry.boundingBox);
  textMaterial = new THREE.MeshMatcapMaterial({ matcap: nicetexture });
  text = new THREE.Mesh(textGeomentry, textMaterial);
  scene.add(text);
});

// particles
const particleGeomentry = new THREE.BufferGeometry();
const count = 1000;
const positions = new Float32Array(3 * count);
const colors = new Float32Array(3 * count);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 100;
  colors[i] = Math.random();
}
particleGeomentry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particleGeomentry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// const particleGeomentry = new THREE.SphereGeometry(10, 320, 320);
const particleMaterial = new THREE.PointsMaterial();
particleMaterial.size = 2;
particleMaterial.sizeAttenuation = true;
// particleMaterial.color = new THREE.Color(0xff88cc);
particleMaterial.transparent = true;
particleMaterial.alphaMap = startexture;
particleMaterial.depthWrite = false;
particleMaterial.blending = THREE.AdditiveBlending;
particleMaterial.vertexColors = true;

const particles = new THREE.Points(particleGeomentry, particleMaterial);
group.add(particles);

//geomentry

const donutGeometry = new THREE.TorusGeometry(0.3, 0.1, 20, 45);
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: nicetexture });
for (let i = 0; i < 1000; i++) {
  const donut = new THREE.Mesh(donutGeometry, shinyMaterial);
  donut.position.x = (Math.random() - 0.5) * 45;
  donut.position.y = (Math.random() - 0.5) * 45;
  donut.position.z = (Math.random() - 0.5) * 45;

  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;
  const scale = Math.random();
  donut.scale.set(scale, scale, scale);

  group.add(donut);
}

scene.add(group);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const cursor = {
  x: 0,
  y: 0,
};

// resize screen
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

// full Screen
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitfullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitrequestFullscreen) {
      canvas.webkitrequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitexitFullscreen) {
      document.webkitexitFullscreen();
    }
  }
});
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

scene.add(camera);
// controls;
const controls = new OrbitControls(camera, canvas);
controls.damping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
let time = Date.now();
const tl = gsap.timeline();
const clock = new THREE.Clock();

const animate = () => {
  requestAnimationFrame(animate);
  const currenttime = Date.now();
  const deltatime = currenttime - time;
  time = currenttime;
  const elapsedTime = clock.getElapsedTime();
  console.log(elapsedTime);
  group.rotation.x += 0.001;
  group.rotation.y += 0.001;
  tl.to(text.rotation, { duration: 5, delay: 0.1, z: Math.PI / 4 })
    .to(text.rotation, {
      duration: 5,
      delay: 0.1,
      z: -Math.PI / 4,
    })
    .to(group.rotation, { duration: 5, z: group.rotation.z + Math.PI / 4 }, "<")
    .to(group.rotation, { duration: 5, x: group.rotation.x + Math.PI / 4 })
    .to(text.rotation, { duration: 5, delay: 0.1, z: Math.PI / 4 })

    .to(group.rotation, { duration: 5, z: group.rotation.z - Math.PI / 4 })
    .to(group.rotation, { duration: 5, x: group.rotation.x - Math.PI / 4 });

  // text.rotation.x += 0.001 * deltatime;
  crystal.rotation.y += 0.01;
  crystal.rotation.z += 0.01;
  crystal2.rotation.y += 0.01;
  crystal2.rotation.z += 0.01;
  camera.position.x = cursor.x * 30;
  camera.position.y = cursor.y * 30;

  controls.update();

  renderer.render(scene, camera);
};

animate();
