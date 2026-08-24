import * as THREE from 'three';

import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import {
  RoomEnvironment
} from 'three/addons/environments/RoomEnvironment.js';



/* =========================================================
   DOM
========================================================= */

const canvas =
  document.querySelector('#scene');

const typeSelect =
  document.querySelector('#type');

const crystalSlider =
  document.querySelector('#crystals');

const glossSlider =
  document.querySelector('#gloss');

const transparencySlider =
  document.querySelector('#transparency');

const raritySlider =
  document.querySelector('#rarity');

const generateBtn =
  document.querySelector('#generateBtn');

const randomBtn =
  document.querySelector('#randomBtn');

const downloadBtn =
  document.querySelector('#downloadBtn');

const screenshotBtn =
  document.querySelector('#screenshotBtn');

const lightBtn =
  document.querySelector('#lightBtn');

const loading =
  document.querySelector('#loading');

const mineralName =
  document.querySelector('#mineralName');

const mineralIcon =
  document.querySelector('#mineralIcon');



/* =========================================================
   Three.js
========================================================= */

const scene =
  new THREE.Scene();


scene.background =
  new THREE.Color(
    0x030407
  );


const camera =
  new THREE.PerspectiveCamera(

    35,

    window.innerWidth /
      window.innerHeight,

    0.1,

    100

  );


camera.position.set(
  0,
  1.1,
  7.2
);


const renderer =
  new THREE.WebGLRenderer({

    canvas,

    antialias: true,

    alpha: false,

    preserveDrawingBuffer: true,

    powerPreference:
      'high-performance'

  });


renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


renderer.setPixelRatio(

  Math.min(
    window.devicePixelRatio,
    1.6
  )

);


renderer.outputColorSpace =
  THREE.SRGBColorSpace;


renderer.toneMapping =
  THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
  1.15;


/*
 * 軟陰影
 */

renderer.shadowMap.enabled =
  true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;



/* =========================================================
   Environment
========================================================= */

const pmrem =
  new THREE.PMREMGenerator(
    renderer
  );


scene.environment =
  pmrem.fromScene(

    new RoomEnvironment(
      renderer
    ),

    0.04

  ).texture;



/* =========================================================
   相機控制
========================================================= */

const controls =
  new OrbitControls(
    camera,
    canvas
  );


controls.enableDamping =
  true;


controls.dampingFactor =
  0.055;


controls.minDistance =
  3.4;


controls.maxDistance =
  10;


controls.enablePan =
  false;


controls.target.set(
  0,
  0.2,
  0
);



/* =========================================================
   根節點
========================================================= */

const mineralRoot =
  new THREE.Group();


scene.add(
  mineralRoot
);



/* =========================================================
   光源
========================================================= */

const keyLight =
  new THREE.DirectionalLight(
    0xffffff,
    5.5
  );


keyLight.position.set(
  4,
  7,
  5
);


keyLight.castShadow =
  true;


keyLight.shadow.mapSize.width =
  1024;


keyLight.shadow.mapSize.height =
  1024;


scene.add(
  keyLight
);



const fillLight =
  new THREE.DirectionalLight(
    0x9d7aff,
    2.7
  );


fillLight.position.set(
  -5,
  3,
  2
);


scene.add(
  fillLight
);



const rimLight =
  new THREE.PointLight(
    0xd26cff,
    35,
    12
  );


rimLight.position.set(
  3,
  2,
  -4
);


scene.add(
  rimLight
);



const frontLight =
  new THREE.PointLight(
    0xffffff,
    16,
    10
  );


frontLight.position.set(
  -1,
  3,
  5
);


scene.add(
  frontLight
);



/* =========================================================
   展示台
========================================================= */

const pedestal =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      2.85,
      3.05,
      0.32,
      96
    ),

    new THREE.MeshStandardMaterial({

      color:
        0x101117,

      roughness:
        0.23,

      metalness:
        0.55

    })

  );


pedestal.position.y =
  -1.75;


pedestal.receiveShadow =
  true;


scene.add(
  pedestal
);



const pedestalTop =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      2.72,
      2.72,
      0.055,
      96
    ),

    new THREE.MeshStandardMaterial({

      color:
        0x26202e,

      roughness:
        0.2,

      metalness:
        0.42

    })

  );


pedestalTop.position.y =
  -1.57;


pedestalTop.receiveShadow =
  true;


