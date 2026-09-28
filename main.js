import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x517254)
const exrLoader = new EXRLoader()
const gltfLoader = new GLTFLoader()


// SECTION - camara

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)


// SECTION - rebderer

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass)

const textureLoader = new THREE.TextureLoader();


// SECTION - fog

scene.fog = new THREE.Fog(0x517254, 12, 55);


// SECTION - bloom

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.02,  //  NOTE Intensidad del bloom
    0.1,
    1
)
composer.addPass(bloomPass);


// SECTION - controles de camara

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
controls.dampingFactor = 0.005
controls.enableZoom = false
controls.minPolarAngle = 1
controls.maxPolarAngle = Math.PI / 1.8
controls.minAzimuthAngle = -Math.PI / 75
controls.maxAzimuthAngle = Math.PI / 3.5
camera.zoom = 1.5
camera.updateProjectionMatrix();
controls.target.set(-2, 6, 1);
camera.position.set(8,5,14)



// SECTION - vereda

const colorVereda = textureLoader.load('/public/assets/color2.jpg')
const dispVerdeda = textureLoader.load('/public/assets/disp2.png')
const normalVereda = exrLoader.load('/public/assets/norm2.exr')
const roughVereda = exrLoader.load('/public/assets/rough2.exr')

const materialVereda = new THREE.MeshStandardMaterial({
    map: colorVereda,
    normalMap: normalVereda,
    displacementMap: dispVerdeda, 
    displacementScale: 0.01, 
    roughnessMap: roughVereda,
    metalness: 0,
    roughness: 0.3
})

colorVereda.minFilter = THREE.LinearFilter;
colorVereda.magFilter = THREE.LinearFilter;
colorVereda.generateMipmaps = true
colorVereda.wrapS = THREE.RepeatWrapping;
colorVereda.wrapT = THREE.RepeatWrapping;
colorVereda.repeat.set(10, 10)
colorVereda.needsUpdate = true;



// SECTION - piso

const colorTextura = textureLoader.load('/public/assets/color.jpg') 
const disp = textureLoader.load('/public/assets/disp.png') 
colorTextura.minFilter = THREE.LinearFilter; 
colorTextura.magFilter = THREE.LinearFilter;
colorTextura.generateMipmaps = true
colorTextura.wrapS = THREE.RepeatWrapping;
colorTextura.wrapT = THREE.RepeatWrapping;
colorTextura.repeat.set(7, 7)
colorTextura.needsUpdate = true;
const normal = exrLoader.load('/public/assets/norm.exr')
const rough = exrLoader.load('/public/assets/rough.exr')

const materialFloor = new THREE.MeshStandardMaterial({
    map: colorTextura,
    normalMap: normal, 
    displacementMap: disp,
    displacementScale: 0.001,
    roughnessMap: rough,
    metalness: 0,
    roughness: 0.3
})

const geometryFloor = new THREE.PlaneGeometry(150, 150, 64, 64)

const floor = new THREE.Mesh(geometryFloor, materialFloor)
floor.castShadow = true
floor.receiveShadow = true
floor.rotation.x = -Math.PI / 2
floor.position.y = 0.2

scene.add(floor)


// SECTION - Iluminacion

const ambientLight = new THREE.HemisphereLight(0x9ED7F6, 0x5f7800, 0.3) 
scene.add(ambientLight)
// const helper = new THREE.HemisphereLightHelper(ambientLight, 2) 
// scene.add(helper)

