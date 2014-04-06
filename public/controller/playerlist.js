angular.module('letsjs.controllers').controller('PlayerListController', function($scope, socket) {
  socket.on('players', function(players) {
    $scope.players = players;
  });
});
