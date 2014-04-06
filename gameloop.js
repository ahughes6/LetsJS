/**
 * The gameloop
 */

var players = require('./player');

/**
 * Last time the game loop was executed
 */
var t0 = new Date().getTime();

/**
 * The game objects
 */
var objects = {};

/**
 * The gameloop callbacks, to be called after each loop
 */
var callbacks = [];

/**
 * The actual game loop.
 */
function loop() {
  // do the time bussiness
  var current = new Date().getTime(); // get current time
  var t = (current - t0) / 1000.0; // calculate time passed since last execution (in seconds)
  t0 = current; // save current time for next execution
  
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
  var bounds = {x: 600, y: 500};
  // check lower bound
  if (obj.p.y > bounds.y) {
    obj.player.die();
  }
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

