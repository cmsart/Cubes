var host = window.document.location.host.replace(/:.*/, '');
ws = new WebSocket('ws://' + host + ':3000');

//send new cube to the server, which updates the game state
ws.addEventListener('open', function(){
	cube = generateCube();
	cube.name = (Math.floor(Math.random()*100000)).toString();
	sendCubeData("init", cube.name, cube.position, cube.material.color);
	scene.add(cube);
});

ws.onmessage = function(e) {
	gameState = JSON.parse(e.data);
	setTimeout(updateState(gameState), 0, 20);
}

ws.onclose = function(e){
	//remove cube
}