angular.module('letsjs.controllers',[]).controller('HomeController', function($scope, socket) {
  socket.on('state', function(state) {
    $scope.objects = state;
  });
});
