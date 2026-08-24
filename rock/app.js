import * as THREE from 'three';
import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import {
  RoomEnvironment
} from 'three/addons/environments/RoomEnvironment.js';


/* =========================================================
   基本設定
========================================================= */

const canvas = document.querySelector('#scene');
const loading = document.querySelector('#loading');
const badge = document.querySelector('#badge');

const typeSelect = document.querySelector('#type');
const crystalSlider = document.querySelector('#crystals');
const glossSlider = document.querySelector('#gloss');
const transparencySlider = document.querySelector('#transparency');
const raritySlider = document.querySelector('#rarity');



/* =========================================================
   THREE.JS
========================================================= */

const scene = new THREE.Scene();

scene.background =
  new THREE.Color(0x03040a);


const camera =
  new THREE.PerspectiveCamera(
    38,
    window.innerWidth / window.innerHeight,
    0.05,
    100
  );

camera.position.set(
  0,
  0.35,
  6.8
);


const renderer =
  new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance'
  });


renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    1.7
  )
);


renderer.outputColorSpace =
  THREE.SRGBColorSpace;


renderer.toneMapping =
  THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
  1.18;



/* =========================================================
   HDR 環境反射
========================================================= */

const pmrem =
  new THREE.PMREMGenerator(
    renderer
  );


scene.environment =
  pmrem.fromScene(
    new RoomEnvironment(renderer),
    0.035
  ).texture;



/* =========================================================
   相機控制
========================================================= */

const controls =
  new OrbitControls(
    camera,
    canvas
  );


controls.enableDamping = true;

controls.dampingFactor = 0.055;

controls.minDistance = 3.2;

controls.maxDistance = 9;

controls.target.set(
  0,
  0.05,
  0
);



/* =========================================================
   礦石總容器
========================================================= */

const mineral =
  new THREE.Group();

scene.add(mineral);



/* =========================================================
   展示台
========================================================= */

const stage =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      3.65,
      3.9,
      0.32,
      96
    ),

    new THREE.MeshStandardMaterial({

      color: 0x15131e,

      roughness: 0.32,

      metalness: 0.18

    })

  );


stage.position.y =
  -1.82;


mineral.add(stage);



const stageTop =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      3.55,
      3.55,
      0.035,
      96
    ),

    new THREE.MeshStandardMaterial({

      color: 0x292033,

      roughness: 0.2,

      metalness: 0.12

    })

  );


stageTop.position.y =
  -1.64;


mineral.add(stageTop);



/* =========================================================
   光源
========================================================= */

const keyLight =
  new THREE.DirectionalLight(
    0xffffff,
    6.5
  );

keyLight.position.set(
  3.8,
  5.5,
  4.5
);

scene.add(keyLight);



const purpleLight =
  new THREE.PointLight(
    0x806cff,
    20,
    12
  );

purpleLight.position.set(
  -4,
  1.8,
  3
);

scene.add(purpleLight);



const pinkLight =
  new THREE.PointLight(
    0xff6ed8,
    18,
    11
  );

pinkLight.position.set(
  4,
  1,
  -4
);

scene.add(pinkLight);



const topLight =
  new THREE.PointLight(
    0xffffff,
    12,
    9
  );

topLight.position.set(
  0,
  5,
  1
);

scene.add(topLight);



/* =========================================================
   礦石資料
========================================================= */

