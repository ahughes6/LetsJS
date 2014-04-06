var playerlist = [];

function add(socket, nick) {
  playerlist.push({
    socket: socket,
    nick: nick,
  });
}

function remove(socket) {
  var toBeRemoved = null;
  playerlist.forEach(function(p) {
    if (p.socket===socket)
      toBeRemoved = p;
  });
  if (toBeRemoved)
    playerlist.splice(playerlist.indexOf(toBeRemoved), 1);
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
