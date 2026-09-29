import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

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
camera.position.set(8, 5, 14)



// SECTION - vereda

const colorVereda = textureLoader.load('/assets/color2.jpg')
const dispVerdeda = textureLoader.load('/assets/disp2.png')
const normalVereda = exrLoader.load('/assets/norm2.exr')
const roughVereda = exrLoader.load('/assets/rough2.exr')

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

const colorTextura = textureLoader.load('/assets/color.jpg')
const disp = textureLoader.load('/assets/disp.png')
colorTextura.minFilter = THREE.LinearFilter;
colorTextura.magFilter = THREE.LinearFilter;
colorTextura.generateMipmaps = true
colorTextura.wrapS = THREE.RepeatWrapping;
colorTextura.wrapT = THREE.RepeatWrapping;
colorTextura.repeat.set(7, 7)
colorTextura.needsUpdate = true;
const normal = exrLoader.load('/assets/norm.exr')
const rough = exrLoader.load('/assets/rough.exr')

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
const streetLight2 = new THREE.SpotLight(0xffaa55, 30, 25, Math.PI / 4, 1, 2);
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
const streetLight3 = new THREE.SpotLight(0xffaa55, 15, 12, Math.PI / 5, 0.2, 2);
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


// NOTE - luz de holograma jorgito

const light = new THREE.PointLight(0xEBE829, 5, 10);
light.position.set(0, 6, 3);
scene.add(light)
const helper4 = new THREE.PointLightHelper(light, 1)
const light2 = new THREE.PointLight(0x3A962B, 1, 10);
light2.position.set(0, 6, 3);
scene.add(light2)
const helper5 = new THREE.PointLightHelper(light, 1)
light.castShadow = true
light.shadow.mapSize.width = 2024;
light.shadow.mapSize.height = 2024;
light.shadow.bias = -0.001;
light2.castShadow = true


// NOTE - luz cyberpunk edgrunners

RectAreaLightUniformsLib.init();
const intensity = 200; const width = 2; const height = 10;
const rectLight = new THREE.RectAreaLight(0xA0AF6B, intensity, width, height);
rectLight.position.set(-21.7, 23, -24.5)
rectLight.lookAt(-30, 23, -25);
scene.add(rectLight)
// const rectLightHelper = new RectAreaLightHelper(rectLight);
// scene.add(rectLightHelper);



// NOTE - luz eternauta

const intensity2 = 25; const width2 = 4; const height2 = 10;
const rectLight2 = new THREE.RectAreaLight(0xACEFFF, intensity2, width2, height2);
rectLight2.position.set(-21.7, 23.5, -15)
rectLight2.lookAt(-30, 23.5, -15);
scene.add(rectLight2)
// const rectLightHelper2 = new RectAreaLightHelper(rectLight2);
// scene.add(rectLightHelper2);



// NOTE - luz marolio

const intensity3 = 30; const width3 = 3; const height3 = 12;
const rectLight3 = new THREE.RectAreaLight(0xA0AF6B, intensity3, width3, height3);
rectLight3.position.set(-21.7, 17.8, -1)
rectLight3.lookAt(-25, 17.8, -1);
scene.add(rectLight3)
// const rectLightHelper3 = new RectAreaLightHelper(rectLight3);
// scene.add(rectLightHelper3);



// NOTE - luz edificio

const intensity4 = 500; const width4 = 10; const height4 = 3;
const rectLight4 = new THREE.RectAreaLight(0xA0AF6B, intensity4, width4, height4);
rectLight4.position.set(-21.7, 33, -19)
rectLight4.lookAt(-30, 33, -19);
scene.add(rectLight4)
// const rectLightHelper4 = new RectAreaLightHelper(rectLight4);
// scene.add(rectLightHelper4);



// NOTE - luz edificio2

const intensity5 = 100; const width5 = 18; const height5 = 3;
const rectLight5 = new THREE.RectAreaLight(0xA0AF6B, intensity5, width5, height5);
rectLight5.position.set(-21.7, 27.5, 7)
rectLight5.lookAt(-30, 27.5, 7);
scene.add(rectLight5)
// const rectLightHelper5 = new RectAreaLightHelper(rectLight5);
// scene.add(rectLightHelper5);



// NOTE - luz edificio3