const MINERALS = {

  amethyst: {

    name: 'AMETHYST',

    color: 0x6d2ea8,

    highlight: 0xe0b8ff,

    roughness: 0.085,

    metalness: 0,

    transmission: 0.48,

    ior: 1.54,

    crystals: true

  },


  quartz: {

    name: 'QUARTZ',

    color: 0xc9eaff,

    highlight: 0xffffff,

    roughness: 0.045,

    metalness: 0,

    transmission: 0.78,

    ior: 1.46,

    crystals: true

  },


  pyrite: {

    name: 'PYRITE',

    color: 0xa87815,

    highlight: 0xffe59a,

    roughness: 0.11,

    metalness: 0.9,

    transmission: 0,

    ior: 1.5,

    crystals: true

  },


  obsidian: {

    name: 'OBSIDIAN',

    color: 0x0c111b,

    highlight: 0x6c86c5,

    roughness: 0.035,

    metalness: 0.12,

    transmission: 0.18,

    ior: 1.48,

    crystals: false

  },


  malachite: {

    name: 'MALACHITE',

    color: 0x0b704b,

    highlight: 0x77e8b1,

    roughness: 0.2,

    metalness: 0.03,

    transmission: 0.04,

    ior: 1.6,

    crystals: false

  },


  turquoise: {

    name: 'TURQUOISE',

    color: 0x18aaa2,

    highlight: 0xa8fff2,

    roughness: 0.18,

    metalness: 0.02,

    transmission: 0.06,

    ior: 1.61,

    crystals: false

  },


  opal: {

    name: 'OPAL',

    color: 0xd9e5e9,

    highlight: 0xffffff,

    roughness: 0.055,

    metalness: 0,

    transmission: 0.62,

    ior: 1.45,

    crystals: false,

    opal: true

  },


  moonstone: {

    name: 'MOONSTONE',

    color: 0x9cb8db,

    highlight: 0xe3efff,

    roughness: 0.07,

    metalness: 0,

    transmission: 0.5,

    ior: 1.52,

    crystals: false

  },


  ruby: {

    name: 'RUBY',

    color: 0xa50720,

    highlight: 0xff8a9b,

    roughness: 0.045,

    metalness: 0,

    transmission: 0.52,

    ior: 1.77,

    crystals: true

  },


  sapphire: {

    name: 'SAPPHIRE',

    color: 0x1049aa,

    highlight: 0x8ebcff,

    roughness: 0.04,

    metalness: 0,

    transmission: 0.5,

    ior: 1.77,

    crystals: true

  }

};



/* =========================================================
   工具
========================================================= */

function random(min, max) {

  return min +
    Math.random() *
    (max - min);

}


function choose(array) {

  return array[
    Math.floor(
      Math.random() *
      array.length
    )
  ];

}



/* =========================================================
   清除舊礦石
========================================================= */

function disposeObject(object) {

  object.traverse(
    child => {

      if (child.geometry) {

        child.geometry.dispose();

      }


      if (child.material) {

        if (
          Array.isArray(
            child.material
          )
        ) {

          child.material.forEach(
            material =>
              material.dispose()
          );

        } else {

          child.material.dispose();

        }

      }

    }
  );

}


function clearMineral() {

  /*
   * 前兩個是展示台。
   */

  while (
    mineral.children.length > 2
  ) {

    const object =
      mineral.children.pop();

    disposeObject(object);

  }

}



/* =========================================================
   PBR 礦石材質
========================================================= */

function createRockMaterial(
  config,
  rarity
) {

  const gloss =
    Number(
      glossSlider.value
    ) / 100;


  const transparency =
    Number(
      transparencySlider.value
    ) / 100;


  return new THREE.MeshPhysicalMaterial({

    color:
      config.color,


    roughness:
      Math.max(
        0.025,

        config.roughness +
        (1 - gloss) * 0.16
      ),


    metalness:
      config.metalness,


    clearcoat:
      0.65 +
      gloss * 0.35,


    clearcoatRoughness:
      0.025 +
      (1 - gloss) * 0.08,


    transmission:
      config.transmission *
      (
        0.45 +
        transparency * 0.55
      ),


    thickness:
      1.2 +
      rarity * 2.5,


    ior:
      config.ior,


    envMapIntensity:
      1.5 +
      gloss * 1.8,


    iridescence:
      config.opal
        ? 0.95
        : 0,


    iridescenceIOR:
      1.33,


    sheen:
      config.opal
        ? 0.9
        : 0.05

  });

}



/* =========================================================
   礦石母岩
========================================================= */

function createMatrix(
  config,
  rarity
) {

  /*
   * 使用 Dodecahedron，
   * 不再使用大量散亂三角形。
   */

  const geometry =
    new THREE.DodecahedronGeometry(
      1.55,
      3
    );


  const position =
    geometry.attributes.position;


  const vertex =
    new THREE.Vector3();


  const seed =
    Math.random() * 10000;


  for (
    let i = 0;
    i < position.count;
    i++
  ) {

    vertex.fromBufferAttribute(
      position,
      i
    );


    const noise =

      Math.sin(
        vertex.x * 3.7 +
        seed
      ) * 0.075 +

      Math.sin(
        vertex.y * 5.1 -
        seed
      ) * 0.055 +

      Math.sin(
        vertex.z * 4.2 +
        seed * 0.4
      ) * 0.065;


    vertex.multiplyScalar(

      1 +
      noise +
      random(
        -0.035,
        0.035
      )

    );


    vertex.y *= 0.78;


    position.setXYZ(
      i,
      vertex.x,
      vertex.y,
      vertex.z
    );

  }


  position.needsUpdate =
    true;


  geometry.computeVertexNormals();


  const rock =
    new THREE.Mesh(
      geometry,
      createRockMaterial(
        config,
        rarity
      )
    );


  rock.position.y =
    -0.48;


  mineral.add(rock);



  /*
   * 黑色母岩底座。
   */

  const host =
    new THREE.Mesh(

      new THREE.DodecahedronGeometry(
        1.55,
        2
      ),

      new THREE.MeshStandardMaterial({

        color: 0x18131c,

        roughness: 0.65,

        metalness: 0.12

      })

    );


  host.scale.set(
    1.12,
    0.48,
    0.92
  );


  host.position.set(
    0,
    -1.03,
    0
  );


  mineral.add(host);

}



