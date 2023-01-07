// Import the necessary three.js modules
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


import dink from "../../resources/wav/dink.wav"
import dunes from "../../resources/wav/dunes-7115.mp3"
import whooshBell from "../../resources/wav/composedWooshBell.wav"
// import { EffectComposer } from '/postprocessing/EffectComposer.js';
// import { RenderPass } from '/postprocessing/RenderPass.js';
// import { ShaderPass } from '/postprocessing/ShaderPass.js';
// import { UnrealBloomPass } from '/postprocessing/UnrealBloomPass.js';

// Import the necessary three.js modules
document.addEventListener( 'click', onClick );
document.getElementById("reset").addEventListener("click",reset)
const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();
// Set up the scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color( "#171717" );
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer( { antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild(renderer.domElement);
scene.add(camera);


const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

const params = {
  exposure: 1,
  bloomStrength: 5,
  bloomThreshold: 0,
  bloomRadius: 0,
};

const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const bloomComposer = new EffectComposer( renderer );
bloomComposer.renderToScreen = false;
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );

const finalPass = new ShaderPass(
  new THREE.ShaderMaterial( {
    uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: bloomComposer.renderTarget2.texture }
    },
    vertexShader: document.getElementById( 'vertexshader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
    defines: {}
  } ), 'baseTexture'
);
finalPass.needsSwap = true;

const finalComposer = new EffectComposer( renderer );
finalComposer.addPass( renderScene );
finalComposer.addPass( finalPass );



const backgroundTrack= new Audio()
backgroundTrack.src=dunes
backgroundTrack.loop= true
console.log(backgroundTrack)

backgroundTrack.addEventListener("canplaythrough", () => {
    backgroundTrack.play().catch(e => {
       window.addEventListener('click', () => {
          backgroundTrack.play()
       })
    })
 });

console.log("hjhjk")
const audio = new Audio();
audio.src = dink;
console.log(dink)

const successAudio = new Audio()
successAudio.src=whooshBell


// Set up the controls
let controls = new OrbitControls( camera,  renderer.domElement  );
          controls.minZoom=.5
          controls.maxZoom=1.5
          controls.minDistance = 120;
          controls.maxDistance = 600;
          controls.update()
// Set up the spheres
//const sphereGeometry = new THREE.SphereGeometry(getRandomArbitrary(1, 10), 32, 32);
const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
const materials = {};
const spheres = [];
for (let i = 0; i < 120; i++) {
  let radius=getRandomArbitrary(10, 60)
  let sphereGeometry= new THREE.SphereGeometry(radius, 32, 32)
  // Generate a random color
  const color = new THREE.Color("white");
  // color.setHSL( Math.random(), 0.7, Math.random() * 0.2 + 0.05 )
  //color.setHSL( 62, 0, .1 )
  // Create the sphere with the random color
  const sphereMaterial = new THREE.MeshStandardMaterial({ color:color, emissive:"white", emissiveIntensity:0});
 
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  //const light = new THREE.PointLight( "#fffaed", 0, radius+50 );
  sphere.position.set(getRandomArbitrary(-400, 400), getRandomArbitrary(-400, 400), getRandomArbitrary(-400, 400));
  //light.position.set(sphere.position.x,sphere.position.y,sphere.position.z );
  sphere.velocity = new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(1.8);
  sphere.radius=radius
  sphere.bloom=false
  //sphere.attach(light)
  spheres.push(sphere);
  scene.add(sphere);
  console.log(sphere.material)
}
let index=getRandomArbitrary(0,spheres.length)
// spheres[index].children[0].intensity=5
// spheres[index].material.emissiveIntensity=5

