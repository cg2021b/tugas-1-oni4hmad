// import * as THREE from 'three'
// import * as OrbitControls from './js/OrbitControls.js'

// Get Random Number
function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

// Create Sphere (Bola)
let createSphere = function (x, y, z, size) {
    let geometry = new THREE.SphereGeometry(size, size, size);
    let thisColor = color[Math.round(getRandomBetween(0, color.length-1))];
    let material = new THREE.MeshPhysicalMaterial({
        color: thisColor,
        roughness: 0,
        metalness: .1,
        reflectivity: 1
    });
    let sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    return sphere;
}

let createRandomSphere = function (amount, minPosition, maxPosition) {
    let sphereSize = 15;
    let tempSpheres = []
    for(let i = 0; i < amount; i++) {
        let x = getRandomBetween(minPosition, maxPosition);
        let y = getRandomBetween(minPosition, maxPosition);
        let z = getRandomBetween(minPosition, maxPosition);
        tempSpheres.push(createSphere(x, y, z, sphereSize));
    }
    tempSpheres.forEach(obj => {
        scene.add(obj);
    });
    spheres.push(...tempSpheres);
}

// Event Handler
let onMouseClick = function(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    mouse.z = camera.position.z;
    
    rayCast.setFromCamera(mouse, camera);

    // update raycaster intersects
    let intersects = rayCast.intersectObjects(scene.children);
    for (let obj of intersects) {
        if (clickedObj.includes(obj.object)){
            obj.object.material.emissive.set(0x0);
            index = clickedObj.indexOf(obj.object);
            if (index > -1) clickedObj.splice(obj.object, 1);
            break;
        } else {
            obj.object.material.emissive.set(0x3a3a3a);
            clickedObj.push(obj.object);
            break;
        }
    }

    // console.log(clickedObj);

    if (clickedObj.length == 2) {
        let color1 = clickedObj[0].material.color;
        let color2 = clickedObj[1].material.color
        if (color1.getHex() === color2.getHex()) {
            // remove from sphere[], scene, dispose, renderer
            clickedObj.forEach(obj => {
                index = spheres.indexOf(obj);
                if (index > -1) spheres.splice(obj, 1);
                scene.remove(obj);
                obj.geometry.dispose();
                obj.material.dispose();
                renderer.renderLists.dispose();
            });
            // clear clickedObj
            clickedObj = [];
            // add score
            addScore(200);
        } else {
            clickedObj[0].material.emissive.set(0x0);
            clickedObj[1].material.emissive.set(0x0);
            clickedObj = [];
        }
    }
};

// addLight
let addLight = function () {
    // AmbientLight
    ambientLight = new THREE.AmbientLight(0xffffff, .75);
    scene.add(ambientLight);
    // DirectionalLight
    directionalLight = new THREE.DirectionalLight(0xffffff, .50);
    directionalLight.position.set(100, 100, 225);
    scene.add(directionalLight);
}

// addGUI
let addGUI = function () {
    // camera gui
    gui = new dat.gui.GUI();
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

// addScore
let addScore = function (points) {
    score += points;
    document.getElementById("score").innerHTML = score;
}

// variabel
let scene, camera, renderer, controls;
let spheres = [];
let gui, guiFolder, guiFolder1, guiFolder2;
let rayCast;
let ambientLight, directionalLight;
let lightHelp;
let color = [0xf54242, 0xe3f542, 0x42f554, 0x42d1f5, 0xf542dd];
let clickedObj = [];
let score = 0;


let init = function () {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 250;

    // Renderer
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Object (Geometry)
    let sphereAmount = 10;
    let range = 100;
    createRandomSphere(sphereAmount, -range, range);

    // Light
    addLight();
    
    // Raycaster
    rayCast = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    mouse.x = mouse.y = -1;

    // Event Listener
    document.addEventListener("click", onMouseClick, false);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1;
    controls.maxDistance = 1000;
    
    // Add GUI
    // addGUI();

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
}

// Timer
const clock = new THREE.Clock();
clock.start();

let addNewEvery = 5;
let maxSpheres = 30;

// Render loop
const animate = function() {
    requestAnimationFrame(animate);

    let elapsedTime = clock.getElapsedTime();
    if (elapsedTime > addNewEvery && spheres.length < maxSpheres) {
        let sphereAmount = 4;
        let range = 100;
        createRandomSphere(sphereAmount, -range, range);
        clock.start();
        if (addNewEvery > 1) {
            addNewEvery -= 1;
        }
    }

    // rotate all sphere
    spheres.forEach(obj => {
        obj.rotation.x += 0.02;
        obj.rotation.y += 0.02;
    });

    controls.update();
    renderer.render(scene, camera);
}


init();
animate();