/* =========================================================
   真正的六角晶體
========================================================= */

function createCrystalGeometry(
  radius,
  height,
  sides = 6
) {

  const bottomY = 0;

  const shoulderY =
    height * 0.72;

  const tipY =
    height;


  const vertices = [];

  const indices = [];


  /*
   * 底部六角環。
   */

  for (
    let i = 0;
    i < sides;
    i++
  ) {

    const angle =
      i / sides *
      Math.PI * 2 +
      Math.PI / 6;


    vertices.push(

      Math.cos(angle) *
        radius,

      bottomY,

      Math.sin(angle) *
        radius

    );

  }


  /*
   * 上方六角環。
   */

  for (
    let i = 0;
    i < sides;
    i++
  ) {

    const angle =
      i / sides *
      Math.PI * 2 +
      Math.PI / 6;


    vertices.push(

      Math.cos(angle) *
        radius,

      shoulderY,

      Math.sin(angle) *
        radius

    );

  }


  /*
   * 尖端。
   */

  const tipIndex =
    sides * 2;


  vertices.push(
    0,
    tipY,
    0
  );


  /*
   * 六角柱側面。
   */

  for (
    let i = 0;
    i < sides;
    i++
  ) {

    const next =
      (i + 1) % sides;


    indices.push(

      i,
      next,
      sides + next,

      i,
      sides + next,
      sides + i

    );

  }


  /*
   * 尖頂。
   */

  for (
    let i = 0;
    i < sides;
    i++
  ) {

    const next =
      (i + 1) % sides;


    indices.push(

      sides + i,
      sides + next,
      tipIndex

    );

  }


  /*
   * 底面。
   */

  for (
    let i = 1;
    i < sides - 1;
    i++
  ) {

    indices.push(
      0,
      i + 1,
      i
    );

  }


  const geometry =
    new THREE.BufferGeometry();


  geometry.setAttribute(

    'position',

    new THREE.Float32BufferAttribute(
      vertices,
      3
    )

  );


  geometry.setIndex(indices);


  geometry.computeVertexNormals();


  return geometry;

}



/* =========================================================
   生成晶體
========================================================= */