const intensity6 = 30; const width6 = 10; const height6 = 4;
const rectLight6 = new THREE.RectAreaLight(0xA0AF6B, intensity6, width6, height6);
rectLight6.position.set(-21.7, 21.5, 3)
rectLight6.lookAt(-30, 21.5, 3);
scene.add(rectLight6)
// const rectLightHelper6 = new RectAreaLightHelper(rectLight6);
// scene.add(rectLightHelper6);



// NOTE - luz edificio4

const intensity7 = 60; const width7 = 5; const height7 = 4;
const rectLight7 = new THREE.RectAreaLight(0xA0AF6B, intensity7, width7, height7);
rectLight7.position.set(-21.7, 21.5, 4.5)
rectLight7.lookAt(-30, 21.5, 4.5);
scene.add(rectLight7)
// const rectLightHelper7 = new RectAreaLightHelper(rectLight7);
// scene.add(rectLightHelper7);



// NOTE - luz edificio6

const intensity8 = 60; const width8 = 5; const height8 = 4;
const rectLight8 = new THREE.RectAreaLight(0xA0AF6B, intensity8, width8, height8);
rectLight8.position.set(-21.7, 21.5, 12)
rectLight8.lookAt(-30, 21.5, 12);
scene.add(rectLight8)
// const rectLightHelper8 = new RectAreaLightHelper(rectLight8);
// scene.add(rectLightHelper8);


// NOTE - luz edificio 7

const intensity9 = 80; const width9 = 10; const height9 = 3;
const rectLight9 = new THREE.RectAreaLight(0xA0AF6B, intensity9, width9, height9);
rectLight9.position.set(-21.7, 14, -20)
rectLight9.lookAt(-30, 14, -20);
scene.add(rectLight9)
// const rectLightHelper9 = new RectAreaLightHelper(rectLight9);
// scene.add(rectLightHelper9);




// SECTION - modelo GLB

