// Debug
const gui = new dat.gui.GUI();

// scene, camera, and renderer
let scene, camera, renderer;

// geometry mesh
let cube, torus, torusKnot;
let sphere, cone, ring;
let cylinder, icosahedron, octahedron;

// light
let pointLight, spotLight, directionalLight;
let hemisphereLight, ambientLight;

// light type enum
const lightType = Object.freeze ({
    pointLight: 0,
    spotLight: 1,
    directionalLight: 2,
    hemisphereLight: 3,
    ambientLight: 4
});

// movement speed
let add = 0.01;

let createCube = function () {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    const wireframe = new THREE.WireframeGeometry( geometry );
    cube = new THREE.LineSegments( wireframe );
    cube.material.depthTest = false;
    cube.material.opacity = 1;
    cube.material.transparent = true;
    cube.position.x = -3;
    cube.position.y = 2.5;
    scene.add(cube);
};

let createTorus = function () {
    // object: TorusGeometry
    let geometry = new THREE.TorusGeometry(.7, .2, 16, 100);

    // material: MeshPhysicalMaterial
    let material = new THREE.MeshPhysicalMaterial({
        color: 0x00a1cb,
        roughness: 0,
        metalness: .1,
        reflectivity: 1
    });
    torus = new THREE.Mesh(geometry, material);
    torus.position.x = 0;
    torus.position.y = 2.5;
    scene.add(torus);
};

let createTorusKnot = function () {
    // object: TorusKnotGeometry
    let geometry = new THREE.TorusKnotGeometry(.5, .15, 60, 10, 2, 3);

    // material: MeshPhysicalMaterial
    let material = new THREE.MeshToonMaterial({
        color: 0x00a1cb
    });
    torusKnot = new THREE.Mesh(geometry, material);
    torusKnot.position.x = 3;
    torusKnot.position.y = 2.5;
    scene.add(torusKnot);
};

let createSphere = function () {
    // object: SphereGeometry
    let geometry = new THREE.SphereGeometry(.5, 64, 64);

    // material: MeshPhongMaterial
    let material = new THREE.MeshPhongMaterial({
        shininess: 100,
        color: 0x00a1cb
    });
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = -3;
    sphere.position.y = 0;
    scene.add(sphere);
};

let createCone = function () {
    let geometry = new THREE.ConeGeometry(.5, 1, 5);
    const wireframe = new THREE.WireframeGeometry( geometry );
    cone = new THREE.LineSegments( wireframe );
    cone.material.depthTest = false;
    cone.material.opacity = 1;
    cone.material.transparent = true;
    cone.position.x = 0;
    cone.position.y = 0;
    scene.add(cone);
};

let createRing = function () {
    // object: RingGeometry
    let geometry = new THREE.RingGeometry(.5, 1, 5, 1, 0, 5);

    // material: MeshBasicMaterial
    let material = new THREE.MeshBasicMaterial({
        color: 0x00a1cb
    });
    ring = new THREE.Mesh(geometry, material);
    ring.position.x = 3;
    ring.position.y = 0;
    scene.add(ring);
};

let createCylinder = function () {
    // object: CylinderGeometry
    let geometry = new THREE.CylinderGeometry(.5, 1, 1);

    // material: MeshNormalMaterial
    let material = new THREE.MeshNormalMaterial();
    cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.x = -3;
    cylinder.position.y = -2.5;
    scene.add(cylinder);
};

let createIcosahedron = function () {
    // object: IcosahedronGeometry
    let geometry = new THREE.IcosahedronGeometry(.5, 0);
    
    // material: MeshDepthMaterial
    let material = new THREE.MeshDepthMaterial();
    icosahedron = new THREE.Mesh(geometry, material);
    icosahedron.position.x = 0;
    icosahedron.position.y = -2.5;
    scene.add(icosahedron);
};

let createOctahedron = function () {
    let geometry = new THREE.OctahedronGeometry(.5, 0);
    const wireframe = new THREE.WireframeGeometry( geometry );
    octahedron = new THREE.LineSegments( wireframe );
    octahedron.material.depthTest = false;
    octahedron.material.opacity = 1;
    octahedron.material.transparent = true;
    octahedron.position.x = 3;
    octahedron.position.y = -2.5;
    scene.add(octahedron);
};

// do rotation
let rotate = function (mesh, speed) {
    mesh.rotation.x += speed;
    mesh.rotation.y += speed;
    mesh.rotation.z += speed;
};

// do light helper
let lightHelper = function (light) {
    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);
}

