// Declare app level module which depends on filters, and services
angular.module('letsjs.controllers',[]);
angular.module('letsjs.services',[]);
angular.module('letsjs', ['ngRoute', 'letsjs.controllers', 'letsjs.services']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: 'HomeController'
      }).
      when('/client', {
        templateUrl: 'partials/index',
        controller: 'ClientController'
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(false);
  }]);