scene.add(
  pedestalTop
);



/* =========================================================
   礦石資料
========================================================= */

const MINERALS = {

  amethyst: {

    name:
      '紫水晶 AMETHYST',

    icon:
      '💜',

    color:
      0x6734a4,

    light:
      0xd8a8ff,

    dark:
      0x24103e,

    roughness:
      0.055,

    transmission:
      0.68,

    ior:
      1.54,

    metalness:
      0,

    crystal:
      true

  },


  quartz: {

    name:
      '白水晶 QUARTZ',

    icon:
      '◇',

    color:
      0xccecff,

    light:
      0xffffff,

    dark:
      0x657b91,

    roughness:
      0.035,

    transmission:
      0.82,

    ior:
      1.46,

    metalness:
      0,

    crystal:
      true

  },


  pyrite: {

    name:
      '黃鐵礦 PYRITE',

    icon:
      '🟡',

    color:
      0xb17c18,

    light:
      0xffe49a,

    dark:
      0x49310a,

    roughness:
      0.11,

    transmission:
      0,

    ior:
      1.55,

    metalness:
      0.82,

    crystal:
      true

  },


  obsidian: {

    name:
      '黑曜石 OBSIDIAN',

    icon:
      '◆',

    color:
      0x090d16,

    light:
      0x5f79b7,

    dark:
      0x010205,

    roughness:
      0.025,

    transmission:
      0.16,

    ior:
      1.48,

    metalness:
      0.15,

    crystal:
      false

  },


  malachite: {

    name:
      '孔雀石 MALACHITE',

    icon:
      '🟢',

    color:
      0x087052,

    light:
      0x6de4a9,

    dark:
      0x063b2c,

    roughness:
      0.18,

    transmission:
      0.08,

    ior:
      1.65,

    metalness:
      0,

    crystal:
      false

  },


  turquoise: {

    name:
      '綠松石 TURQUOISE',

    icon:
      '🔵',

    color:
      0x16a8a4,

    light:
      0x9efff3,

    dark:
      0x075c5d,

    roughness:
      0.19,

    transmission:
      0.05,

    ior:
      1.61,

    metalness:
      0,

    crystal:
      false

  },


  opal: {

    name:
      '蛋白石 OPAL',

    icon:
      '🌈',

    color:
      0xb8d7d9,

    light:
      0xffffff,

    dark:
      0x61748b,

    roughness:
      0.045,

    transmission:
      0.74,

    ior:
      1.45,

    metalness:
      0,

    crystal:
      false,

    opal:
      true

  },


  moonstone: {

    name:
      '月光石 MOONSTONE',

    icon:
      '◇',

    color:
      0x9ab9dd,

    light:
      0xe9f5ff,

    dark:
      0x384c6d,

    roughness:
      0.06,

    transmission:
      0.58,

    ior:
      1.52,

    metalness:
      0,

    crystal:
      false

  },


  ruby: {

    name:
      '紅寶石 RUBY',

    icon:
      '🔴',

    color:
      0x9d071f,

    light:
      0xff8ca0,

    dark:
      0x35030d,

    roughness:
      0.035,

    transmission:
      0.68,

    ior:
      1.77,

    metalness:
      0,

    crystal:
      true

  },


  sapphire: {

    name:
      '藍寶石 SAPPHIRE',

    icon:
      '🔷',

    color:
      0x1247a8,

    light:
      0x8dbfff,

    dark:
      0x061838,

    roughness:
      0.035,

    transmission:
      0.65,

    ior:
      1.77,

    metalness:
      0,

    crystal:
      true

  }

};



/* =========================================================
   工具
========================================================= */

function rand(
  min,
  max
) {

  return (
    min +
    Math.random() *
    (max - min)
  );

}


function pick(
  arr
) {

  return arr[
    Math.floor(
      Math.random() *
      arr.length
    )
  ];

}



/* =========================================================
   清除舊礦石
========================================================= */

function disposeMaterial(
  material
) {

  if (
    !material
  ) return;


  if (
    Array.isArray(material)
  ) {

    material.forEach(
      m => m.dispose()
    );

  } else {

    material.dispose();

  }

}


function disposeTree(
  object
) {

  object.traverse(
    child => {

      if (
        child.geometry
      ) {

        child.geometry.dispose();

      }


      if (
        child.material
      ) {

        disposeMaterial(
          child.material
        );

      }

    }
  );

}