function createCrystal(
  config,
  index,
  total,
  rarity
) {

  /*
   * 前幾顆是主晶體，
   * 後面才是小晶體。
   */

  const isMain =
    index < Math.ceil(
      total * 0.28
    );


  const height =
    isMain

      ? random(
          1.7,
          2.5
        )

      : random(
          0.65,
          1.35
        );


  const radius =
    isMain

      ? random(
          0.34,
          0.52
        )

      : random(
          0.17,
          0.30
        );


  const sides =
    config.name === 'PYRITE'
      ? 4
      : 6;


  const geometry =
    createCrystalGeometry(
      radius,
      height,
      sides
    );


  const material =
    new THREE.MeshPhysicalMaterial({

      color:
        config.color,


      roughness:
        Math.max(
          0.025,
          config.roughness
        ),


      metalness:
        config.metalness,


      clearcoat:
        0.92,


      clearcoatRoughness:
        0.025,


      transmission:
        config.transmission *
        0.8,


      thickness:
        1.8,


      ior:
        config.ior,


      envMapIntensity:
        2.6,


      iridescence:
        config.opal
          ? 0.95
          : 0,


      iridescenceIOR:
        1.33

    });


  const crystal =
    new THREE.Mesh(
      geometry,
      material
    );


  /*
   * 主晶體在中央。
   */

  if (
    index === 0
  ) {

    crystal.position.set(
      0,
      -0.35,
      0
    );

    crystal.rotation.y =
      random(
        0,
        Math.PI * 2
      );

  }

  /*
   * 其他高晶體圍繞中央。
   */

  else if (
    isMain
  ) {

    const angle =
      (index - 1) /
      Math.max(
        1,
        Math.ceil(total * 0.28) - 1
      ) *
      Math.PI *
      2;


    const distance =
      random(
        0.38,
        0.72
      );


    crystal.position.set(

      Math.cos(angle) *
        distance,

      random(
        -0.28,
        0.02
      ),

      Math.sin(angle) *
        distance

    );


    crystal.rotation.y =
      angle +
      Math.PI / 2 +
      random(
        -0.12,
        0.12
      );

  }

  /*
   * 外圍小晶體。
   */

  else {

    const angle =
      index /
      total *
      Math.PI *
      2 +
      random(
        -0.22,
        0.22
      );


    const distance =
      random(
        0.48,
        1.18
      );


    crystal.position.set(

      Math.cos(angle) *
        distance,

      random(
        -0.55,
        0.03
      ),

      Math.sin(angle) *
        distance

    );


    crystal.rotation.y =
      angle +
      Math.PI / 2 +
      random(
        -0.25,
        0.25
      );

  }


  crystal.rotation.x =
    random(
      -0.12,
      0.12
    );


  crystal.rotation.z =
    isMain

      ? random(
          -0.06,
          0.06
        )

      : random(
          -0.2,
          0.2
        );


  mineral.add(crystal);


  /*
   * 小晶體與母岩接觸。
   */

  if (
    !isMain &&
    Math.random() < 0.7
  ) {

    const smallGeometry =
      createCrystalGeometry(
        radius * 0.65,
        height * 0.5,
        6
      );


    const smallCrystal =
      new THREE.Mesh(
        smallGeometry,
        material
      );


    smallCrystal.position.copy(
      crystal.position
    );


    smallCrystal.position.y -=
      0.32;


    smallCrystal.rotation.copy(
      crystal.rotation
    );


    mineral.add(
      smallCrystal
    );

  }

}



/* =========================================================
   礦石內部包裹體
========================================================= */

function createInclusions(
  config,
  rarity
) {

  const count =
    Math.floor(
      12 +
      rarity * 35
    );


  const material =
    new THREE.MeshBasicMaterial({

      color:
        config.highlight,

      transparent:
        true,

      opacity:
        0.12 +
        rarity * 0.18,

      blending:
        THREE.AdditiveBlending,

      depthWrite:
        false

    });


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const particle =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          random(
            0.012,
            0.035
          ),
          6,
          4
        ),

        material

      );


    particle.position.set(

      random(
        -1.05,
        1.05
      ),

      random(
        -0.85,
        1.35
      ),

      random(
        -0.8,
        0.8
      )

    );


    /*
     * 把太外面的粒子拉回礦石內。
     */

    if (
      particle.position.x *
        particle.position.x +

      particle.position.z *
        particle.position.z >
      1.1
    ) {

      particle.position.multiplyScalar(
        0.72
      );

    }


    mineral.add(
      particle
    );

  }

}



/* =========================================================
   蛋白石 / 黃鐵礦閃光
========================================================= */

function createSparkles(
  config,
  rarity
) {

  if (

    !config.opal &&

    config.name !== 'PYRITE' &&

    rarity < 0.7

  ) {

    return;

  }


  const positions = [];

  const count =
    70 +
    Math.floor(
      rarity * 100
    );


  for (
    let i = 0;
    i < count;
    i++
  ) {

    positions.push(

      random(
        -1.3,
        1.3
      ),

      random(
        -0.9,
        1.45
      ),

      random(
        -1,
        1
      )

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


  const points =
    new THREE.Points(

      geometry,

      new THREE.PointsMaterial({

        color:
          config.highlight,

        size:
          0.014 +
          rarity * 0.02,

        transparent:
          true,

        opacity:
          0.3 +
          rarity * 0.5,

        blending:
          THREE.AdditiveBlending,

        depthWrite:
          false

      })

    );


  mineral.add(
    points
  );

}



/* =========================================================
   光暈
========================================================= */

function createGlow(
  config,
  rarity
) {

  const glow =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        2.15,
        32,
        32
      ),

      new THREE.MeshBasicMaterial({

        color:
          config.highlight,

        transparent:
          true,

        opacity:
          0.012 +
          rarity * 0.028,

        side:
          THREE.BackSide,

        blending:
          THREE.AdditiveBlending,

        depthWrite:
          false

      })

    );


  glow.position.y =
    0.1;


  mineral.add(
    glow
  );

}



/* =========================================================
   生成礦石
========================================================= */