let showLight = function (type, x = null, y = null, z = null) {
    switch(type) {
        case lightType.pointLight:
            // light: pointLight
            const pointLight = new THREE.PointLight(0xffffff, .75);
            pointLight.position.x = x ?? 0;
            pointLight.position.y = y ?? 2.5;
            pointLight.position.z = z ?? 1;
            scene.add(pointLight);
            lightHelper(pointLight);
            // add gui
            const folder1 = gui.addFolder('Point Light');
            folder1.add(pointLight.position, 'x', -10, 10);
            folder1.add(pointLight.position, 'y', -10, 10);
            folder1.add(pointLight.position, 'z', -10, 10);
            folder1.add(pointLight, 'intensity', 0, 2);
            break;
        case lightType.spotLight:
            // light: Spotlight
            const spotLight = new THREE.SpotLight(0xffffff, .75);
            spotLight.position.x = x ?? 3;
            spotLight.position.y = y ?? 2.5;
            spotLight.position.z = z ?? 1;
            scene.add(spotLight);
            lightHelper(spotLight);
            // add gui
            const folder2 = gui.addFolder('Spot Light');
            folder2.add(spotLight.position, 'x', -10, 10);
            folder2.add(spotLight.position, 'y', -10, 10);
            folder2.add(spotLight.position, 'z', -10, 10);
            folder2.add(spotLight, 'intensity', 0, 2);
            break;
        case lightType.directionalLight:
            // light: DirectionalLight
            const directionalLight = new THREE.DirectionalLight(0xffffff, .75);
            directionalLight.position.x = x ?? -3;
            directionalLight.position.y = y ?? 0;
            directionalLight.position.z = z ?? 1;
            scene.add(directionalLight);
            lightHelper(directionalLight);
            // add gui
            const folder3 = gui.addFolder('Directional Light');
            folder3.add(directionalLight.position, 'x', -10, 10);
            folder3.add(directionalLight.position, 'y', -10, 10);
            folder3.add(directionalLight.position, 'z', -10, 10);
            folder3.add(directionalLight, 'intensity', 0, 2);
            break;
        case lightType.hemisphereLight:
            // light: HemisphereLight
            const hemisphereLight = new THREE.HemisphereLight(0xffffff, .75);
            hemisphereLight.position.x = x ?? 3;
            hemisphereLight.position.y = y ?? 0;
            hemisphereLight.position.z = z ?? 1;
            scene.add(hemisphereLight);
            lightHelper(hemisphereLight);
            // add gui
            const folder4 = gui.addFolder('Hemisphere Light');
            folder4.add(hemisphereLight.position, 'x', -10, 10);
            folder4.add(hemisphereLight.position, 'y', -10, 10);
            folder4.add(hemisphereLight.position, 'z', -10, 10);
            folder4.add(hemisphereLight, 'intensity', 0, 2);
            break;
        case lightType.ambientLight:
            // light: AmbientLight
            const ambientLight = new THREE.AmbientLight(0xffffff, .75);
            ambientLight.position.x = x ?? -3;
            ambientLight.position.y = y ?? -2.5;
            ambientLight.position.z = z ?? 1;
            scene.add(ambientLight);
            lightHelper(ambientLight);
            // add gui
            const folder5 = gui.addFolder('Ambient Light');
            folder5.add(ambientLight.position, 'x', -10, 10);
            folder5.add(ambientLight.position, 'y', -10, 10);
            folder5.add(ambientLight.position, 'z', -10, 10);
            folder5.add(ambientLight, 'intensity', 0, 2);
            break;
    };
}

// set up the environment - 
// initiallize scene, camera, objects and renderer
let init = function () {
    // 1. create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xababab);

    // 2. create an locate the camera       
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 5;

    // 3. create an locate the object on the scene
    createCube();
    createTorus();
    createTorusKnot();
    createSphere();
    createCone();
    createRing();
    createCylinder();
    createIcosahedron();
    createOctahedron();

    // 3.1 show light
    showLight(lightType.pointLight);
    showLight(lightType.spotLight);
    showLight(lightType.directionalLight);
    showLight(lightType.hemisphereLight);
    showLight(lightType.ambientLight);

    // 4. create the renderer     
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
};

// main animation loop - calls 50-60 in a second.
let mainLoop = function () {
    rotate(cube, add);
    rotate(torus, add);
    rotate(torusKnot, add);
    rotate(sphere, add);
    rotate(cone, add);
    rotate(ring, add);
    rotate(cylinder, add);
    rotate(icosahedron, add);
    rotate(octahedron, add);

    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
};

init();
mainLoop();