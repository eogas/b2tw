// set the scene size
var WIDTH,
	HEIGHT,
	clientWidth = document.documentElement.clientWidth,
	clientHeight = document.documentElement.clientHeight,
	viewportRatio = clientWidth / clientHeight,
	desiredRatio = 16 / 9;

if (viewportRatio > desiredRatio) {
	HEIGHT = clientHeight;
	WIDTH = HEIGHT * desiredRatio;
} else {
	WIDTH = clientWidth;
	HEIGHT = WIDTH / desiredRatio;
}


// set some camera attributes
var FOV = 20,
	ASPECT = desiredRatio,
	NEAR = 10,
	FAR = 10000;

// room attributes
var ROOM_WIDTH = 160,
	ROOM_HEIGHT = 90,
	ROOM_DEPTH = 1000,
	ROOM_OFFSET = (ROOM_HEIGHT / 2) * Math.atan(FOV / 2),
	ROOM_POS = -ROOM_OFFSET - (ROOM_DEPTH / 2);

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(
	FOV,
	ASPECT,
	NEAR,
	FAR
);

var scene = new THREE.Scene();

// add the camera to the scene
scene.add(camera);

// the camera starts at 0,0,0
// so pull it back
camera.position.z = 0;

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element
window.addEventListener('load', function() {
	// get the DOM element to attach to
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);
}, false);

var mats = [];

// create walls
var walls = [];
for (var i = 0; i < 4; i++) {

	// temporary color generation
	mats[i] = new THREE.MeshLambertMaterial({
		color: "rgb(" + ((i + 1) * 64) + ",32,128)"
	});

	walls[i] = new THREE.Mesh(
		new THREE.PlaneGeometry(
			ROOM_WIDTH,
			ROOM_DEPTH
		),
		mats[i]
	);
}

walls[0].rotation.x -= Math.PI / 2;
walls[0].position = new THREE.Vector3(0, -(ROOM_HEIGHT / 2), ROOM_POS);

walls[1].rotation.x += Math.PI / 2;
walls[1].position = new THREE.Vector3(0, (ROOM_HEIGHT / 2), ROOM_POS);

walls[2].rotation.y -= Math.PI / 2;
walls[2].rotation.z -= Math.PI / 2;
walls[2].position = new THREE.Vector3(ROOM_WIDTH / 2, 0, ROOM_POS);

walls[3].rotation.y += Math.PI / 2;
walls[3].rotation.z -= Math.PI / 2;
walls[3].position = new THREE.Vector3(-ROOM_WIDTH / 2, 0, ROOM_POS);

// add the walls to the scene
for (var i = 0; i < 4; i++) {
	scene.add(walls[i]);
}

// create a point light
var pointLight = new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 0;
pointLight.position.y = 0;
pointLight.position.z = 32;

// add to the scene
scene.add(pointLight);

// draw!
renderer.render(scene, camera);
