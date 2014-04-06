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
  var granularity = 200;
  var padding = 30;

  Object.keys(gameloop.objects).forEach(function(id) {
    var obj = gameloop.objects[id];
    var stripe;
 
    var stripes = Math.floor((obj.width+2*padding)/granularity) + 1;
    if(Math.floor(obj.p.x) < 0) {
      stripes++;
    }
    if(Math.floor(obj.p.x) % granularity > 0) {
      stripes++;
    }

    console.log('pipe: ' + id);
    console.log('pipe x: ' + obj.p.x);
    console.log('stripes: ' + stripes);

    for(var i=0;i < stripes; ++i) {
      stripe = Math.floor((obj.p.x-padding+i*granularity)/granularity);
      free[stripe] = false;
      console.log('stripe: ' + stripe);
    }
  });
  
  // find first free stripe
  var i = 0;
  while(i in free)
    i++;
  
  return Math.floor(i*granularity);
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
