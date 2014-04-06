angular.module('letsjs.controllers').controller('HomeController', function($scope, $interval, socket) {
  socket.on('state', function(state) {
    $scope.objects = state;
    socket.emit('state');
  });

  socket.on('die', function() {
    $scope.leaveGame();
  });

  $scope.playerid = socket.id;
  $scope.state = 0;  
  
  $scope.offline = 0;
  socket.on('disconnect', function() {
    $scope.offline = 1;
  });
  socket.on('connect', function() {
    $scope.offline = 0;
  });

  $scope.flap = function(id) {
    socket.emit('flap', id);
  };

  $scope.setupPlayer = function(nick) {
    socket.emit('join', { nick: nick });
    $scope.state=1;
    tStart = new Date().getTime();
    updateScoreInterval = $interval(updateScore, 200);
  }

  $scope.leaveGame = function() {
    socket.emit('leave');
    $scope.state=0;
    $interval.cancel(updateScoreInterval);
  }

  var t0 = new Date().getTime();
  var tStart = new Date().getTime();

  var myInterval = $interval(extrapolate, 25);

  $scope.$on("$destroy", function(){
    $interval.cancel(myInterval);
    $interval.cancel(updateScoreInterval);

    if($scope.state == 1) {
      socket.emit('leave');
    }
  });

  function extrapolate() {
    if ($scope.offline)
      return; // don't extrapolate during offline time
    var current = new Date().getTime(); // get current time
    var t = (current - t0) / 1000.0; // calculate time passed since last execution (in seconds)
    t0 = current; // save current time for next execution
    Object.keys($scope.objects || {}).forEach(function(id) {
      newton(t,$scope.objects[id]);
    });
  };
  
  var updateScoreInterval;
  function updateScore() {
    $scope.score = Math.round((new Date().getTime() - tStart) / 1000, 1);
  }

  function newton(t, obj) {
    var coords = ['x', 'y'];
    coords.forEach(function(coord) {
      // update position
      obj.p[coord] += Math.round(obj.v[coord] * t * 100)/100;    
      // update velocity
      obj.v[coord] += Math.round(obj.a[coord] * t * 100)/100;
    });
  }
});