function generateMineral() {

  loading.classList.remove(
    'hidden'
  );


  requestAnimationFrame(
    () => {

      clearMineral();


      let type =
        typeSelect.value;


      if (
        type === 'random'
      ) {

        type =
          choose(
            Object.keys(
              MINERALS
            )
          );

      }


      const config =
        MINERALS[type];


      const rarity =
        Number(
          raritySlider.value
        ) / 100;


      const crystalCount =
        Number(
          crystalSlider.value
        );


      /*
       * 先建立完整母岩。
       */

      createMatrix(
        config,
        rarity
      );


      /*
       * 再把晶體長在母岩上。
       */

      if (
        config.crystals
      ) {

        for (
          let i = 0;
          i < crystalCount;
          i++
        ) {

          createCrystal(

            config,

            i,

            crystalCount,

            rarity

          );

        }

      }


      createInclusions(
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


      mineral.rotation.set(
        0,
        0,
        0
      );


      mineral.position.y =
        0;


      setTimeout(
        () => {

          loading.classList.add(
            'hidden'
          );

        },
        100
      );

    }
  );

}



/* =========================================================
   UI 數值
========================================================= */

function updateValues() {

  const crystalValue =
    document.querySelector(
      '#crystalValue'
    );

  const glossValue =
    document.querySelector(
      '#glossValue'
    );

  const transValue =
    document.querySelector(
      '#transValue'
    );

  const rarityValue =
    document.querySelector(
      '#rarityValue'
    );


  if (
    crystalValue
  ) {

    crystalValue.textContent =
      crystalSlider.value;

  }


  if (
    glossValue
  ) {

    glossValue.textContent =
      (
        Number(
          glossSlider.value
        ) / 100
      ).toFixed(2);

  }


  if (
    transValue
  ) {

    transValue.textContent =
      (
        Number(
          transparencySlider.value
        ) / 100
      ).toFixed(2);

  }


  if (
    rarityValue
  ) {

    rarityValue.textContent =
      (
        Number(
          raritySlider.value
        ) / 100
      ).toFixed(2);

  }

}


[
  crystalSlider,
  glossSlider,
  transparencySlider,
  raritySlider
].forEach(
  slider => {

    slider.addEventListener(
      'input',
      updateValues
    );

  }
);


updateValues();



/* =========================================================
   生成按鈕
========================================================= */

document
  .querySelector('#generate')
  .addEventListener(
    'click',
    generateMineral
  );



/* =========================================================
   隨機生成
========================================================= */

function randomGenerate() {

  typeSelect.value =
    'random';


  crystalSlider.value =
    Math.floor(
      random(
        5,
        11
      )
    );


  glossSlider.value =
    Math.floor(
      random(
        70,
        98
      )
    );


  transparencySlider.value =
    Math.floor(
      random(
        30,
        80
      )
    );


  raritySlider.value =
    Math.floor(
      random(
        55,
        100
      )
    );


  updateValues();


  generateMineral();

}


document
  .querySelector('#randomTop')
  .addEventListener(
    'click',
    randomGenerate
  );



/* =========================================================
   PNG
========================================================= */

function savePNG() {

  renderer.render(
    scene,
    camera
  );


  const link =
    document.createElement(
      'a'
    );


  link.download =
    'my-mineral.png';


  link.href =
    renderer.domElement
      .toDataURL(
        'image/png'
      );


  link.click();

}


document
  .querySelector('#download')
  .addEventListener(
    'click',
    savePNG
  );



/* =========================================================
   視窗大小
========================================================= */

window.addEventListener(
  'resize',
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    renderer.setPixelRatio(

      Math.min(
        window.devicePixelRatio,
        1.7
      )

    );

  }
);



/* =========================================================
   動畫
========================================================= */

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );


  const time =
    clock.getElapsedTime();


  /*
   * 礦石非常慢地旋轉。
   */

  mineral.rotation.y +=
    0.0012;


  /*
   * 輕微漂浮。
   */

  mineral.position.y =
    Math.sin(
      time * 0.7
    ) * 0.018;


  /*
   * 光源慢慢移動，
   * 讓高光在晶體表面流動。
   */

  keyLight.position.x =
    Math.sin(
      time * 0.38
    ) * 4.2;


  keyLight.position.z =
    Math.cos(
      time * 0.38
    ) * 4.2;


  purpleLight.position.x =
    Math.sin(
      time * 0.28
    ) * 4.5;


  pinkLight.position.z =
    Math.cos(
      time * 0.45
    ) * 4.5;


  controls.update();


  renderer.render(
    scene,
    camera
  );

}



/* =========================================================
   啟動
========================================================= */

generateMineral();

animate();