const directionalLight = new THREE.DirectionalLight(0x3E5472, 0.1);
directionalLight.position.set(10, 15, -5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// const helper2 = new THREE.DirectionalLightHelper(directionalLight, 2) 
// scene.add(helper2)

directionalLight.intensity = 0.5
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(2048, 2048);
directionalLight.shadow.radius = 1;
directionalLight.shadow.bias = 0.001 // REVIEW  hace que se vea mas nitido el objeto y que no le genere tantaa sombra con bias y normalBias dentro del mismo objeto
directionalLight.shadow.normalBias = 0.025

// const axesHelper = new THREE.AxesHelper(15); 
// scene.add(axesHelper)

// NOTE luz faro
const streetLight = new THREE.SpotLight(0xffaa55, 50, 25, Math.PI / 3, 0.5, 2);
streetLight.position.set(5, 5.5, 0); 

streetLight.castShadow = true;
streetLight.shadow.mapSize.width = 2024;
streetLight.shadow.mapSize.height = 2024;
streetLight.shadow.bias = -0.001;
streetLight.target.position.set(5, 0, 0);
scene.add(streetLight.target);


// const helper3 = new THREE.SpotLightHelper(streetLight, 100)
// scene.add(helper3)


scene.add(streetLight);
// NOTE luz general
const streetLight2 = new THREE.SpotLight(0xffaa55, 30, 25, Math.PI /4, 1, 2);
streetLight2.position.set(-1, 5.5, 12); 

streetLight2.castShadow = true;
streetLight2.shadow.mapSize.width = 2024;
streetLight2.shadow.mapSize.height = 2024;
streetLight2.shadow.bias = -0.002;
streetLight2.target.position.set(-1, 1, 5);
streetLight2.shadow.radius = 0.2;
scene.add(streetLight2.target);

// const helperSL2 = new THREE.SpotLightHelper(streetLight2, 1)
// scene.add(helperSL2)

scene.add(streetLight2);
// NOTE luz general 2
const streetLight3 = new THREE.SpotLight(0xffaa55, 20, 12, Math.PI / 5, 0.2, 2);
streetLight3.position.set(5, 5, 7); 

streetLight3.castShadow = true;
streetLight3.shadow.mapSize.width = 2024;
streetLight3.shadow.mapSize.height = 2024;
streetLight3.shadow.bias = -0.001;
streetLight3.target.position.set(2, 2, 5);
streetLight3.shadow.radius = 3;
scene.add(streetLight3.target);

// const helperSL3 = new THREE.SpotLightHelper(streetLight3, 1)
// scene.add(helperSL3)

scene.add(streetLight3);


// SECTION - luz de holograma jorgito

const light = new THREE.PointLight( 0xEBE829, 5, 10 );
light.position.set( 0, 6, 3 );
scene.add( light )
const helper4 = new THREE.PointLightHelper(light, 1)
const light2 = new THREE.PointLight( 0x3A962B, 1, 10 );
light2.position.set( 0, 6, 3 );
scene.add( light2 )
const helper5 = new THREE.PointLightHelper(light, 1)
light.castShadow = true
light.shadow.mapSize.width = 2024;
light.shadow.mapSize.height = 2024;
light.shadow.bias = -0.001;
light2.castShadow = true



// SECTION - modelo GLB


gltfLoader.load("/public/assets/kiosco.glb", (gltf) => {
    const modelo = gltf.scene;

    const kiosco = modelo.getObjectByName('cuerpo_quiosco')
    const texturaKiosco = textureLoader.load('/public/assets/color3.jpg')
    const roughKiosco = textureLoader.load('/public/assets/rough3.jpg')
    const normKiosco = textureLoader.load('/public/assets/norm3.jpg')
    const dispKiosco = textureLoader.load('/public/assets/disp3.jpg')
    const metalKiosco = textureLoader.load('/public/assets/metal3.jpg')
    const aoKiosco = textureLoader.load('/public/assets/aoMap3.jpg')
    const texturas = [texturaKiosco, roughKiosco, normKiosco, dispKiosco, metalKiosco, aoKiosco];

texturas.forEach(tex => {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
});

    const miMallaEspecifica = kiosco.children[0];

    miMallaEspecifica.material = new THREE.MeshStandardMaterial({
        map: texturaKiosco, 
        roughnessMap: roughKiosco,
        normalMap: normKiosco,
        displacementMap:dispKiosco,
        roughness: 0.3,
        metalness: 0.1,
        displacementScale: 0.01,
        metalnessMap: metalKiosco,
        color: 0xEEFF91,
        aoMap: aoKiosco,
        aoMapIntensity: 0.5,
    });

    miMallaEspecifica.material.needsUpdate = true;


    modelo.scale.set(0.65, 0.65, 0.65);
    modelo.rotation.set(0, Math.PI / 2, 0);
    modelo.position.set(0, 0, 5);

    const holograBajo = modelo.getObjectByName("holograma_abajo001")
    const hologramaArriba = modelo.getObjectByName("holograma_ARRIBA")

    // NOTE  borrar las lineas del holograma
    const lineas = modelo.getObjectByName("FONDO_ABAJO")
    lineas.material.transparent = true
    lineas.material.opacity = 0


    const lineas1 = modelo.getObjectByName("FONDO_ARRIBA")
    lineas1.material.transparent = true
    lineas1.material.opacity = 0

    const lineas2 = modelo.getObjectByName("FONDO_ARRIBA001")
    lineas2.material.transparent = true
    lineas2.material.opacity = 0

    const lineas3 = modelo.getObjectByName("FONDO_ABAJO001")
    lineas3.material.transparent = true
    lineas3.material.opacity = 0

    const hologramaAmarillo = modelo.getObjectByName("holograma_ARRIBA001");
    hologramaAmarillo.material.emissiveIntensity = 75.0;
    hologramaAmarillo.material.emissive.setHex(0xFFF300);


    const hologramaVerde = modelo.getObjectByName("holograma_abajo");
    hologramaVerde.material.emissiveIntensity = 75.0;
    hologramaVerde.material.emissive.setHex(0x38CD10);

    const hologramaKiosco = modelo.getObjectByName("holograma");
    hologramaKiosco.material.emissiveIntensity = 300.0;
    hologramaKiosco.material.emissive.setHex(0xFADF9D);

    hologramaKiosco.material.transparent = true;
    hologramaKiosco.material.opacity = 0.01


    const pantallaGrande = modelo.getObjectByName("pantalla_tele_grande");
    pantallaGrande.material.emissiveIntensity = 7
    pantallaGrande.material.emissive.setHex(0xF7EBC5);


    const bannerKiosco = modelo.getObjectByName("banner_quiosco");
    bannerKiosco.material.emissiveIntensity = 7
    bannerKiosco.material.emissive.setHex(0xF7EBC5);


    const luzFaro = modelo.getObjectByName("luz_faro");
    luzFaro.material.emissiveIntensity = 150
    luzFaro.material.emissive.setHex(0xF7EBC5);


    const bannerEternauta = modelo.getObjectByName("banner_eternauta")
    bannerEternauta.material.transparent = true;
    bannerEternauta.material.opacity = 0.05
    bannerEternauta.material.emissiveIntensity = 150


    const bannerEdgerunners = modelo.getObjectByName("banner_edgerunners")
    bannerEdgerunners.material.transparent = true;
    bannerEdgerunners.material.opacity = 0.05
    bannerEdgerunners.material.emissiveIntensity = 150
    bannerEdgerunners.position.y = 35


    const marolioLetras = modelo.getObjectByName("marolio_letras")
    marolioLetras.material.emissive.setHex(0xD34137);
    marolioLetras.material.emissiveIntensity = 100
    marolioLetras.position.x = 10
    marolioLetras.position.y = 28

    const bannerMarolio = modelo.getObjectByName("banner_marolio")
    bannerMarolio.material.transparent = true;
    bannerMarolio.material.opacity = 0.006
    bannerMarolio.material.emissiveIntensity = 700
    bannerMarolio.position.x = 10
    bannerMarolio.position.y = 28

    const objetoFaro = modelo.getObjectByName("faro_fondo_1");


    const vereda = modelo.getObjectByName('piso')
    const bordeVereda = modelo.getObjectByName('piso_borde')
    vereda.material = materialVereda
    vereda.rotation.y = Math.PI / 1
    bordeVereda.rotation.y = Math.PI / 1
    vereda.position.x = 3
    vereda.position.z = -4
    bordeVereda.position.x = 3
    bordeVereda.position.z = -4


    for (let i = 0; i <= 6; i++) {
        const faro = `faro_fondo_${i}`;

        const objetoFaro = modelo.getObjectByName(faro);
        if (objetoFaro) {
            objetoFaro.children[1].material.emissiveIntensity = 50
        }
    }

    modelo.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true


            console.log(child.name) // NOTE aca vemos los nombres que se le asigno a cada objeto en Blender 
        }
    })

    // SECTION -  holograma jorgito


    for (let i = 1; i <= 973; i++) {

        const luzHolograma = `GN_Instance_${i}`;


        const objeto = modelo.getObjectByName(luzHolograma);

        if (objeto) {

            if (objeto.material) {


                objeto.material.emissive.setHex(0xFFFFFF);
                objeto.material.emissiveIntensity = 35.0;
                objeto.castShadow = false
            }
        }
    }



    hologramaVerde.castShadow = false
    hologramaKiosco.castShadow = false
    hologramaAmarillo.castShadow = false
    hologramaKiosco.castShadow = false
    lineas3.castShadow = false
    lineas2.castShadow = false
    lineas1.castShadow = false
    lineas.castShadow = false
    holograBajo.castShadow = false
    hologramaArriba.castShadow = false

    scene.add(modelo);


})


function animate() {

    requestAnimationFrame(animate);
    controls.update()

    composer.render(scene, camera)

}
animate()