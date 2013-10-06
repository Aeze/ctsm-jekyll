var ctsmApp = angular.module("ctsmApp", ["firebase", "ui.tinymce"])
  .config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
});

function PeopleController($scope, angularFire) {
  var ref = new Firebase('https://ctsm.firebaseio.com/people');
  angularFire(ref, $scope, 'people')
}

function AboutController($scope, angularFire) {
	var ref = new Firebase('https://ctsm.firebaseio.com/abouts');
	angularFire(ref, $scope, 'abouts');
}

function AdminCtrl($scope, angularFireCollection, angularFireAuth) {
	$scope.people, $scope.courses, $scope.publications, $scope.abouts, $scope.news, $scope.projects = [];
	var getData = function() {
		$scope.people = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/people'));
		$scope.publications = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/publications'));
		$scope.abouts = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/abouts'));
		$scope.news = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/news'));
		$scope.projects = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/projects'));
		$scope.courses = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/courses'));
	};
	var url = new Firebase('https://ctsm.firebaseio.com/');
	angularFireAuth.initialize(url, {scope: $scope, name: "user"});
	getData();
	$scope.login = function() {
	  angularFireAuth.login('password', {
	  	email: $scope.login.email,
	  	password: $scope.login.password
	  });
	  getData();
	  $scope.login = {};
	};
	$scope.logout = function() {
	  angularFireAuth.logout();
	};
	$scope.filePick = function() {
		filepicker.pickAndStore({mimetype:"image/*"},
  	{location:"S3"}, function(InkBlobs){
   		$scope.newPerson.photo='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
		});
	};
	$scope.changePhoto = function(index) {
		filepicker.pickAndStore({mimetype:"image/*"},
  	{location:"S3"}, function(InkBlobs){
   		$scope.people[index].photo='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
   		console.log(InkBlobs[0].key);
		});
	}
	$scope.pubPicPick = function() {
		filepicker.pickAndStore({mimetype:"image/*"},
  	{location:"S3"}, function(InkBlobs){
   		$scope.newPublication.photo='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
		});
	};
	$scope.changePubPicPick = function(index) {
		filepicker.pickAndStore({mimetype:"image/*"},
  	{location:"S3"}, function(InkBlobs){
   		$scope.publications[index].photo='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
   		console.log(InkBlobs[0].key);
		});
	}
	$scope.publicationPick = function() {
		filepicker.pickAndStore({extension: '.pdf'},
  	{location:"S3"}, function(InkBlobs){
   		$scope.newPublication.article='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
		});
	}
	$scope.changePublication = function(index) {
		filepicker.pickAndStore({extension: '.pdf'},
  	{location:"S3"}, function(InkBlobs){
   		$scope.publications[index].article='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
   		console.log(InkBlobs[0].key);
		});
	}
	$scope.projectPicPick = function() {
		filepicker.pickAndStore({mimetype:"image/*"},
  	{location:"S3"}, function(InkBlobs){
   		$scope.newProject.photo='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
		});
	};
	$scope.changeProjectPicPick = function(index) {
		filepicker.pickAndStore({mimetype:"image/*"},
  	{location:"S3"}, function(InkBlobs){
   		$scope.projects[index].photo='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
   		console.log(InkBlobs[0].key);
		});
	}
}

ctsmApp.directive('peopleAdmin', [function () {
	return {
		templateUrl: '../templates/people_admin.html',
		replace: true,
		transclude: true,
		restrict: 'A',
	};
}])

ctsmApp.directive('aboutAdmin', [function () {
	return {
		templateUrl: '../templates/about_admin.html',
		replace: true,
		transclude: true,
		restrict: 'A'
	};
}])

ctsmApp.directive('coursesAdmin', [function () {
	return {
		templateUrl: '../templates/courses_admin.html',
		replace: true,
		transclude: true,
		restrict: 'A'
	};
}])

ctsmApp.directive('publicationsAdmin', [function () {
	return {
		templateUrl: '../templates/publications_admin.html',
		replace: true,
		transclude: true,
		restrict: 'A'
	};
}])

ctsmApp.directive('publicationsAdmin', [function () {
	return {
		templateUrl: '../templates/publications_admin.html',
		replace: true,
		transclude: true,
		restrict: 'A'
	};
}])

ctsmApp.directive('projectsAdmin', [function () {
	return {
		templateUrl: '../templates/projects_admin.html',
		replace: true,
		transclude: true,
		restrict: 'A'
	};
}])

ctsmApp.directive('newsAdmin', [function () {
	return {
		templateUrl: '../templates/news_admin.html',
		replace: true,
		transclude: true,
		restrict: 'A'
	};
}])