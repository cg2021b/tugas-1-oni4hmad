import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "./node_modules/three/examples/jsm/libs/dat.gui.module.js";

// addLight
let addLight = function () {
    // AmbientLight
    ambientLight = new THREE.AmbientLight(0xffffff, .25);
    scene.add(ambientLight);
    // DirectionalLight
    directionalLight = new THREE.PointLight(0xffffff, 1.0);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;

    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 512; // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5; // default
    directionalLight.shadow.camera.far = 500; // default

    scene.add(directionalLight);
}

// addGUI
let addGUI = function () {
    // camera gui
    gui = new dat.GUI();
    guiFolder = gui.addFolder('Camera');
    guiFolder.add(camera.position, 'x', -1000, 1000);
    guiFolder.add(camera.position, 'y', -1000, 1000);
    guiFolder.add(camera.position, 'z', -1000, 1000);

    // ambient light gui
    guiFolder1 = gui.addFolder('Ambient Light');
    guiFolder1.add(ambientLight, 'intensity', 0, 2);

    // directional light gui
    guiFolder2 = gui.addFolder('Directional Light');
    guiFolder2.add(directionalLight.position, 'x', -500, 500);
    guiFolder2.add(directionalLight.position, 'y', -500, 500);
    guiFolder2.add(directionalLight.position, 'z', -500, 500);
    guiFolder2.add(directionalLight, 'intensity', 0, 2);

    // directional light helper   
    lightHelp = new THREE.DirectionalLightHelper(directionalLight, 20);
    scene.add(lightHelp);
}

// create geometry object
let createObject = function () {
    const geometry = new THREE.BoxGeometry( 30, 32, 30 );
    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshPhongMaterial({
        // color: 0xffff00
        map: loader.load("./textures/wall.jpg")
    });
    const geoMesh = new THREE.Mesh( geometry, material );
    geoMesh.castShadow = true;
    geoMesh.receiveShadow = true;
    return geoMesh;
}

// create Box Plane
let createBoxPlane = function () {
    const geometry = new THREE.BoxGeometry( 300, 300, 5 );
    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshPhongMaterial({
        // color: 0xffff00
        map: loader.load("./textures/blue_floor_tiles_01_diff_4k.jpg")
    });
    const boxMesh = new THREE.Mesh( geometry, material );
    boxMesh.rotation.x = Math.PI * -.5;
    boxMesh.position.y = -35;
    boxMesh.receiveShadow = true;
    scene.add(boxMesh);
}

// reflective sphere 
let createReflectiveSphere = function () {
    // Reflective Sphere
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter 
    });
    sphereCamera = new THREE.CubeCamera(1, 100, cubeRenderTarget);
    sphereCamera.position.set(50, 0, 0);
    scene.add(sphereCamera);
    const sphereMirror = new THREE.MeshBasicMaterial({
        envMap: sphereCamera.renderTarget.texture,
    });
    const sphereGeo = new THREE.SphereGeometry(15, 32 , 16);
    const mirrorBall = new THREE.Mesh( sphereGeo, sphereMirror);
    mirrorBall.position.x = 50;
    scene.add(mirrorBall);
}

// variabel
let scene, camera, renderer, controls;
let sphere, sphereCamera;
let gui, guiFolder, guiFolder1, guiFolder2;
let ambientLight, directionalLight;
let lightHelp;


let init = function () {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.y = 50;
    camera.position.z = 125;

    // Renderer
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Resize Event
    window.addEventListener('resize', () =>
    {
        // Update camera
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        // Update renderer
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    })

    // -----------------------------------

    // Object (Geometry)
    sphere = createObject();
    scene.add(sphere);
    createBoxPlane();

    // Light
    addLight();

    // Panorama
    const panorama = new THREE.CubeTextureLoader();
    const textureCube = panorama.load([
        'panorama/px.png',
        'panorama/nx.png',
        'panorama/py.png',
        'panorama/ny.png',
        'panorama/pz.png',
        'panorama/nz.png'
    ]);
    scene.background = textureCube;

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1;
    controls.maxDistance = 1000;
    
    // Fog
    let near = 50;
    let far = 300;
    scene.fog = new THREE.Fog('lightblue', near, far);

    // reflective sphere
    createReflectiveSphere();

    // model loader: potted plant
    const loader = new GLTFLoader()
    loader.load('./gltf/potted_plant_02_4k.gltf', function(gltf){
        const root = gltf.scene;
        root.scale.x = 50;
        root.scale.y = 50;
        root.scale.z = 50;
        root.position.x = -50;
        root.position.y = -20;
        scene.add(root);
        
        root.traverse(n => { if ( n.isMesh ) {
            n.castShadow = true; 
            n.receiveShadow = true;
        }});
    })
    
    // Add GUI
    // addGUI();
}

// Render loop
const animate = function() {
    requestAnimationFrame(animate);

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    controls.update();
    sphereCamera.update(renderer, scene);
    renderer.render(scene, camera);
}

init();
animate();