var playerlist = {};
var gameloop = require('./gameloop');

function add(socket, nick) {
  playerlist[socket.id] = 
    {
      socket: socket,
      nick: nick,
    };
  gameloop.objects[socket.id] =
    {
      p: {x: 0, y: 0},
      v: {x: 0, y:10},
      a: {x: 0, y: 0},
      player: nick,
    };
}

function remove(socket) {
  delete playerlist[socket.id];
  delete gameloop.objects[socket.id];
}

function die(player) {
  console.log("a player died");
}

function getList() {
  var ret = [];
  Object.keys(playerlist).forEach(function(id) {
    ret.push({id: id, nick: playerlist[id].nick});
  });
  return ret;
}

function getPlayer(id) {
  return playerlist[id];
}

var players = {
  add: add,
  remove: remove,
  die: die,
  getList: getList,
}

module.exports = players;
