import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.querySelector('#scene');
const loading = document.querySelector('#loading');
const badge = document.querySelector('#badge');

const typeSelect = document.querySelector('#type');
const crystalSlider = document.querySelector('#crystals');
const glossSlider = document.querySelector('#gloss');
const transparencySlider = document.querySelector('#transparency');
const raritySlider = document.querySelector('#rarity');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x03040a);

const camera = new THREE.PerspectiveCamera(
  42,
  innerWidth / innerHeight,
  0.05,
  100
);

camera.position.set(0, 0.8, 6.5);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  preserveDrawingBuffer: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const pmrem = new THREE.PMREMGenerator(renderer);

scene.environment =
  pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;


/* =========================================================
   CAMERA / TOUCH
========================================================= */

const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;
controls.dampingFactor = 0.055;

controls.minDistance = 3;
controls.maxDistance = 10;

controls.target.set(0, 0, 0);


/* =========================================================
   MINERAL GROUP
========================================================= */

const mineralGroup = new THREE.Group();

scene.add(mineralGroup);


/* =========================================================
   LIGHTING
========================================================= */

const keyLight = new THREE.DirectionalLight(
  0xffffff,
  6
);

keyLight.position.set(4, 6, 5);

scene.add(keyLight);


const fillLight = new THREE.PointLight(
  0x7ca6ff,
  25,
  14
);

fillLight.position.set(-4, 2, 3);

scene.add(fillLight);


const pinkLight = new THREE.PointLight(
  0xff4fd8,
  22,
  12
);

pinkLight.position.set(4, -1, -4);

scene.add(pinkLight);


const topLight = new THREE.PointLight(
  0xffffff,
  16,
  10
);

topLight.position.set(0, 5, 1);

scene.add(topLight);


/* =========================================================
   DISPLAY FLOOR
========================================================= */

const floorGeometry = new THREE.CircleGeometry(7, 96);

const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x080a11,
  roughness: 0.65,
  metalness: 0.15
});

const floor = new THREE.Mesh(
  floorGeometry,
  floorMaterial
);

floor.rotation.x = -Math.PI / 2;

floor.position.y = -1.9;

scene.add(floor);


/* =========================================================
   MINERAL DATABASE
========================================================= */

const MINERALS = {

  amethyst: {
    name: 'AMETHYST',
    color: 0x7137aa,
    highlight: 0xd9a8ff,
    roughness: 0.12,
    metalness: 0.02,
    transmission: 0.28,
    ior: 1.54,
    crystal: true
  },

  quartz: {
    name: 'QUARTZ',
    color: 0xc9e9ff,
    highlight: 0xffffff,
    roughness: 0.06,
    metalness: 0,
    transmission: 0.75,
    ior: 1.46,
    crystal: true
  },

  pyrite: {
    name: 'PYRITE',
    color: 0xa87918,
    highlight: 0xffe39a,
    roughness: 0.13,
    metalness: 0.92,
    transmission: 0,
    ior: 1.5,
    crystal: true
  },

  obsidian: {
    name: 'OBSIDIAN',
    color: 0x090d16,
    highlight: 0x6f8dca,
    roughness: 0.045,
    metalness: 0.1,
    transmission: 0.18,
    ior: 1.48,
    crystal: false
  },

  malachite: {
    name: 'MALACHITE',
    color: 0x08704b,
    highlight: 0x73e4aa,
    roughness: 0.23,
    metalness: 0.05,
    transmission: 0.05,
    ior: 1.6,
    crystal: false
  },

  turquoise: {
    name: 'TURQUOISE',
    color: 0x16aaa3,
    highlight: 0xa8fff2,
    roughness: 0.2,
    metalness: 0.02,
    transmission: 0.08,
    ior: 1.61,
    crystal: false
  },

  opal: {
    name: 'OPAL',
    color: 0xdce7ec,
    highlight: 0xffffff,
    roughness: 0.07,
    metalness: 0,
    transmission: 0.6,
    ior: 1.45,
    crystal: false,
    opal: true
  },

  moonstone: {
    name: 'MOONSTONE',
    color: 0x9cb9db,
    highlight: 0xe4efff,
    roughness: 0.08,
    metalness: 0,
    transmission: 0.46,
    ior: 1.52,
    crystal: false
  },

  ruby: {
    name: 'RUBY',
    color: 0xa90720,
    highlight: 0xff8798,
    roughness: 0.06,
    metalness: 0,
    transmission: 0.45,
    ior: 1.77,
    crystal: true
  },

  sapphire: {
    name: 'SAPPHIRE',
    color: 0x1049a9,
    highlight: 0x8dbaff,
    roughness: 0.055,
    metalness: 0,
    transmission: 0.42,
    ior: 1.77,
    crystal: true
  }

};


