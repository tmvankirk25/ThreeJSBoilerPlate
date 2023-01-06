// Import the necessary three.js modules
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import dink from "../../resources/wav/dink.wav"
import dunes from "../../resources/wav/dunes-7115.mp3"
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
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.add(camera);

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

// Set up the controls
let controls = new OrbitControls( camera,  renderer.domElement  );
          controls.minZoom=.5
          controls.maxZoom=1.5
          controls.minDistance = 120;
          controls.maxDistance = 600;
          controls.update()
// Set up the spheres
//const sphereGeometry = new THREE.SphereGeometry(getRandomArbitrary(1, 10), 32, 32);
const spheres = [];
for (let i = 0; i < 120; i++) {
  let radius=getRandomArbitrary(10, 60)
  let sphereGeometry= new THREE.SphereGeometry(radius, 32, 32)
  // Generate a random color
  const color = new THREE.Color("white");
  
  // Create the sphere with the random color
  const sphereMaterial = new THREE.MeshStandardMaterial({ color,emissive:"#fffaed",emissiveIntensity:0 });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  const light = new THREE.PointLight( "#fffaed", 0, radius+50 );
  sphere.position.set(getRandomArbitrary(-400, 400), getRandomArbitrary(-400, 400), getRandomArbitrary(-400, 400));
  light.position.set(sphere.position.x,sphere.position.y,sphere.position.z );
  sphere.velocity = new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(1.8);
  sphere.radius=radius
  sphere.attach(light)
  spheres.push(sphere);
  scene.add(sphere);
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
  audio.currentTime=0
  audio.play()
  for(const sphere of spheres){
    sphere.material.emissiveIntensity=0
    sphere.children[0].intensity=0
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
      if(object.material.emissiveIntensity==5){
        object.children[0].intensity=0
        object.material.emissiveIntensity=0
      }
      else if(object.material.emissiveIntensity==0){
        object.children[0].intensity=5
        object.material.emissiveIntensity=5
      }
     
    }
  }


// Render the scene
function render() {
  requestAnimationFrame(render);

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
      if (sphere !== other && sphere.position.distanceTo(other.position) <= sphere.radius+50 || sphere !== other && other.position.distanceTo(sphere.position)<=other.radius+50) {
        // Calculate the new velocities
        const v1 = sphere.velocity.clone();
        const v2 = other.velocity.clone();
        const normal = other.position.clone().sub(sphere.position).normalize();
        
        if(sphere.material.emissiveIntensity==5 || other.material.emissiveIntensity==5){
          if(sphere.material.emissiveIntensity==0 || other.material.emissiveIntensity==0){
            audio.currentTime=0
            audio.play()
          }
          sphere.children[0].intensity=5
          other.children[0].intensity=5
          sphere.material.emissiveIntensity=5
          other.material.emissiveIntensity=5
          
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

  renderer.render(scene, camera);
}
render();

function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

