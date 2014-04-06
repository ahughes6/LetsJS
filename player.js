var playerlist = {};
var gameloop = require('./gameloop');
var playersize = 40;

function add(socket, nick, die) {
  var x = fitNewPlayerIn();
  playerlist[socket.id] = 
    {
      id: socket.id,
      nick: nick,
      die: die,
    };
  gameloop.objects[socket.id] =
    {
      p: {x: x, y:20},
      v: {x: 0, y: 0},
      a: {x: 0, y: 1000},
      width: playersize,
      height: playersize,
      color: 'white',
      player: playerlist[socket.id],
    };
}

function remove(socket) {
  delete playerlist[socket.id];
  delete gameloop.objects[socket.id];
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

/**
 * This function examines the x-positions of all
 * existing players and returns the first player-free
 * 180px-width stripe of the game where there is no
 * player.
 */
function fitNewPlayerIn() {
  // create list of all occupied stripes
  var free = {};
  Object.keys(playerlist).forEach(function(id) {
    var p = gameloop.objects[id];
    var stripe = Math.floor((p.p.x-100)/180);
    free[stripe] = false;
  });
  
  // find first free stripe
  var i = 0;
  while(i in free)
    i++;
  
  return i*180+100;
}

var players = {
  add: add,
  remove: remove,
  getList: getList,
  getPlayer: getPlayer,
}

module.exports = players;