/* =========================================================
   RANDOM
========================================================= */

function random(min, max) {
  return min + Math.random() * (max - min);
}


function randomChoice(array) {
  return array[
    Math.floor(Math.random() * array.length)
  ];
}


function randomMineral() {

  const keys = Object.keys(MINERALS);

  return randomChoice(keys);
}


/* =========================================================
   DISPOSE
========================================================= */

function disposeObject(object) {

  object.traverse(child => {

    if (child.geometry) {
      child.geometry.dispose();
    }

    if (child.material) {

      if (Array.isArray(child.material)) {

        child.material.forEach(material => {
          material.dispose();
        });

      } else {

        child.material.dispose();

      }

    }

  });

}


/* =========================================================
   CLEAR OLD MINERAL
========================================================= */

function clearMineral() {

  while (mineralGroup.children.length > 0) {

    const child = mineralGroup.children.pop();

    disposeObject(child);

  }

}


/* =========================================================
   ROCK MATERIAL
========================================================= */

function createRockMaterial(config, rarity) {

  const gloss =
    Number(glossSlider.value) / 100;

  const transparency =
    Number(transparencySlider.value) / 100;

  const material =
    new THREE.MeshPhysicalMaterial({

      color: config.color,

      roughness:
        Math.max(
          0.025,
          config.roughness +
          (1 - gloss) * 0.35
        ),

      metalness:
        config.metalness,

      clearcoat:
        0.55 + gloss * 0.45,

      clearcoatRoughness:
        0.035 + (1 - gloss) * 0.1,

      transmission:
        config.transmission *
        (0.45 + transparency * 0.55),

      thickness:
        0.8 + rarity * 2.8,

      ior:
        config.ior,

      envMapIntensity:
        1.5 + gloss * 2.0,

      iridescence:
        config.opal
          ? 0.85 + rarity * 0.15
          : 0,

      iridescenceIOR:
        1.33,

      sheen:
        config.opal ? 0.8 : 0.05

    });

  return material;

}


/* =========================================================
   PROCEDURAL ROCK
========================================================= */

function createRock(config, rarity) {

  const geometry =
    new THREE.IcosahedronGeometry(
      1.7,
      5
    );

  const positions =
    geometry.attributes.position;

  const vertex = new THREE.Vector3();

  const seed =
    Math.random() * 10000;

  for (
    let i = 0;
    i < positions.count;
    i++
  ) {

    vertex.fromBufferAttribute(
      positions,
      i
    );

    const noise =
      Math.sin(
        vertex.x * 4.8 + seed
      ) * 0.09 +

      Math.sin(
        vertex.y * 6.2 - seed
      ) * 0.08 +

      Math.sin(
        vertex.z * 5.7 + seed * 0.7
      ) * 0.08;

    const scale =
      1 +
      noise +
      random(-0.045, 0.045);

    vertex.multiplyScalar(scale);

    vertex.x *= random(0.92, 1.08);

    vertex.y *= random(0.82, 1.12);

    vertex.z *= random(0.9, 1.06);

    positions.setXYZ(
      i,
      vertex.x,
      vertex.y,
      vertex.z
    );

  }

  positions.needsUpdate = true;

  geometry.computeVertexNormals();

  const mesh =
    new THREE.Mesh(
      geometry,
      createRockMaterial(
        config,
        rarity
      )
    );

  mesh.rotation.set(
    random(-0.25, 0.25),
    random(0, Math.PI * 2),
    random(-0.2, 0.2)
  );

  mineralGroup.add(mesh);

  return mesh;

}


/* =========================================================
   CRYSTAL
========================================================= */

