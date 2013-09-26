var ctsmApp = angular.module("ctsmApp", ["firebase"])
  .config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
});

function PeopleController($scope, angularFire) {
  var ref = new Firebase('https://ctsm.firebaseio.com/people');
  angularFire(ref, $scope, 'people')
}