gltfLoader.load("/assets/kiosco.glb", (gltf) => {
    const modelo = gltf.scene;

    const kiosco = modelo.getObjectByName('cuerpo_quiosco')
    const texturaKiosco = textureLoader.load('/assets/color3.jpg')
    const roughKiosco = textureLoader.load('/assets/rough3.jpg')
    const normKiosco = textureLoader.load('/assets/norm3.jpg')
    const dispKiosco = textureLoader.load('/assets/disp3.jpg')
    const metalKiosco = textureLoader.load('/assets/metal3.jpg')
    const aoKiosco = textureLoader.load('/assets/aoMap3.jpg')
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
        displacementMap: dispKiosco,
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

    // SECTION - videos

    const manaosVideo = document.createElement('video')
    manaosVideo.src = "/assets/manaos.mp4"
    manaosVideo.crossOrigin = 'anonymous';
    manaosVideo.loop = true;
    manaosVideo.muted = true;
    manaosVideo.playsInline = true;
    manaosVideo.load();
    manaosVideo.play()
    const videoTexture = new THREE.VideoTexture(manaosVideo);
    videoTexture.colorSpace = THREE.SRGBColorSpace;

    const videoMaterial = new THREE.MeshStandardMaterial({
        map: videoTexture,
        emissive: 0xffffff,      
        emissiveMap: videoTexture, 
        emissiveIntensity: 15
    });

    const quilmesVideo = document.createElement('video')
    quilmesVideo.src = "/assets/quilmes.mp4"
    quilmesVideo.crossOrigin = 'anonymous';
    quilmesVideo.loop = true;
    quilmesVideo.muted = true;
    quilmesVideo.playsInline = true;
    quilmesVideo.load();
    quilmesVideo.play()
    const videoTexture2 = new THREE.VideoTexture(quilmesVideo);
    videoTexture2.colorSpace = THREE.SRGBColorSpace;

    const videoMaterial2 = new THREE.MeshStandardMaterial({
        map: videoTexture2,
        emissive: 0xffffff,      
    emissiveMap: videoTexture2, 
    emissiveIntensity: 5
    });

    const estaticaVideo = document.createElement('video')
    estaticaVideo.src = "/assets/estatica.mp4"
    estaticaVideo.crossOrigin = 'anonymous';
    estaticaVideo.loop = true;
    estaticaVideo.muted = true;
    estaticaVideo.playsInline = true;
    estaticaVideo.load();
    estaticaVideo.play()

    const videoTexture3 = new THREE.VideoTexture(estaticaVideo);
    videoTexture3.colorSpace = THREE.SRGBColorSpace;

    const videoMaterial3 = new THREE.MeshStandardMaterial({
        map: videoTexture3,
        emissive: 0xffffff,      
    emissiveMap: videoTexture3, 
    emissiveIntensity: 100
    });

    const banelcoVideo = document.createElement('video')
    banelcoVideo.src = "/assets/banelco.mp4"
    banelcoVideo.crossOrigin = 'anonymous';
    banelcoVideo.loop = true;
    banelcoVideo.muted = true;
    banelcoVideo.playsInline = true;
    banelcoVideo.load();
    banelcoVideo.play()

    const videoTexture4 = new THREE.VideoTexture(banelcoVideo);
    videoTexture4.colorSpace = THREE.SRGBColorSpace;

    const videoMaterial4 = new THREE.MeshStandardMaterial({
        map: videoTexture4,
        emissive: 0xffffff,      
    emissiveMap: videoTexture4, 
    emissiveIntensity: 10
    });

    
    const mostazaVideo = document.createElement('video')
    mostazaVideo.src = "/assets/mostaza.mp4"
    mostazaVideo.crossOrigin = 'anonymous';
    mostazaVideo.loop = true;
    mostazaVideo.muted = true;
    mostazaVideo.playsInline = true;
    mostazaVideo.load();
    mostazaVideo.play()

    const videoTexture5 = new THREE.VideoTexture(mostazaVideo);
    videoTexture5.colorSpace = THREE.SRGBColorSpace;

    const videoMaterial5 = new THREE.MeshStandardMaterial({
        map: videoTexture5,
        emissive: 0xffffff,      
    emissiveMap: videoTexture5, 
    emissiveIntensity: 10
    });





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
    hologramaKiosco.material.emissiveIntensity = 500.0;
    hologramaKiosco.material.emissive.setHex(0xED5900);

    hologramaKiosco.material.transparent = true;
    hologramaKiosco.material.opacity = 0.01

    const tele1 = modelo.getObjectByName("pantalla_tele_1");
    tele1.children[1].material = videoMaterial
    videoTexture.center.set(0.5, 0.5);
    videoTexture.rotation = Math.PI / 2;
    videoTexture.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture.wrapT = THREE.ClampToEdgeWrapping;
    videoTexture.repeat.set(-2,2)
    videoTexture.offset.set(0.4, 0.6);

    const tele2 = modelo.getObjectByName("pantalla_tele_2")
    tele2.children[1].material = videoMaterial5
    videoTexture5.center.set(0.5, 0.5);
    videoTexture5.rotation = Math.PI / 2;
    videoTexture5.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture5.wrapT = THREE.ClampToEdgeWrapping;
    videoTexture5.repeat.set(-1.5,-1.5)
    videoTexture5.offset.set(0.3, -0.5);


    const tele3 = modelo.getObjectByName("pantalla_tele_3");
    tele3.children[1].material = videoMaterial3
    videoTexture3.center.set(0.5, 0.5);
    videoTexture3.rotation = Math.PI / 2;
    videoTexture3.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture3.wrapT = THREE.ClampToEdgeWrapping;
    videoTexture3.repeat.set(-1.5,1.5)
    videoTexture3.offset.set(0.3, 0.6);

    const pantallaBanelco = modelo.getObjectByName("pantalla");
    pantallaBanelco.children[1].material = videoMaterial4
    videoTexture4.center.set(0.5, 0.5);
    videoTexture4.rotation = Math.PI / 2;
    videoTexture4.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture4.wrapT = THREE.ClampToEdgeWrapping;
    videoTexture4.repeat.set(-0.8,0.8)
    videoTexture4.offset.set(0.0, 0);
    console.log(pantallaBanelco)
  
    const pantallaGrande = modelo.getObjectByName("pantalla_tele_grande");
    pantallaGrande.material.emissiveIntensity = 10
    pantallaGrande.material.emissive.setHex(0xF7EBC5);
    pantallaGrande.material = videoMaterial2
    videoTexture2.center.set(0.5, 0.5);
    videoTexture2.rotation = Math.PI / 2;
    videoTexture2.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture2.wrapT = THREE.ClampToEdgeWrapping;
    videoTexture2.repeat.set(-1,1)
    videoTexture2.offset.set(0, 0.23);
    console.log(pantallaGrande)

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
    bannerEternauta.position.set(30, 35, -32.5)

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