function createCrystal(
  config,
  index,
  total,
  rarity
) {

  const height =
    random(0.65, 1.55) *
    (0.8 + rarity * 0.75);

  const radius =
    random(0.14, 0.32);

  let sides;

  if (config.name === 'PYRITE') {

    sides = 4;

  } else {

    sides =
      randomChoice([
        5,
        6,
        6,
        8
      ]);

  }

  const geometry =
    new THREE.CylinderGeometry(
      radius,
      radius * 0.94,
      height,
      sides,
      1,
      false
    );

  const material =
    new THREE.MeshPhysicalMaterial({

      color: config.highlight,

      roughness:
        config.name === 'PYRITE'
          ? 0.12
          : 0.055,

      metalness:
        config.name === 'PYRITE'
          ? 0.95
          : 0.01,

      clearcoat: 0.95,

      clearcoatRoughness: 0.035,

      transmission:
        config.transmission * 0.7,

      thickness: 1.7,

      ior: config.ior,

      envMapIntensity: 2.5,

      iridescence:
        config.opal ? 1 : 0

    });

  const crystal =
    new THREE.Mesh(
      geometry,
      material
    );

  const angle =
    index / Math.max(1, total) *
    Math.PI * 2 +
    random(-0.35, 0.35);

  const distance =
    random(0.2, 1.1);

  crystal.position.set(
    Math.cos(angle) * distance,
    random(-0.35, 0.45),
    Math.sin(angle) * distance
  );

  crystal.rotation.set(
    random(-0.25, 0.25),
    angle + random(-0.3, 0.3),
    random(-0.25, 0.25)
  );

  mineralGroup.add(crystal);


  /* ---- Crystal termination ---- */

  const capGeometry =
    new THREE.ConeGeometry(
      radius * 1.03,
      radius * 0.55,
      sides
    );

  const cap =
    new THREE.Mesh(
      capGeometry,
      material
    );

  cap.position.copy(
    crystal.position
  );

  cap.position.y +=
    height / 2 +
    radius * 0.23;

  cap.rotation.copy(
    crystal.rotation
  );

  mineralGroup.add(cap);

}


/* =========================================================
   INTERNAL INCLUSIONS
========================================================= */

function createInclusions(
  config,
  rarity
) {

  const count =
    Math.floor(
      5 + rarity * 18
    );

  const material =
    new THREE.MeshPhysicalMaterial({

      color: config.highlight,

      transparent: true,

      opacity:
        0.08 + rarity * 0.22,

      roughness: 0.2,

      transmission: 0.25,

      emissive: config.highlight,

      emissiveIntensity:
        0.03 + rarity * 0.08

    });


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const size =
      random(0.012, 0.045);

    const geometry =
      new THREE.SphereGeometry(
        size,
        7,
        5
      );

    const particle =
      new THREE.Mesh(
        geometry,
        material
      );

    particle.position.set(
      random(-1.25, 1.25),
      random(-1.25, 1.25),
      random(-1.25, 1.25)
    );

    if (
      particle.position.length() >
      1.4
    ) {

      particle.position
        .setLength(
          random(0.45, 1.3)
        );

    }

    mineralGroup.add(
      particle
    );

  }

}


/* =========================================================
   MINERAL CRACKS
========================================================= */

function createCracks(
  config,
  rarity
) {

  if (rarity < 0.35) {
    return;
  }

  const material =
    new THREE.LineBasicMaterial({

      color: config.highlight,

      transparent: true,

      opacity:
        0.12 + rarity * 0.2,

      blending:
        THREE.AdditiveBlending

    });


  const number =
    Math.floor(
      2 + rarity * 6
    );


  for (
    let i = 0;
    i < number;
    i++
  ) {

    const points = [];

    let x =
      random(-0.7, 0.7);

    let y =
      random(-0.9, 0.9);

    let z =
      random(-0.7, 0.7);


    for (
      let j = 0;
      j < 8;
      j++
    ) {

      points.push(
        new THREE.Vector3(
          x,
          y,
          z
        )
      );

      x += random(-0.13, 0.13);
      y += random(-0.16, 0.16);
      z += random(-0.13, 0.13);

    }


    const geometry =
      new THREE.BufferGeometry()
        .setFromPoints(points);

    const line =
      new THREE.Line(
        geometry,
        material
      );

    mineralGroup.add(line);

  }

}


/* =========================================================
   OPAL / PYRITE SPARKLES
========================================================= */

function createSparkles(
  config,
  rarity
) {

  if (
    config.name !== 'OPAL' &&
    config.name !== 'PYRITE' &&
    rarity < 0.55
  ) {

    return;

  }


  const positions = [];

  const count =
    70 + Math.floor(rarity * 130);


  for (
    let i = 0;
    i < count;
    i++
  ) {

    positions.push(
      random(-1.45, 1.45),
      random(-1.4, 1.4),
      random(-1.45, 1.45)
    );

  }


  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      positions,
      3
    )
  );


  const material =
    new THREE.PointsMaterial({

      color: config.highlight,

      size:
        0.012 +
        rarity * 0.026,

      transparent: true,

      opacity:
        0.3 +
        rarity * 0.55,

      blending:
        THREE.AdditiveBlending,

      depthWrite: false

    });


  const particles =
    new THREE.Points(
      geometry,
      material
    );

  mineralGroup.add(
    particles
  );

}


