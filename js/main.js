var ctsmApp = angular.module("ctsmApp", ["firebase", "ui.tinymce", "ui.bootstrap"])
  .config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
});

ctsmApp.factory('Feed', ['$http', function ($http) {
  return {
    parseFeed: function (url) {
      return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
    }
  }
}]);

var FeedCtrl = function($scope, Feed) {
  Feed.parseFeed('http://feed.eng.umd.edu/news/feed.xml').then(function (res) {
      $scope.feeds = res.data.responseData.feed.entries;
   });
};

function PeopleController($scope, angularFireCollection) {
  $scope.people = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/people'));
  $scope.personType=['Directors', 'Associates', 'Graduate Students', 'Undergraduate Students'];
};

function ProjectsController($scope, angularFireCollection) {
	$scope.projects = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/projects'));
};

function CoursesController($scope, angularFireCollection) {
	$scope.courses = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/courses'));
};

function PublicationsController($scope, angularFireCollection) {
	$scope.publications = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/publications'));
	$scope.pubType=['Textbooks', 'Journal Articles', 'Conferences', 'Technical Reports'];
};

function NewsController($scope, angularFireCollection) {
  $scope.news = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/news'));
};

function AboutsController($scope, angularFire) {
  var ref = new Firebase('https://ctsm.firebaseio.com/abouts');
  angularFire(ref, $scope, 'abouts');
};

function AdminCtrl($scope, angularFireCollection, angularFireAuth) {
	$scope.people, $scope.courses, $scope.publications, $scope.abouts, $scope.news, $scope.projects, $scope.indexImages = [];
	$scope.newPublication = {};
	var getData = function() {
		$scope.people = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/people'));
		$scope.publications = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/publications'));
		$scope.abouts = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/abouts'));
		$scope.news = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/news'));
		$scope.projects = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/projects'));
		$scope.courses = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/courses'));
		$scope.indexImages = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/indexImages'));
	};
	var url = new Firebase('https://ctsm.firebaseio.com/');
	angularFireAuth.initialize(url, {scope: $scope, name: "user"});
	$scope.login = function() {
	  angularFireAuth.login('password', {
	  	email: $scope.login.email,
	  	password: $scope.login.password
	  });
	  getData();
	};
	$scope.logout = function() {
	  angularFireAuth.logout();
	};
	$scope.$on("angularFireAuth:error", function(evt, err) {
  	$scope.invalidCredentials = true;
	});
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
	};
	$scope.aboutPicPick = function() {
		filepicker.pickAndStore({mimetype:"image/*"},
  	{location:"S3"}, function(InkBlobs){
   		$scope.newAbout.photo='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
		});
	};
	$scope.changeAboutPicPick = function(index) {
		filepicker.pickAndStore({mimetype:"image/*"},
  	{location:"S3"}, function(InkBlobs){
   		$scope.abouts[index].photo='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
   		console.log(InkBlobs[0].key);
		});
	};
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
	};
	$scope.publicationPick = function() {
		filepicker.pickAndStore({extension: '.pdf'},
  	{location:"S3"}, function(InkBlobs){
   		$scope.newPublication.article='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
		});
	};
	$scope.changePublication = function(index) {
		filepicker.pickAndStore({extension: '.pdf'},
  	{location:"S3"}, function(InkBlobs){
   		$scope.publications[index].article='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
   		console.log(InkBlobs[0].key);
		});
	};
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
	};
	$scope.indexImagePick = function() {
		filepicker.pickAndStore({mimetype:"image/*"},
  	{location:"S3"}, function(InkBlobs){
   		$scope.newIndexImage.photo='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
		});
	};
	$scope.changeIndexImagePick = function(index) {
		filepicker.pickAndStore({mimetype:"image/*"},
  	{location:"S3"}, function(InkBlobs){
   		$scope.indexImages[index].photo='https://s3-us-west-2.amazonaws.com/ctsmfiles/'+InkBlobs[0].key;
   		console.log(InkBlobs[0].key);
		});
	};
	$scope.submitNewPublication = function() {
		if($scope.newPublication.pubType){
			$scope.publications.add($scope.newPublication);
			$scope.newPublication = {};
			$scope.newpublication = false;
		} else {
			$scope.tryAgain = true;
		};
	};
	$scope.updatePublication = function(index) {
		if($scope.publication.pubType){
			$scope.publications.update($scope.publications[index]);
		} else {
			$scope.tryUpdateAgain = true;
		};
	};
};

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

ctsmApp.directive('indexImagesAdmin', [function () {
	return {
		templateUrl: '../templates/index_images_admin.html',
		replace: true,
		transclude: true,
		restrict: 'A'
	};
}])