function clearMineral() {

  while (
    mineralRoot.children.length
  ) {

    const child =
      mineralRoot.children.pop();

    disposeTree(
      child
    );

  }

}



/* =========================================================
   材質
========================================================= */

function makeCrystalMaterial(
  config
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
        0.018,
        config.roughness +
          (1 - gloss) * 0.08
      ),

    metalness:
      config.metalness,

    transmission:
      config.transmission *
      transparency,

    thickness:
      1.8,

    ior:
      config.ior,

    clearcoat:
      0.8 +
      gloss * 0.2,

    clearcoatRoughness:
      0.025,

    envMapIntensity:
      2.0 +
      gloss * 2.0,

    iridescence:
      config.opal
        ? 1
        : 0,

    iridescenceIOR:
      1.33,

    sheen:
      config.opal
        ? 0.8
        : 0

  });

}


function makeMatrixMaterial(
  config
) {

  return new THREE.MeshStandardMaterial({

    color:
      config.dark,

    roughness:
      0.65,

    metalness:
      config.metalness *
      0.45

  });

}



/* =========================================================
   真正的母岩
========================================================= */

function createMatrix(
  config,
  rarity
) {

  /*
   * 不是碎片。
   *
   * 使用一個完整的、
   * 有輕微自然變形的球狀母岩。
   */

  const geometry =
    new THREE.IcosahedronGeometry(
      1.45,
      4
    );


  const position =
    geometry.attributes.position;


  const v =
    new THREE.Vector3();


  const seed =
    Math.random() * 100;


  for (
    let i = 0;
    i < position.count;
    i++
  ) {

    v.fromBufferAttribute(
      position,
      i
    );


    /*
     * 柔和的自然不規則。
     *
     * 故意限制變形，
     * 避免再次變成尖角碎片。
     */

    const n =

      Math.sin(
        v.x * 3.1 +
        seed
      ) * 0.045 +

      Math.sin(
        v.y * 4.7 +
        seed * 0.3
      ) * 0.035 +

      Math.sin(
        v.z * 3.8 -
        seed
      ) * 0.04;


    v.multiplyScalar(
      1 + n
    );


    /*
     * 礦石底部扁一點。
     */

    v.y *=
      0.78;


    position.setXYZ(
      i,
      v.x,
      v.y,
      v.z
    );

  }


  position.needsUpdate =
    true;


  geometry.computeVertexNormals();


  const matrix =
    new THREE.Mesh(

      geometry,

      makeMatrixMaterial(
        config
      )

    );


  matrix.scale.set(
    1.08,
    0.98,
    0.88
  );


  matrix.position.y =
    -0.55;


  matrix.castShadow =
    true;


  matrix.receiveShadow =
    true;


  mineralRoot.add(
    matrix
  );



  /*
   * 上面覆蓋一層較細的母岩。
   * 讓晶體看起來像真正生長在岩石裡。
   */

  const upperGeometry =
    new THREE.IcosahedronGeometry(
      1.25,
      3
    );


  const upper =
    new THREE.Mesh(

      upperGeometry,

      new THREE.MeshStandardMaterial({

        color:
          config.dark,

        roughness:
          0.82,

        metalness:
          config.metalness *
          0.25

      })

    );


  upper.scale.set(
    1.02,
    0.55,
    0.84
  );


  upper.position.y =
    -0.18;


  upper.castShadow =
    true;


  mineralRoot.add(
    upper
  );

}



/* =========================================================
   六角晶體幾何
========================================================= */

