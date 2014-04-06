/**
 * The gameloop
 */

var players = require('./player');

/**
 * Board Variables
 */
var width = 1600;
var height = 800;
var pipewidth = 100;
var pipecolor = 'purple';
var pipespeed = 100;


/**
 * Gamestate variables
 */
var lastpipeid = 0;
var lastpipeadded; // initialized to undefined.
                   // we need this to know when to add the next pipe
var difficulty = 12;

/**
 * Last time the game loop was executed
 */
var t0 = new Date().getTime();

/**
 * The game objects
 */
var objects = {
};

/**
 * The gameloop callbacks, to be called after each loop
 */
var callbacks = [];

/**
 * Add pipe to board with random hole position, hole size based
 * on current difficulty.
 */
function addpipecolumn() {
  var pipeid = 'pipe' + lastpipeid;
  var holesize = height-(height/15)*difficulty;
  var holelocation = Math.floor(Math.random()*(height-holesize));
  ++lastpipeid;
  objects[pipeid+'top'] =
    {
      p: {x: width, y:0},
      v: {x: -pipespeed, y: 0},
      a: {x: 0, y: 0},
      width: pipewidth,
      height: holelocation,
      color: pipecolor,
    };
  objects[pipeid+'bot'] =
    {
      p: {x: width, y:(holelocation+holesize)},
      v: {x: -pipespeed, y: 0},
      a: {x: 0, y: 0},
      width: pipewidth,
      height: height-(holelocation+holesize),
      color: pipecolor,
    };
  lastpipeadded = objects[pipeid+'top'];
}

/**
 * The actual game loop.
 */
function loop() {
  // do the time bussiness
  var current = new Date().getTime(); // get current time
  var t = (current - t0) / 1000.0; // calculate time passed since last execution (in seconds)
  t0 = current; // save current time for next execution
  if(lastpipeadded == null || lastpipeadded.p['x'] < width-(width/2)) {
    addpipecolumn();
  }
  // update object positions
  Object.keys(objects).forEach(function(id) { newton(t, objects[id]); });
  Object.keys(objects).forEach(function(id) { checkCollision(id, objects[id]); });
}

/**
 * Update position and velocity of a object based on Newton's laws
 */
function newton(t, obj) {
  var coords = ['x', 'y'];
  coords.forEach(function(coord) {
    // update position
    obj.p[coord] += obj.v[coord] * t;    
    // update velocity
    obj.v[coord] += obj.a[coord] * t;
  });
};

/**
 * Checks the object for collisions
 */
function checkCollision(id, obj) {
  var bounds = {x: width, y: height};

  // check lower bound
  if ('player' in obj && obj.p.y > bounds.y) {
    obj.player.die();
  }
  
  // check all other objects
  Object.keys(objects).forEach(function(id) {
    var o = objects[id];
    if (o===obj)
      return;
    if ( (  (obj.p.x <= o.p.x && o.p.x <= obj.p.x + obj.width)
         || (obj.p.x <= o.p.x + o.width && o.p.x + o.width <= obj.p.x + obj.width) )
       &&(  (obj.p.y <= o.p.y && o.p.y <= obj.p.y + obj.height)
         || (obj.p.y <= o.p.y + o.height && o.p.y + o.height <= obj.p.y + obj.height) ) ) {
      if ('player' in o)
        o.player.die();
      if ('player' in obj)
        obj.player.die();
    }
  });
}

/**
 * Start executing the game loop at a certain interval.
 */
function start() {
  var task_is_running = false;
  setInterval(function(){
    if(!task_is_running){
      task_is_running = true;
      loop();
      callbacks.forEach(function(cb) { cb() });
      task_is_running = false;
    }
  }, 100);
}

/**
 * The public gameloop object
 */
var gameloop = {
  loop: loop,
  start: start,
  objects: objects,
  callbacks: callbacks,
};

// expose gameloop object
module.exports = gameloop;