/* =========================================================
   GLOW HALO
========================================================= */

function createGlow(config, rarity) {

  const geometry =
    new THREE.SphereGeometry(
      1.85,
      32,
      32
    );

  const material =
    new THREE.MeshBasicMaterial({

      color: config.highlight,

      transparent: true,

      opacity:
        0.015 +
        rarity * 0.035,

      blending:
        THREE.AdditiveBlending,

      side:
        THREE.BackSide

    });

  const glow =
    new THREE.Mesh(
      geometry,
      material
    );

  mineralGroup.add(glow);

}


/* =========================================================
   GENERATE MINERAL
========================================================= */

function generateMineral() {

  loading.classList.remove(
    'hidden'
  );


  requestAnimationFrame(() => {

    clearMineral();


    let selected =
      typeSelect.value;


    if (
      selected === 'random'
    ) {

      selected =
        randomMineral();

    }


    const config =
      MINERALS[selected];


    const rarity =
      Number(
        raritySlider.value
      ) / 100;


    const crystals =
      Number(
        crystalSlider.value
      );


    createRock(
      config,
      rarity
    );


    if (
      config.crystal
    ) {

      for (
        let i = 0;
        i < crystals;
        i++
      ) {

        createCrystal(
          config,
          i,
          crystals,
          rarity
        );

      }

    }


    createInclusions(
      config,
      rarity
    );


    createCracks(
      config,
      rarity
    );


    createSparkles(
      config,
      rarity
    );


    createGlow(
      config,
      rarity
    );


    badge.textContent =
      config.name;


    mineralGroup.rotation.set(
      0,
      0,
      0
    );


    loading.classList.add(
      'hidden'
    );

  });

}


/* =========================================================
   RANDOM GENERATION BUTTON
========================================================= */

document
  .querySelector('#generate')
  .addEventListener(
    'click',
    generateMineral
  );


document
  .querySelector('#randomTop')
  .addEventListener(
    'click',
    () => {

      typeSelect.value =
        'random';


      raritySlider.value =
        Math.floor(
          random(45, 100)
        );


      glossSlider.value =
        Math.floor(
          random(70, 100)
        );


      transparencySlider.value =
        Math.floor(
          random(15, 90)
        );


      crystalSlider.value =
        Math.floor(
          random(3, 13)
        );


      generateMineral();

    }
  );


/* =========================================================
   DOWNLOAD PNG
========================================================= */

document
  .querySelector('#download')
  .addEventListener(
    'click',
    () => {

      renderer.render(
        scene,
        camera
      );


      const link =
        document.createElement('a');

      link.download =
        'procedural-gem.png';

      link.href =
        renderer.domElement
          .toDataURL(
            'image/png'
          );

      link.click();

    }
  );


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
  'resize',
  () => {

    camera.aspect =
      innerWidth /
      innerHeight;

    camera.updateProjectionMatrix();


    renderer.setSize(
      innerWidth,
      innerHeight
    );


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

  }
);


/* =========================================================
   ANIMATION
========================================================= */

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );


  const elapsed =
    clock.getElapsedTime();


  /*
   * 非常慢的自動旋轉，
   * 使用者拖曳後仍可自由控制。
   */

  mineralGroup.rotation.y +=
    0.0015;


  /*
   * 微小上下浮動，
   * 讓礦石看起來不像靜態模型。
   */

  mineralGroup.position.y =
    Math.sin(
      elapsed * 0.8
    ) * 0.035;


  /*
   * 光源緩慢移動，
   * 讓高光在礦石表面流動。
   */

  keyLight.position.x =
    Math.sin(
      elapsed * 0.45
    ) * 4;


  keyLight.position.z =
    Math.cos(
      elapsed * 0.45
    ) * 4;


  fillLight.position.x =
    Math.sin(
      elapsed * 0.3
    ) * 5;


  pinkLight.position.z =
    Math.cos(
      elapsed * 0.5
    ) * 5;


  controls.update();


  renderer.render(
    scene,
    camera
  );

}


/* =========================================================
   START
========================================================= */

generateMineral();

animate();