function createCrystalGeometry(
  radius,
  height,
  sides = 6
) {

  /*
   * 結構：
   *
   *       /\       ← 尖端
   *      /  \
   *     /    \
   *    |      |
   *    |      |     ← 晶體柱
   *    |      |
   *    |______|
   *
   * 沒有隨機三角碎片。
   */

  const vertices = [];

  const indices = [];


  const shoulder =
    height * 0.72;


  const bottom =
    0;


  /*
   * 底部。
   */

  for (
    let i = 0;
    i < sides;
    i++
  ) {

    const a =
      i /
      sides *
      Math.PI * 2 +
      Math.PI / 6;


    vertices.push(

      Math.cos(a) *
        radius,

      bottom,

      Math.sin(a) *
        radius

    );

  }


  /*
   * 肩部。
   */

  for (
    let i = 0;
    i < sides;
    i++
  ) {

    const a =
      i /
      sides *
      Math.PI * 2 +
      Math.PI / 6;


    vertices.push(

      Math.cos(a) *
        radius,

      shoulder,

      Math.sin(a) *
        radius

    );

  }


  /*
   * 尖端。
   */

  const tip =
    sides * 2;


  vertices.push(
    0,
    height,
    0
  );


  /*
   * 六角柱。
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
      tip

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
      i,
      i + 1
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


  geometry.setIndex(
    indices
  );


  geometry.computeVertexNormals();


  return geometry;

}



/* =========================================================
   建立單顆晶體
========================================================= */

function createCrystal(
  config,
  data
) {

  const geometry =
    createCrystalGeometry(

      data.radius,

      data.height,

      data.sides

    );


  const material =
    makeCrystalMaterial(
      config
    );


  const crystal =
    new THREE.Mesh(
      geometry,
      material
    );


  crystal.position.copy(
    data.position
  );


  crystal.rotation.set(

    data.rotation.x,

    data.rotation.y,

    data.rotation.z

  );


  crystal.scale.set(

    data.scale.x,

    data.scale.y,

    data.scale.z

  );


  crystal.castShadow =
    true;


  crystal.receiveShadow =
    true;


  mineralRoot.add(
    crystal
  );


  return crystal;

}



/* =========================================================
   主晶體分布
========================================================= */

function createMainCrystals(
  config,
  count,
  shape
) {

  /*
   * 單晶模式
   */

  if (
    shape === 'single'
  ) {

    const height =
      2.85;


    createCrystal(

      config,

      {

        radius:
          0.58,

        height,

        sides:
          config.name.includes(
            '黃鐵'
          )
            ? 4
            : 6,

        position:
          new THREE.Vector3(
            0,
            -0.78,
            0
          ),

        rotation:
          new THREE.Euler(
            0,
            rand(
              0,
              Math.PI * 2
            ),
            0
          ),

        scale:
          new THREE.Vector3(
            1,
            1,
            1
          )

      }

    );


    return;

  }



  /*
   * 塊狀模式：
   * 不長尖晶體。
   */

  if (
    shape === 'mass'
  ) {

    return;

  }



  /*
   * 第一顆永遠是主晶體。
   */

  createCrystal(

    config,

    {

      radius:
        rand(
          0.46,
          0.60
        ),

      height:
        rand(
          2.35,
          2.85
        ),

      sides:
        config.name.includes(
          '黃鐵'
        )
          ? 4
          : 6,

      position:
        new THREE.Vector3(
          rand(
            -0.08,
            0.08
          ),
          -0.83,
          rand(
            -0.08,
            0.08
          )
        ),

      rotation:
        new THREE.Euler(
          rand(
            -0.025,
            0.025
          ),
          rand(
            0,
            Math.PI * 2
          ),
          rand(
            -0.025,
            0.025
          )
        ),

      scale:
        new THREE.Vector3(
          1,
          1,
          1
        )

    }

  );



  /*
   * 周圍第二層。
   *
   * 高度逐漸下降。
   */

  const ringCount =
    Math.max(
      2,
      count - 1
    );


  for (
    let i = 0;
    i < ringCount;
    i++
  ) {

    const angle =
      i /
      ringCount *
      Math.PI * 2 +
      rand(
        -0.12,
        0.12
      );


    const distance =
      rand(
        0.48,
        0.92
      );


    const height =
      rand(
        1.25,
        2.05
      );


    const radius =
      rand(
        0.27,
        0.43
      );


    const x =
      Math.cos(angle) *
      distance;


    const z =
      Math.sin(angle) *
      distance;


    /*
     * 向中央傾斜。
     *
     * 這非常重要。
     *
     * 晶體不是垂直插在空中，
     * 而是從母岩向外生長。
     */

    const tilt =
      rand(
        -0.18,
        0.18
      );


    createCrystal(

      config,

      {

        radius,

        height,

        sides:
          config.name.includes(
            '黃鐵'
          )
            ? 4
            : 6,

        position:
          new THREE.Vector3(
            x,
            -1.0,
            z
          ),

        rotation:
          new THREE.Euler(
            tilt *
              Math.sin(angle),

            angle +
              Math.PI / 2,

            tilt *
              Math.cos(angle)
          ),

        scale:
          new THREE.Vector3(
            1,
            rand(
              0.92,
              1.08
            ),
            1
          )

      }

    );

  }

}



/* =========================================================
   表面小晶簇
========================================================= */

function createDruzy(
  config,
  rarity
) {

  /*
   * 這裡不是「碎片」。
   *
   * 每個都是完整的小六角晶體，
   * 而且只長在母岩表面。
   */

  const count =
    Math.floor(
      8 +
      rarity * 15
    );


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const angle =
      Math.random() *
      Math.PI *
      2;


    const radius =
      rand(
        0.65,
        1.30
      );


    const x =
      Math.cos(angle) *
      radius;


    const z =
      Math.sin(angle) *
      radius;


    const y =
      -0.55 +
      rand(
        -0.12,
        0.28
      );


    const height =
      rand(
        0.12,
        0.38
      );


    const crystal =
      createCrystal(

        config,

        {

          radius:
            rand(
              0.055,
              0.11
            ),

          height,

          sides:
            6,

          position:
            new THREE.Vector3(
              x,
              y,
              z
            ),

          rotation:
            new THREE.Euler(

              rand(
                -0.7,
                0.7
              ),

              angle,

              rand(
                -0.7,
                0.7
              )

            ),

          scale:
            new THREE.Vector3(
              1,
              1,
              1
            )

        }

      );


    /*
     * 小晶體略微嵌入母岩。
     */

    crystal.position.y -=
      0.08;

  }

}



