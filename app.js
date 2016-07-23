var server = require('http').createServer(),
url = require('url'),
WebSocketServer = require('uws').Server,
wss = new WebSocketServer({ server: server }),
express = require('express'),
app = express(),
port = 3000,
connections = [],
gameState = [];

//express routing
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index.html');
});

//web socket server configuration
wss.on('connection', function connection(ws) {

  //console.log("Client Connected.");
  connections.push(ws); //add new connection to list

  ws.on('message', function incoming(message) {

	var updatedCube = JSON.parse(message);

	console.log(updatedCube.command);

	if(updatedCube.command == "init"){
	  gameState.push({"id" : updatedCube.id, "pos" : updatedCube.pos, "color" : updatedCube.color});

	} else if(updatedCube.command == "update"){
	  for(var i = 0; i < gameState.length; i++){
	  	if(gameState[i].id == updatedCube.id){
	  		gameState[i].pos = updatedCube.pos;
	  	}
	  }
	} 

	console.log(gameState);
	sendToAll(JSON.stringify(gameState)); //send new game state to all clients
  });
});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });

function sendToAll(message){
  for(var i = 0; i < connections.length; i++){
	connections[i].send(message);
  }
}