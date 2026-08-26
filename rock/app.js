import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas=document.querySelector("#scene");
const viewer=document.querySelector(".viewer");
const slidersEl=document.querySelector("#sliders");
const statusEl=document.querySelector("#status");

const params={
  count:72,length:65,thickness:50,direction:80,transparency:85,color:70,irregular:80,gloss:95,
  inclusions:true,cracks:true
};
const sliderDefs=[
  ["count","晶體數量",8,110,1],
  ["length","晶體長度",25,100,1],
  ["thickness","晶體粗細",20,90,1],
  ["direction","生長方向",0,100,1],
  ["transparency","透明度",25,100,1],
  ["color","紫色濃度",0,100,1],
  ["irregular","晶體不規則",0,100,1],
  ["gloss","光澤",20,100,1]
];

function makeSliders(){
  slidersEl.innerHTML="";
  sliderDefs.forEach(([key,label,min,max,step])=>{
    const el=document.createElement("div");el.className="slider";
    el.innerHTML=`<div class="sliderHead"><span>${label}</span><b id="v-${key}">${params[key]}</b></div>
      <input class="range" id="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${params[key]}">`;
    slidersEl.appendChild(el);
    el.querySelector("input").addEventListener("input",e=>{params[key]=+e.target.value;document.querySelector("#v-"+key).textContent=params[key];});
  });
}
makeSliders();

document.querySelectorAll(".toggle").forEach(b=>b.addEventListener("click",()=>{b.classList.toggle("on");params[b.dataset.key]=b.classList.contains("on");generate()}));

const scene=new THREE.Scene();
scene.background=new THREE.Color("#030304");
const camera=new THREE.PerspectiveCamera(35,1,.1,100);
camera.position.set(0,2.4,8.6);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;

const controls=new OrbitControls(camera,canvas);
controls.enableDamping=true;controls.dampingFactor=.06;controls.minDistance=4;controls.maxDistance=13;
controls.target.set(0,1,0);

const group=new THREE.Group();scene.add(group);
const lights=new THREE.Group();scene.add(lights);
const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(4,7,6);lights.add(key);
const fill=new THREE.DirectionalLight(0xbca6ff,3);fill.position.set(-5,3,1);lights.add(fill);
const rim=new THREE.PointLight(0x9d55ff,30,12);rim.position.set(0,4,-3);lights.add(rim);
scene.add(new THREE.HemisphereLight(0x6d6380,0x111111,1.4));

const ground=new THREE.Mesh(new THREE.CircleGeometry(7,96),new THREE.MeshStandardMaterial({color:0x09090b,roughness:.72,metalness:.05}));
ground.rotation.x=-Math.PI/2;ground.position.y=-1.2;scene.add(ground);

const mineralColors={
  amethyst:new THREE.Color("#8f4bd9"),
  quartz:new THREE.Color("#e9f4ff"),
  fluorite:new THREE.Color("#62c8c1"),
  obsidian:new THREE.Color("#14151c"),
  citrine:new THREE.Color("#d59b32")
};

function rand(a,b){return a+Math.random()*(b-a)}
function crystalGeometry(h,r){
  const sides=6;
  const pts=[];
  const half=h*.5, tip=h*.16;
  for(let i=0;i<=sides;i++){const a=i/sides*Math.PI*2;pts.push(new THREE.Vector2(Math.cos(a)*r,Math.sin(a)*r))}
  const shape=new THREE.Shape();
  shape.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)shape.lineTo(pts[i].x,pts[i].y);shape.closePath();
  const geom=new THREE.ExtrudeGeometry(shape,{depth:h-tip,bevelEnabled:false,steps:1});
  geom.translate(0,0,-(h-tip)/2);
  const cone=new THREE.ConeGeometry(r,tip,6);
  cone.translate(0,(h-tip)/2+tip/2,0);
  const merged=new THREE.BufferGeometry();
  const pos=[];
  for(const g of [geom,cone])pos.push(...g.attributes.position.array);
  merged.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));
  // Non-indexed is intentional for simple generated specimen geometry.
  merged.computeVertexNormals();
  return merged;
}

function makeMaterial(mineral){
  const base=mineralColors[mineral].clone();
  if(mineral==="amethyst") base.offsetHSL(0,rand(-.04,.04),rand(-.05,.05));
  const transmission=Math.max(.05,params.transparency/100*.9);
  return new THREE.MeshPhysicalMaterial({
    color:base,
    roughness:Math.max(.08,1-params.gloss/110),
    metalness:mineral==="obsidian"?.12:.02,
    transmission:mineral==="obsidian"?.02:transmission,
    transparent:mineral!=="obsidian",
    opacity:mineral==="obsidian"?.98:.84,
    ior:1.46,
    thickness:.75,
    attenuationColor:base,
    attenuationDistance:2.2,
    clearcoat:.35,
    clearcoatRoughness:.12
  });
}