/* =========================================================
   礦石包裹體
========================================================= */

function createInclusions(
  config,
  rarity
) {

  /*
   * 包裹體數量有限。
   *
   * 不使用大量粒子。
   */

  const count =
    Math.floor(
      10 +
      rarity * 18
    );


  const material =
    new THREE.MeshPhysicalMaterial({

      color:
        config.light,

      emissive:
        config.light,

      emissiveIntensity:
        0.16,

      transparent:
        true,

      opacity:
        0.26,

      roughness:
        0.12,

      transmission:
        0.25

    });


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const inclusion =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          rand(
            0.012,
            0.032
          ),
          8,
          6
        ),

        material

      );


    inclusion.position.set(

      rand(
        -0.85,
        0.85
      ),

      rand(
        -0.65,
        1.15
      ),

      rand(
        -0.65,
        0.65
      )

    );


    /*
     * 包裹體不能飄到礦石外。
     */

    const distance =
      Math.sqrt(

        inclusion.position.x *
          inclusion.position.x +

        inclusion.position.z *
          inclusion.position.z

      );


    if (
      distance > 0.9
    ) {

      inclusion.position.x *=
        0.55;

      inclusion.position.z *=
        0.55;

    }


    mineralRoot.add(
      inclusion
    );

  }

}



/* =========================================================
   生成礦石
========================================================= */

let currentShape =
  'cluster';


function generate() {

  loading.classList.remove(
    'hidden'
  );


  requestAnimationFrame(
    () => {

      clearMineral();


      const type =
        typeSelect.value;


      const config =
        MINERALS[type];


      const count =
        Number(
          crystalSlider.value
        );


      const rarity =
        Number(
          raritySlider.value
        ) / 100;


      /*
       * 1.
       * 完整母岩
       */

      createMatrix(
        config,
        rarity
      );


      /*
       * 2.
       * 主晶體
       */

      if (
        config.crystal
      ) {

        createMainCrystals(

          config,

          count,

          currentShape

        );

      }


      /*
       * 3.
       * 母岩表面細小晶簇
       */

      if (
        currentShape ===
        'cluster'
      ) {

        createDruzy(
          config,
          rarity
        );

      }


      /*
       * 4.
       * 內部包裹體
       */

      if (
        config.transmission > 0.2
      ) {

        createInclusions(
          config,
          rarity
        );

      }


      mineralName.textContent =
        config.name;


      mineralIcon.textContent =
        config.icon;


      mineralRoot.rotation.set(
        0,
        0,
        0
      );


      loading.classList.add(
        'hidden'
      );

    }
  );

}



/* =========================================================
   UI
========================================================= */

function updateSliderText() {

  document.querySelector(
    '#crystalValue'
  ).textContent =
    crystalSlider.value;


  document.querySelector(
    '#glossValue'
  ).textContent =

    (
      Number(
        glossSlider.value
      ) / 100

    ).toFixed(2);


  document.querySelector(
    '#transValue'
  ).textContent =

    (
      Number(
        transparencySlider.value
      ) / 100

    ).toFixed(2);


  document.querySelector(
    '#rarityValue'
  ).textContent =

    (
      Number(
        raritySlider.value
      ) / 100

    ).toFixed(2);

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
      updateSliderText
    );

  }
);


