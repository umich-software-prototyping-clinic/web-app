// script.js

// create the module and name it app
var app = angular.module('app', ['keys']);

// create the controller and inject Angular's $scope
app
.controller('main', ['$scope', '$rootScope', 'ParseSvc', function($scope, $rootScope, ParseSvc){
   $scope.username = ParseSvc.getUsername();
}])
.controller('userlist', ['$scope', 'ParseSvc', function($scope, ParseSvc){
  $scope.users = [
    {
      username: 'one'
    }, 
    {
      username: 'two'
    }, 
    {
      username: 'three'
    }, 
    {
      username: 'four'
    }, 
    {
      username: 'five'
    } 
  ];
}])
.controller('login', ['$scope', '$rootScope','ParseSvc', function($scope, $rootScope, ParseSvc){
   $scope.user = {
      username: null,
      password: null,
   };
   if(ParseSvc.isRegistered) {
      $rootScope.username = ParseSvc.getUsername();
  }
   $scope.login = function () {
      ParseSvc.login($scope.user)
   }
   
}])
.controller('signUp', ['$scope','$rootScope','ParseSvc', function($scope, $rootScope, ParseSvc){
   $scope.user = {
      username: null,
      password: null,
      email: null,
      firstName: null,
      lastName: null
   };
   if(ParseSvc.isRegistered) {
      $rootScope.username = ParseSvc.getUsername();
   }
   $scope.signUp = function () {
      ParseSvc.signUp($scope.user)
   }
   
}])
.controller('reset', ['$scope','ParseSvc', function($scope, ParseSvc){
   $scope.email = null;
   $scope.resetPassword = function () {
      ParseSvc.resetPassword()
   }
   
}])
.controller('logout', ['$scope','ParseSvc', function($scope, ParseSvc){
   $scope.logout = function () {
      ParseSvc.logout()
   }
   
}])
.factory('ParseSvc', ['$http', 'KeySvc', function($http, KeySvc) {

   key1 = KeySvc.key1;
   key2 = KeySvc.key2;
   Parse.initialize(key1, key2);
   var isRegistered;

   var user = Parse.User.current();
   if (user) {
      isRegistered = true;
      // do stuff with the user
   } else {
     isRegistered = false;
     user = new Parse.User();
  }

   return {
   isRegistered: isRegistered,
   getUsername: function() {
      return user.get('username');
   },
   login: function(_user) {
      Parse.User.logIn(_user.username, _user.password, {
         success: function(_user) {
            user = _user;
            console.log(user.get('username'));
            // Do stuff after successful login.
            alert('Logged in as ' + user.get('username'));
         },
         error: function(user, error) {
            // The login failed. Check error to see why
            console.log("Error: " + error.code + " " + error.message);
            alert('Login failed');
         }
      });
   },
   signUp: function(_user) {
      user.set("username", _user.username.toLowerCase());
      user.set("email", _user.email);
      user.set("password", _user.password);
      user.set("firstName", _user.firstName);
      user.set("lastName", _user.lastName);
      user.signUp(null, {
         success: function(user) {
            // Hooray! Let them use the app now.
            alert('Signed up successfully')
         },
         error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            alert('There was an error. See the log to ge the message')
            console.log("Error: " + error.code + " " + error.message);
       }
    });
   },
   resetPassword: function(email) {
      Parse.User.requestPasswordReset("email", {
         success: function() {
         // Password reset request was sent successfully
         alert("password reset link sent")
         },
         error: function(error) {
            // Show the error message somewhere
         alert("Error: " + error.code + " " + error.message);
         }
      });
   },
   logout: function() {
      Parse.User.logOut();
      console.log('logged out');
      alert('logged out');
      var currentUser = Parse.User.current(); 
      user = Parse.User.current(); 
   },
   getUsers: function() {
      
   }
};
}])
;
