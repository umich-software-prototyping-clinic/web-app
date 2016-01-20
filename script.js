// script.js

// create the module and name it scotchApp
var app = angular.module('app', []);

// create the controller and inject Angular's $scope
app
.controller('mainController', function($scope) {



  // create a message to display in our view
  $scope.message = 'Everyone come and see how good I look!';
})
.controller('login', ['$scope', function($scope){
   $scope.username = '';

   
}])
;