function addInclusions(mesh,material){
  const n=Math.floor(params.count/13);
  for(let i=0;i<n;i++){
    const s=new THREE.Mesh(new THREE.SphereGeometry(rand(.025,.08),8,8),new THREE.MeshBasicMaterial({color:0x151018,transparent:true,opacity:.55}));
    s.position.set(rand(-.45,.45),rand(-.9,.9),rand(-.45,.45));s.scale.y=rand(.5,2.5);mesh.add(s);
  }
}
function addCracks(mesh,h,r){
  const mat=new THREE.LineBasicMaterial({color:0xe6d6ff,transparent:true,opacity:.42});
  for(let k=0;k<Math.floor(params.count/22);k++){
    const pts=[];let y=rand(-h*.3,h*.3),x=rand(-r*.5,r*.5),z=rand(-r*.5,r*.5);
    for(let j=0;j<4;j++){pts.push(new THREE.Vector3(x+rand(-.12,.12),y+j*h*.09,z+rand(-.12,.12)));}
    mesh.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),mat));
  }
}

function generate(){
  statusEl.textContent="GENERATING · PBR";
  while(group.children.length)group.remove(group.children[0]);
  const mineral=document.querySelector("#mineral").value;
  const count=document.querySelector("#form").value==="single"?1:Math.round(params.count);
  const baseMat=makeMaterial(mineral);
  const max= Math.min(count,105);
  for(let i=0;i<max;i++){
    const h=1.05 + (params.length/100)*2.8*rand(.72,1.18);
    const r=.13 + (params.thickness/100)*.42*rand(.72,1.2);
    const g=crystalGeometry(h,r);
    const m=baseMat.clone();
    const jitter=params.irregular/100;
    const crystal=new THREE.Mesh(g,m);
    const radial=Math.sqrt(Math.random())*(1.35*(count>1?1:0));
    const ang=Math.random()*Math.PI*2;
    crystal.position.set(Math.cos(ang)*radial, -1.02+rand(0,.55), Math.sin(ang)*radial);
    crystal.rotation.y=ang+rand(-.35,.35);
    crystal.rotation.z=rand(-.18,.18)*jitter;
    crystal.rotation.x=(Math.random()-.5)*.15*params.direction/100;
    crystal.scale.x*=rand(1-jitter*.18,1+jitter*.2);
    crystal.scale.z*=rand(1-jitter*.18,1+jitter*.2);
    group.add(crystal);
    if(params.inclusions)addInclusions(crystal,m);
    if(params.cracks)addCracks(crystal,h,r);
  }
  // Dark mineral matrix.
  const matrix=new THREE.Mesh(new THREE.DodecahedronGeometry(1.35,1),new THREE.MeshStandardMaterial({color:0x2a2927,roughness:.92,metalness:.02}));
  matrix.scale.set(1.35,.48,1.05);matrix.position.y=-1.18;group.add(matrix);
  // Small matrix fragments for photographic realism.
  for(let i=0;i<28;i++){
    const rock=new THREE.Mesh(new THREE.IcosahedronGeometry(rand(.08,.23),0),new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(rand(.06,.12),.12,rand(.14,.28)),roughness:.9}));
    const a=Math.random()*Math.PI*2,rad=rand(.25,1.35);
    rock.position.set(Math.cos(a)*rad,-1.02+rand(-.05,.22),Math.sin(a)*rad);
    rock.scale.y=rand(.5,1.4);group.add(rock);
  }
  statusEl.textContent="READY · 3D PBR";
  createThumbs();
}

function createThumbs(){
  const t=document.querySelector("#thumbs");t.innerHTML="";
  for(let i=0;i<4;i++){const b=document.createElement("button");b.className="thumb"+(i===0?" active":"");b.textContent="◆";b.addEventListener("click",()=>{document.querySelectorAll(".thumb").forEach(x=>x.classList.remove("active"));b.classList.add("active");params.direction=Math.random()*100;generate()});t.appendChild(b)}
}

function resize(){const w=viewer.clientWidth,h=viewer.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}
new ResizeObserver(resize).observe(viewer);resize();

document.querySelector("#generate").onclick=generate;
document.querySelector("#generateTop").onclick=generate;
document.querySelector("#randomBtn").onclick=()=>{sliderDefs.forEach(([k])=>{const input=document.querySelector("#"+k);params[k]=+input.min+Math.random()*(+input.max-+input.min);input.value=params[k];document.querySelector("#v-"+k).textContent=Math.round(params[k])});generate()};
document.querySelector("#lightBtn").onclick=()=>{key.intensity=key.intensity>3?1.6:5;fill.intensity=fill.intensity>2?1:3};
document.querySelector("#envBtn").onclick=()=>{const bg=scene.background;bg.set(bg.getHex()===0x030304?0x161218:0x030304)};
canvas.addEventListener("dblclick",()=>{controls.reset()});
document.querySelector("#mineral").addEventListener("change",generate);
document.querySelector("#form").addEventListener("change",generate);
document.querySelector("#environment").addEventListener("change",e=>{
  const v=e.target.value;
  scene.background.set(v==="warm"?"#1a1008":v==="dark"?"#000001":"#030304");
});

function animate(){requestAnimationFrame(animate);controls.update();group.rotation.y+=.0012;renderer.render(scene,camera)}
generate();animate();
