var playerlist = [];
var gameloop = require('./gameloop');

function add(socket, nick) {
  playerlist.push({
    socket: socket,
    nick: nick,
  });
  gameloop.objects.push(
    {
      p: {x: 0, y: 0},
      v: {x: 0, y:10},
      a: {x: 0, y: 0},
      player: nick,
    }
  );
}

function remove(socket) {
  var toBeRemoved = null;
  var nick = null;
  playerlist.forEach(function(p) {
    if (p.socket===socket)
      toBeRemoved = p;
  });
  if (toBeRemoved) {
    playerlist.splice(playerlist.indexOf(toBeRemoved), 1);
    gameloop.objects.forEach(function(o) {
      if (o.nick==nick) {
        toBeRemoved = o;
      }
    });
    if (toBeRemoved)
      gameloop.objects.splice(toBeRemoved, 1);
  }
}

function die(player) {
  console.log("a player died");
}

function getList() {
  var ret = [];
  playerlist.forEach(function(p) {
    ret.push({nick: p.nick});
  });
  return ret;
}

var players = {
  add: add,
  remove: remove,
  die: die,
  getList: getList,
}

module.exports = players;