updateSliderText();



/* =========================================================
   生成
========================================================= */

generateBtn.addEventListener(
  'click',
  generate
);



/* =========================================================
   礦石種類變化
========================================================= */

typeSelect.addEventListener(
  'change',
  generate
);



/* =========================================================
   晶體形態
========================================================= */

document
  .querySelectorAll(
    '.shape'
  )
  .forEach(
    button => {

      button.addEventListener(
        'click',
        () => {

          document
            .querySelectorAll(
              '.shape'
            )
            .forEach(
              b =>
                b.classList.remove(
                  'active'
                )
            );


          button.classList.add(
            'active'
          );


          currentShape =
            button.dataset.shape;


          generate();

        }
      );

    }
  );



/* =========================================================
   背景
========================================================= */

const backgrounds = {

  black:
    0x030407,

  purple:
    0x10091b,

  blue:
    0x070d1d,

  white:
    0xd9d9dc

};


document
  .querySelectorAll(
    '.bg'
  )
  .forEach(
    button => {

      button.addEventListener(
        'click',
        () => {

          document
            .querySelectorAll(
              '.bg'
            )
            .forEach(
              b =>
                b.classList.remove(
                  'active'
                )
            );


          button.classList.add(
            'active'
          );


          scene.background =
            new THREE.Color(

              backgrounds[
                button.dataset.bg
              ]

            );

        }
      );

    }
  );



/* =========================================================
   隨機
========================================================= */

randomBtn.addEventListener(
  'click',
  () => {

    const types =
      Object.keys(
        MINERALS
      );


    typeSelect.value =
      pick(types);


    crystalSlider.value =
      Math.floor(
        rand(
          5,
          11
        )
      );


    glossSlider.value =
      Math.floor(
        rand(
          72,
          98
        )
      );


    transparencySlider.value =
      Math.floor(
        rand(
          40,
          82
        )
      );


    raritySlider.value =
      Math.floor(
        rand(
          55,
          100
        )
      );


    updateSliderText();

    generate();

  }
);



/* =========================================================
   光源
========================================================= */

let lightMode =
  0;


lightBtn.addEventListener(
  'click',
  () => {

    lightMode =
      (lightMode + 1) % 3;


    if (
      lightMode === 0
    ) {

      keyLight.intensity =
        5.5;

      fillLight.intensity =
        2.7;

      rimLight.intensity =
        35;

    }


    if (
      lightMode === 1
    ) {

      keyLight.intensity =
        8;

      fillLight.intensity =
        1.2;

      rimLight.intensity =
        50;

    }


    if (
      lightMode === 2
    ) {

      keyLight.intensity =
        2.8;

      fillLight.intensity =
        4.8;

      rimLight.intensity =
        22;

    }

  }
);



/* =========================================================
   PNG
========================================================= */

function downloadPNG() {

  renderer.render(
    scene,
    camera
  );


  const link =
    document.createElement(
      'a'
    );


  link.download =
    `mineral-${Date.now()}.png`;


  link.href =
    renderer.domElement.toDataURL(
      'image/png'
    );


  link.click();

}


downloadBtn.addEventListener(
  'click',
  downloadPNG
);


screenshotBtn.addEventListener(
  'click',
  downloadPNG
);



/* =========================================================
   Resize
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
        1.6
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
   * 礦石緩慢自轉。
   */

  mineralRoot.rotation.y +=
    0.0015;


  /*
   * 非常輕微的漂浮。
   */

  mineralRoot.position.y =
    Math.sin(
      time * 0.65
    ) * 0.012;


  /*
   * 光源慢慢移動，
   * 讓晶體高光自然變化。
   */

  keyLight.position.x =
    Math.sin(
      time * 0.25
    ) * 4.5;


  keyLight.position.z =
    Math.cos(
      time * 0.25
    ) * 4.5;


  rimLight.position.x =
    Math.cos(
      time * 0.34
    ) * 4;


  rimLight.position.z =
    Math.sin(
      time * 0.34
    ) * 4;


  controls.update();


  renderer.render(
    scene,
    camera

  );

}



/* =========================================================
   啟動
========================================================= */

generate();

animate();
