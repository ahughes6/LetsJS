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
      start: new Date().getTime(),
      score: 0,
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
    ret.push(
      {
        id: id,
        nick: playerlist[id].nick,
        score: playerlist[id].score,
      }
    );
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
  var granularity = 50;
  var padding = 20;

  Object.keys(gameloop.objects).forEach(function(id) {
    var obj = gameloop.objects[id];
    var stripe;
 
    var stripes = Math.floor((obj.width+2*padding)/granularity) + 1;
    if(Math.floor(obj.p.x) % granularity > 0) {
      stripes++;
    }

    for(var i=0;i < stripes; ++i) {
      stripe = Math.floor((obj.p.x-padding+i*granularity)/granularity);
      if(stripe >= 0) {
        free[stripe] = false;
      }
    }
  });
  
  // find first free stripe
  var i = 0;
  var noFreeFound = true;
  while(noFreeFound) {
    while(i in free) {
      i++;
    }
    if(i == 0) {
      if(i+1 in free) {
        i+=2;
      }
      else {
        padding = 20;
        noFreeFound = false;
      }
    }
    else {
      padding = 0;
      noFreeFound = false;
    }
  }
  return Math.floor(i*granularity+padding);
}

function updateScores() {
    Object.keys(playerlist).forEach(function(id) { 
      playerlist[id].score = current - playerlist[id].start;
    });
}

var players = {
  add: add,
  remove: remove,
  getList: getList,
  getPlayer: getPlayer,
  updateScores: updateScores,
}

module.exports = players;
