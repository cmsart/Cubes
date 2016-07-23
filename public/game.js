scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

var gameState = [];
var cubeState = {};

//listens for arrow key presses and moves the cube
document.addEventListener('keydown', function(e) {
	if(e.keyCode == 40){
		cube.translateY(-0.2);
		sendCubeData("update", cube.name, cube.position, cube.material.color);
	} else if(e.keyCode == 38){
		cube.translateY(0.2);
		sendCubeData("update", cube.name, cube.position, cube.material.color);
	} else if(e.keyCode == 37){
		cube.translateX(-0.2);
		sendCubeData("update", cube.name, cube.position, cube.material.color);
	} else if(e.keyCode == 39){
		cube.translateX(0.2);
		sendCubeData("update", cube.name, cube.position, cube.material.color);
	}
});

function generateCube(){
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var randomColor = parseInt(Math.floor(Math.random()*16777215), 16); //get random hex value
	var material = new THREE.MeshBasicMaterial({ 
		color: randomColor
	});
	var cube = new THREE.Mesh( geometry, material );
	return cube;
}

function sendCubeData(command, name, position, color){
	cubeState = {"command": command, "id" : name, "pos" : position, "color" : color};
	ws.send(JSON.stringify(cubeState));
}

function updateState(gameState){
	for(var i = 0; i < gameState.length; i++){

		var state = gameState[i];

		var x = state.pos.x;
		var y = state.pos.y;
		var z = state.pos.z;

		var r = state.color.r;
		var g = state.color.g;
		var b = state.color.b;

		var objId = state.id.toString();

	    if(scene.getObjectByName(objId) == null){
	      var newCube = generateCube();
	      newCube.position.set(x, y, z);
	      newCube.name = objId;
	      newCube.material.color.setRGB(r, g, b);
	      scene.add(newCube);
	    } else if(objId != cube.name){
	      scene.getObjectByName(objId).position.set(x, y, z);
	    }
	}
}

function render() {
	requestAnimationFrame( render );
	renderer.render(scene, camera);
}