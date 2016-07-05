// script.js

// create the module and name it app
var app = angular.module('app', ['keys']);

// create the controller and inject Angular's $scope
app
.controller('main', ['$scope', '$rootScope', 'ParseSvc', function($scope, $rootScope, ParseSvc){
  //calls appOpened once on controller's instantiation
  var init = function() {
    ParseSvc.appOpened();
  };
  init();
  $scope.username = $rootScope.username;
  $rootScope.$on('new username', function(event, data){
    $scope.username= data;
    if ($scope.username !== "" ) {
      $scope.$apply();
    }
  });
  $scope.isUser =function() {
    if ($scope.username === "" || $scope.username === undefined) {
      return false;
    }
    else {
      return true;
    }
  }
}])
.controller('userlist', ['$scope', 'ParseSvc', function($scope, ParseSvc){
  $scope.users = [];
  $scope.sucessCallback = function(results) {
    for (i = 0; i < results.length; ++i) {
      $scope.users.push({
        username: results[i].getUsername(),
        email: results[i].getEmail()
      });
    } 
    $scope.$apply();
    console.log($scope.users);
  };
  ParseSvc.getUsers($scope.sucessCallback);
}])


//code to print text
.controller('print', ['$scope','ParseSvc', function($scope, ParseSvc){
}])




.controller('login', ['$scope', '$rootScope','ParseSvc', function($scope, $rootScope, ParseSvc){
  //callback function to set global username on login sucess
  //This is neccessary because JavaScript runs sychronously
  //callback functions are one way to preserve asynchronicity
  var loginCallback = function () {
    $rootScope.$broadcast('new username', ParseSvc.getUsername());
  }
  $scope.user = {
    username: null,
    password: null,
  };
  if(ParseSvc.isRegistered) {
    $rootScope.username = ParseSvc.getUsername();
  }
  $scope.login = function () {
    ParseSvc.login($scope.user, loginCallback)
  }

}])
.controller('signUp', ['$scope','$rootScope','ParseSvc', function($scope, $rootScope, ParseSvc){
  var signupCallback = function () {
    $rootScope.$broadcast('new username', ParseSvc.getUsername());
  }
  $scope.user = {
    username: null,
    password: null,
    password2: null,
    email: null,
    name: null
  };
  if(ParseSvc.isRegistered) {
    $rootScope.username = ParseSvc.getUsername();
  }
  $scope.signUp = function () {
    if ($scope.user.password !== $scope.user.password2) {
      alert('Passwords don\'t match');
      return;
    }
    ParseSvc.signUp($scope.user, signupCallback);
  }

}])
.controller('reset', ['$scope','ParseSvc', function($scope, ParseSvc){
  $scope.email = null;
  $scope.resetPassword = function () {
    ParseSvc.resetPassword($scope.email)
  }

}])
.controller('logout', ['$scope','$rootScope','ParseSvc', function($scope, $rootScope, ParseSvc){
  var logoutCallback = function() {
    $rootScope.$broadcast('new username', "");
  }
  $scope.logout = function () {
    ParseSvc.logout(logoutCallback);
  }

}])
.factory('ParseSvc', ['$http', 'KeySvc', function($http, KeySvc) {

  key1 = KeySvc.key1;
  key2 = KeySvc.key2;
  key3 = KeySvc.key3;
  Parse.initialize(key1, key2);
  Parse.serverURL = 'https://parseapi.back4app.com';
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
    login: function(_user, successCallback) {
      Parse.User.logIn(_user.username, _user.password, {
        success: function(_user) {
          user = _user;
          console.log(user.get('username'));
          // Do stuff after successful login.
          alert('Logged in as ' + user.get('username'));
          successCallback();
        },
        error: function(user, error) {
          // The login failed. Check error to see why
          console.log("Error: " + error.code + " " + error.message);
          alert('Login failed');
        }
      });
    },
    signUp: function(_user, successCallback) {
      user = new Parse.User();
      user.set("username", _user.username.toLowerCase());
      user.set("email", _user.email);
      user.set("password", _user.password);
      user.set("firstName", _user.firstName);
      user.set("lastName", _user.lastName);
      user.signUp(null, {
        success: function(user) {
          // Hooray! Let them use the app now.
          alert('Signed up successfully')
          successCallback();
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert('There was an error. See the log to ge the message')
            console.log("Error: " + error.code + " " + error.message);
        }
      });
    },
    resetPassword: function(email) {
      Parse.User.requestPasswordReset(email, {
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
    logout: function(sucessCallback) {
      Parse.User.logOut();
      console.log('logged out');
      alert('logged out');

      var currentUser = Parse.User.current(); 
      user = Parse.User.current(); 
      isRegistered = false;
      sucessCallback();
    },
    getUsers: function(sucessCallback) {
      var user_query = new Parse.Query(Parse.User);
      user_query.select("username", "email");
      user_query.find().then(function(results) {
        sucessCallback(results);
      });
    },
    appOpened: function() {
      $http({
        method: 'POST',
        url: 'https://parseapi.back4app.com/1/events/AppOpened',
        headers: {
          'X-Parse-Application-Id': "9gVPgmfhQbcvkd5jwXdtuCmIjqXLiAFWkfBGPu9s", 
          'X-Parse-REST-API-Key': "kyhaSMYNAGSslxKpiikk4BShk0GjkffpUTUrOp7P",
          'Content-Type': "application/json"
        },
        data: {}
      });
    },
    printClicked: function(text) {
      today = new Date();
      Parse.Analytics.track('print', {
        text: text,
        date: today.toString(),
        platform: 'web'
      });
    }
  };
}])
;
