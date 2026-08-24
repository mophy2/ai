import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.querySelector('#scene');
const loading = document.querySelector('#loading');
const badge = document.querySelector('#badge');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05060a);

const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.05, 100);
camera.position.set(0, 1.1, 6.6);

const renderer = new THREE.WebGLRenderer({canvas, antialias:true, preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.minDistance = 3;
controls.maxDistance = 11;
controls.target.set(0, 0.1, 0);

const group = new THREE.Group();
scene.add(group);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(7, 96),
  new THREE.MeshStandardMaterial({color:0x080a0f, roughness:.72, metalness:.1})
);
floor.rotation.x = -Math.PI/2;
floor.position.y = -1.9;
scene.add(floor);

const key = new THREE.DirectionalLight(0xffffff, 5.5);
key.position.set(3.5,5.5,4);
scene.add(key);
const fill = new THREE.PointLight(0x8ca8ff, 22, 12);
fill.position.set(-4,2,2);
scene.add(fill);
const rim = new THREE.PointLight(0xff76db, 18, 10);
rim.position.set(3,-.5,-4);
scene.add(rim);

const TYPES = {
  amethyst:{name:'AMETHYST', base:0x6e2fa5, hi:0xd6a6ff, metal:0.0, rough:.18, clear:.9, transmission:.2, crystals:true},
  quartz:{name:'QUARTZ', base:0xbdd9e9, hi:0xffffff, metal:0, rough:.08, clear:1, transmission:.72, crystals:true},
  pyrite:{name:'PYRITE', base:0xa87c16, hi:0xffe29a, metal:.88, rough:.2, clear:.05, transmission:0, crystals:true},
  obsidian:{name:'OBSIDIAN', base:0x11141c, hi:0x6d86b4, metal:.12, rough:.06, clear:1, transmission:.18, crystals:false},
  malachite:{name:'MALACHITE', base:0x14734f, hi:0x7be5ad, metal:.08, rough:.28, clear:.45, transmission:.03, crystals:false},
  turquoise:{name:'TURQUOISE', base:0x18a9a2, hi:0xa7fff0, metal:0, rough:.2, clear:.65, transmission:.08, crystals:false},
  opal:{name:'OPAL', base:0xdde8ed, hi:0xffffff, metal:0, rough:.08, clear:1, transmission:.55, crystals:false},
  moonstone:{name:'MOONSTONE', base:0x9eb7d7, hi:0xdce8ff, metal:0, rough:.12, clear:1, transmission:.42, crystals:false},
  ruby:{name:'RUBY', base:0x9e0718, hi:0xff8492, metal:0, rough:.1, clear:1, transmission:.38, crystals:true},
  sapphire:{name:'SAPPHIRE', base:0x0d3f9d, hi:0x8ab9ff, metal:0, rough:.09, clear:1, transmission:.38, crystals:true}
};

function rand(a,b){return a+Math.random()*(b-a)}
function choose(obj){return obj[Math.floor(Math.random()*obj.length)]}

function randomType(){
  const keys = Object.keys(TYPES);
  return choose(keys);
}

function createRockMaterial(cfg, rarity){
  const m = new THREE.MeshPhysicalMaterial({
    color:cfg.base,
    roughness:Math.max(.035, cfg.rough + (100-document.querySelector('#gloss').value)/100*.35),
    metalness:cfg.metal,
    clearcoat:cfg.clear * (.55 + rarity*.45),
    clearcoatRoughness:.06,
    transmission:cfg.transmission * (.45 + rarity*.55),
    thickness:.8 + rarity*2.4,
    ior:1.45,
    iridescence:cfg.name==='OPAL' ? .95*rarity : 0,
    iridescenceIOR:1.33,
    sheen:cfg.name==='OPAL' ? .8 : .08,
    envMapIntensity:1.7
  });
  return m;
}

function makeRock(cfg, rarity){
  const geo = new THREE.IcosahedronGeometry(1.72, 4);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  const seed = Math.random()*1000;
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    const n = Math.sin(v.x*4.7+seed)*.10 + Math.sin(v.y*6.1-seed)*.08 + Math.sin(v.z*5.4+seed*.7)*.07;
    const scale = 1 + n + rand(-.055,.055);
    v.multiplyScalar(scale);
    v.y *= rand(.86,1.12);
    pos.setXYZ(i,v.x,v.y,v.z);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();

  const mesh = new THREE.Mesh(geo, createRockMaterial(cfg, rarity));
  mesh.rotation.set(rand(-.3,.3),rand(0,Math.PI*2),rand(-.25,.25));
  group.add(mesh);

  // A darker inner body makes transparent stones read as deep and substantial.
  if(cfg.transmission > .25){
    const innerGeo = new THREE.IcosahedronGeometry(1.5,3);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color:cfg.base, roughness:.28, transmission:.06, transparent:true, opacity:.48,
      depthWrite:false, envMapIntensity:1.1
    });
    const inner = new THREE.Mesh(innerGeo,innerMat);
    group.add(inner);
  }

  return mesh;
}