let ambientLight= new THREE.AmbientLight ( 0xffffff, .01)
scene.add(ambientLight)
// let dirLight= new THREE.DirectionalLight( 0xffffff, 1 )
// let dirLight2= new THREE.DirectionalLight( 0xffffff, 1 )
// let dirLight3= new THREE.DirectionalLight( 0xffffff, .5 )
// dirLight2.position.set(-.5,.5,0)
// dirLight3.position.set(.5,-.5,.5)
// scene.add(dirLight)
function reset(){
  console.log("reset")
  successToggle=true
  audio.currentTime=0
  audio.play()
  for(const sphere of spheres){
    sphere.layers.disable(1)
    sphere.bloom=false
    sphere.material.emissiveIntensity=0
  }
}
function onClick( event ) {
  event.preventDefault();
  console.log("click")
  // controls.enableRotate=false
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    console.log(mouse.x)
    console.log(event.clientX)

    raycaster.setFromCamera( mouse, camera );

    const intersections = raycaster.intersectObjects( spheres, false );
    console.log(spheres.length)
    if ( intersections.length > 0 ) {

      const object = intersections[ 0 ].object;
      console.log(object)
      if(object.bloom==true){
        object.layers.disable( 1 )
        object.bloom=false
        object.material.emissiveIntensity=0
      }
      else{
        object.layers.enable( 1 )
        object.material.emissiveIntensity=.1
        object.bloom=true
      }
     
    }
  }


// Render the scene
function animate() {
  requestAnimationFrame(animate);
  // Update the spheres' positions
  for (const sphere of spheres) {
    sphere.velocity.clampLength(.5,10000)
    sphere.position.add(sphere.velocity);

    if (sphere.position.x < -400 || sphere.position.x > 400) {
        // Reflect the velocity off the x-boundary
        sphere.velocity.x *= -1;
      }
      if (sphere.position.y < -400 || sphere.position.y > 400) {
        // Reflect the velocity off the y-boundary
        sphere.velocity.y *= -1;
      }
      if (sphere.position.z < -400 || sphere.position.z > 400) {
        sphere.velocity.z *= -1;
      }
    // Check for collisions with other spheres
    for (const other of spheres) {
      if (sphere !== other && sphere.position.distanceTo(other.position) <= sphere.radius+5|| sphere !== other && other.position.distanceTo(sphere.position)<=other.radius+5) {
        // Calculate the new velocities
        const v1 = sphere.velocity.clone();
        const v2 = other.velocity.clone();
        const normal = other.position.clone().sub(sphere.position).normalize();
        
        if(sphere.bloom==true || other.bloom==true){
          if(sphere.bloom==false || other.bloom==false){
            audio.currentTime=0
            audio.play()
            if(sphere.bloom==false){
              sphere.layers.enable(1)
              sphere.material.emissiveIntensity=.1
            }
            if(other.bloom==false){
              other.layers.enable(1)
              other.material.emissiveIntensity=.1
            }
            
            sphere.bloom=true
            other.bloom=true
          }
          
          // sphere.children[0].intensity=5
          // other.children[0].intensity=5
          // sphere.material.emissiveIntensity=5
          // other.material.emissiveIntensity=5
          
          sphere.velocity=sphere.velocity.multiplyScalar(.99)
          other.velocity=other.velocity.multiplyScalar(.99)
        }

        // sphere.velocity = v1.sub(normal.multiplyScalar(1 * v1.dot(normal)));
        // other.velocity = v2.sub(normal.multiplyScalar(1* v2.dot(normal)));

        // Move the spheres out of each other
        // sphere.position.add(sphere.velocity);
        // other.position.add(other.velocity);
      }
    }

  }
  var testBool=true
  var count=0
  for(let i=0;i<spheres.length;i++){
    if(spheres[i].bloom==false){
      testBool=false
      count+=1
    }
  }
  //console.log(count)
  if(testBool==true){
    successFunction()
  }
  render()
}
animate();
//render();

function renderBloom(){
  scene.traverse( darkenNonBloomed );
  bloomComposer.render()
  scene.traverse( restoreMaterial );
}



function darkenNonBloomed( obj ) {

  if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {

    materials[ obj.uuid ] = obj.material;
    obj.material = darkMaterial;

  }

}

function restoreMaterial( obj ) {

  if ( materials[ obj.uuid ] ) {

    obj.material = materials[ obj.uuid ];
    delete materials[ obj.uuid ];

  }

}

let successToggle=true
function successFunction(){
  if(successToggle==true){
    console.log("all spheres are lit!")
    successAudio.currentTime=0
    successAudio.play()
    successToggle=false
  }
}


function render(){
  renderBloom()
  finalComposer.render()
}

function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

