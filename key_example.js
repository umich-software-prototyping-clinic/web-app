// This module stores the parse keys
// It is in .gitignore in order to keep them secret
// You will need to sign up for parse and use your own keys
// Accounts are free at www.parse.com
//
// The keys can be accessed by including the keys module and 
// calling KeySvc.key1, KeySvc.key2
angular.module('keys_example', [])

.factory('KeySvcExample', function() {
    return {
        key1:"****************************************",
        key2:"****************************************"
    };
});