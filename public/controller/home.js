angular.module('letsjs.controllers').controller('HomeController', function($scope, socket) {
  socket.on('state', function(state) {
    $scope.objects = state;
  });
  
  $scope.flap = function(id) {
    console.log('flap ' + id);
    socket.emit('flap', id);
  };
});
