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
var FOV = 25,
	ASPECT = desiredRatio,
	NEAR = .1,
	FAR = 10000;

// room attributes
var ROOM_WIDTH = 160,
	ROOM_HEIGHT = 90,
	ROOM_DEPTH = 500,
	ROOM_OFFSET = (ROOM_HEIGHT / 2) / Math.tan((FOV / 2) * (Math.PI / 180)),
	ROOM_POS = -(ROOM_OFFSET + (ROOM_DEPTH / 2));

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer({
	antialias: true
});
var camera = new THREE.PerspectiveCamera(
	FOV,
	ASPECT,
	NEAR,
	FAR
);

var scene = new THREE.Scene();

// add the camera to the scene
scene.add(camera);
camera.position.z = 0;

// start the renderer
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMapEnabled = true;

var halfwidth = ROOM_WIDTH / 2,
	halfheight = ROOM_HEIGHT / 2,
	s2rWidth = ROOM_WIDTH / WIDTH,
	s2rHeight = ROOM_HEIGHT / HEIGHT,
	mouseX,
	mouseY;

// attach the render-supplied DOM element
window.addEventListener('load', function() {
	// get the DOM element to attach to
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);

	container.onmousemove = function(e) {
		mouseX = e.x;
		mouseY = e.y;
	}

}, false);

var wallMat = new THREE.MeshPhongMaterial({
	color: "rgb(32,32,64)",
	shininess: 256
});

var backMat = new THREE.MeshPhongMaterial({
	color: "rgb(0,0,8)",
	shininess: 256
});

var ballMat = new THREE.MeshPhongMaterial({
	color: "rgb(128,32,0)",
	shininess: 256
});

var walls = [];

walls[0] = new THREE.Mesh(
	new THREE.PlaneGeometry(
		ROOM_WIDTH,
		ROOM_DEPTH
	),
	wallMat
);

walls[1] = new THREE.Mesh(
	new THREE.PlaneGeometry(
		ROOM_WIDTH,
		ROOM_DEPTH
	),
	wallMat
);

walls[2] = new THREE.Mesh(
	new THREE.PlaneGeometry(
		ROOM_HEIGHT,
		ROOM_DEPTH
	),
	wallMat
);

walls[3] = new THREE.Mesh(
	new THREE.PlaneGeometry(
		ROOM_HEIGHT,
		ROOM_DEPTH
	),
	wallMat
);

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

walls[4] = new THREE.Mesh(
	new THREE.PlaneGeometry(
		ROOM_WIDTH,
		ROOM_HEIGHT
	),
	backMat
);

walls[4].position = new THREE.Vector3(0, 0, -(ROOM_OFFSET + ROOM_DEPTH));

// add the walls to the scene
for (var i = 0; i < 5; i++) {
	scene.add(walls[i]);
}

// create a point light
var pointLight1 = new THREE.PointLight(0xFFFFFF, 1);
var pointLight2 = new THREE.PointLight(0xFFFFFF, 1);
var pointLight3 = new THREE.PointLight(0xFFFFFF, 1);
var pointLight4 = new THREE.PointLight(0xFFFFFF, 1);

pointLight1.position.set(
	ROOM_WIDTH / 4,
	ROOM_HEIGHT / 4,
	(-ROOM_DEPTH / 5) - ROOM_OFFSET
);

pointLight2.position.set(
	-ROOM_WIDTH / 4,
	ROOM_HEIGHT / 4,
	2 * (-ROOM_DEPTH / 5) - ROOM_OFFSET
);

pointLight3.position.set(
	ROOM_WIDTH / 4,
	ROOM_HEIGHT / 4,
	3 * (-ROOM_DEPTH / 5) - ROOM_OFFSET
);

pointLight4.position.set(
	-ROOM_WIDTH / 4,
	ROOM_HEIGHT / 4,
	4 * (-ROOM_DEPTH / 5) - ROOM_OFFSET
);

// add to the scene
scene.add(pointLight1);
scene.add(pointLight2);
scene.add(pointLight3);
scene.add(pointLight4);

var ball = new THREE.Mesh(new THREE.SphereGeometry(
	5, 16, 12
), ballMat);

ball.position.set(0, 0, ROOM_POS);

scene.add(ball);

var PAD_WIDTH = ROOM_WIDTH / 5,
	PAD_HEIGHT = ROOM_HEIGHT / 5;

var padMat = new THREE.MeshBasicMaterial({
	color: "rgb(64,128,64)",
	transparent: true,
	opacity: 0.5
});

var pad = new THREE.Mesh(new THREE.PlaneGeometry(
	PAD_WIDTH,
	PAD_HEIGHT
), padMat);

pad.position.set(0, 0, -ROOM_OFFSET);

scene.add(pad);


var update = function() {
	pad.position.x = (mouseX * s2rWidth) - halfwidth;
	pad.position.y = -((mouseY * s2rHeight) - halfheight);
};

var render = function() {
	renderer.render(scene, camera);
}

var gameLoop = function() {

	update();

	render();
};

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


// usage:
// instead of setInterval(render, 16) ....

(function animloop(){
  requestAnimFrame(animloop);
  gameLoop();
})();