function makeCrystal(cfg, i, rarity){
  const h = rand(.65,1.55) * (.8 + rarity*.65);
  const r = rand(.16,.34);
  const sides = cfg.name==='PYRITE' ? 4 : choose([5,6,6,8]);
  const geo = new THREE.CylinderGeometry(r,r*.92,h,sides,1,false);
  const mat = new THREE.MeshPhysicalMaterial({
    color:cfg.hi,
    roughness:cfg.name==='PYRITE' ? .16 : .08,
    metalness:cfg.name==='PYRITE' ? .9 : .02,
    clearcoat:.85,
    transmission:cfg.transmission*.7,
    thickness:1.5,
    ior:1.5,
    envMapIntensity:2.3
  });
  const m = new THREE.Mesh(geo,mat);
  const a = (i/Math.max(1,Number(document.querySelector('#crystals').value)))*Math.PI*2 + rand(-.4,.4);
  const radius = rand(.25,1.15);
  m.position.set(Math.cos(a)*radius, rand(-.35,.55), Math.sin(a)*radius);
  m.rotation.set(rand(-.2,.2),a+rand(-.3,.3),rand(-.2,.2));
  group.add(m);

  // Small cap to suggest a terminated crystal.
  const capGeo = new THREE.ConeGeometry(r*1.01,r*.55,sides);
  const cap = new THREE.Mesh(capGeo,mat);
  cap.position.copy(m.position);
  cap.position.y += h/2 + r*.23;
  cap.rotation.copy(m.rotation);
  group.add(cap);
}

function addInclusions(cfg, rarity){
  const count = Math.floor(3 + rarity*9);
  const mat = new THREE.MeshBasicMaterial({
    color: cfg.hi,
    transparent:true,
    opacity:.18 + rarity*.16,
    blending:THREE.AdditiveBlending
  });
  for(let i=0;i<count;i++){
    const g = new THREE.SphereGeometry(rand(.015,.045),6,4);
    const p = new THREE.Mesh(g,mat);
    p.position.set(rand(-1.2,1.2),rand(-1.2,1.2),rand(-1.2,1.2));
    if(p.position.length()>1.45) p.position.setLength(rand(.5,1.35));
    group.add(p);
  }
}

function addSparkles(cfg, rarity){
  if(cfg.name!=='OPAL' && cfg.name!=='PYRITE' && rarity<.55) return;
  const points=[];
  for(let i=0;i<80;i++) points.push(rand(-1.5,1.5),rand(-1.4,1.4),rand(-1.5,1.5));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
  const mat = new THREE.PointsMaterial({
    color:cfg.hi,size:.018 + rarity*.018,transparent:true,opacity:.3+rarity*.55,
    blending:THREE.AdditiveBlending,depthWrite:false
  });
  group.add(new THREE.Points(g,mat));
}

function clearGroup(){
  while(group.children.length){
    const obj=group.children.pop();
    obj.traverse(o=>{
      if(o.geometry) o.geometry.dispose();
      if(o.material){
        if(Array.isArray(o.material)) o.material.forEach(x=>x.dispose());
        else o.material.dispose();
      }
    });
  }
}

function generate(){
  loading.classList.remove('hidden');
  requestAnimationFrame(()=>{
    clearGroup();

    let type = document.querySelector('#type').value;
    if(type==='random') type=randomType();
    const cfg=TYPES[type];
    const rarity=Number(document.querySelector('#rarity').value)/100;
    const crystals=Number(document.querySelector('#crystals').value);

    makeRock(cfg,rarity);
    if(cfg.crystals){
      for(let i=0;i<crystals;i++) makeCrystal(cfg,i,rarity);
    }
    addInclusions(cfg,rarity);
    addSparkles(cfg,rarity);

    badge.textContent=cfg.name;
    group.rotation.set(0,0,0);
    loading.classList.add('hidden');
  });
}

document.querySelector('#generate').onclick=generate;
document.querySelector('#randomTop').onclick=()=>{
  document.querySelector('#type').value='random';
  document.querySelector('#rarity').value=Math.floor(rand(35,100));
  document.querySelector('#gloss').value=Math.floor(rand(65,100));
  document.querySelector('#transparency').value=Math.floor(rand(10,85));
  document.querySelector('#crystals').value=Math.floor(rand(2,13));
  generate();
};

document.querySelector('#download').onclick=()=>{
  renderer.render(scene,camera);
  const a=document.createElement('a');
  a.download='my-gem.png';
  a.href=renderer.domElement.toDataURL('image/png');
  a.click();
};

addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
});

function animate(t){
  requestAnimationFrame(animate);
  if(group.children.length){
    group.rotation.y += 0.0015;
  }
  controls.update();
  renderer.render(scene,camera);
}
generate();
animate();
