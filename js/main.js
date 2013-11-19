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

ctsmApp.filter('startFrom', function() {
  return function(input, start) {
    if(input) {
      start = +start; //parse to int
      return input.slice(start);
    }
    return [];
  }
});

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
  $scope.doneLoading = false;
  function sortPublications(pubType){
    var sortedPublications = [];
    data.forEach(function(childSnapshot){
      if(childSnapshot.val().type === pubType){
        sortedPublications.push(childSnapshot.val());
      }
    });
    return sortedPublications;
  }
  var pubUrl = new Firebase('https://ctsm.firebaseio.com/publications');
  pubUrl.once('value', function(dataSnapshot){
    data = dataSnapshot;
    dataLength = data.numChildren();
    publications = angularFireCollection(pubUrl);
    $scope.textbooks = sortPublications('Textbooks', function(){
      $scope.noOfPages = Math.ceil($scope.textbooks/$scope.entryLimit);
    });
    $scope.journalArticles = sortPublications('Journal Articles');
    $scope.conferences = sortPublications('Conferences');
    $scope.technicalReports = sortPublications('Technical Reports');
    $scope.publications = [$scope.textbooks, $scope.journalArticles, $scope.conferences, $scope.technicalReports];
    $scope.doneLoading = true;
  });
  $scope.getNumOfPages = function(array){
    $scope.noOfPages = Math.ceil(array.length/$scope.entryLimit);
  };

  $scope.currentPage = 1; //current page
  $scope.maxSize = 10; //pagination max size
  $scope.entryLimit = 10; //max rows for data table

  /* init pagination with $scope.list */
  $scope.setPage = function(pageNo) {
    $scope.currentPage = pageNo;
  };
};

function NewsController($scope, angularFireCollection) {
  $scope.news = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/news'));
};

function AboutsController($scope, angularFire) {
  var ref = new Firebase('https://ctsm.firebaseio.com/abouts');
  angularFire(ref, $scope, 'abouts');
};

function ImagesController($scope, angularFireCollection) {
  $scope.indexImages = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/indexImages'));
}

function AdminCtrl($scope, angularFireCollection, angularFireAuth) {
  $scope.people, $scope.courses, $scope.publications, $scope.abouts, $scope.news, $scope.projects, $scope.indexImages = [];
  $scope.newPublication = {};
  var getPeopleData = function() {
  	if(!$scope.people){
  		$scope.people = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/people'));
  	}
  };
  $scope.getPublicationsData = function() {
    var count = 0;
    $scope.pubType = 'Textbooks';
    $scope.currentPage = 1; //current page
    $scope.maxSize = 10; //pagination max size
    $scope.entryLimit = 10; //max rows for data table
    $scope.setPage = function(pageNo) {
      $scope.currentPage = pageNo;
    };

  	if(!$scope.publications){
  		$scope.publications = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/publications'), function(dataSnapshot){
        pubData = dataSnapshot;
      });
  	}
    $scope.changePubType = function(pubType){
      $scope.pubType = pubType;
      pubData.forEach(function(childSnapshot){
        if(childSnapshot.val().type === pubType){
          count++;
          $scope.noOfPages = Math.ceil(count/$scope.entryLimit);
        }
      });
    }
  };
  $scope.getAboutsData = function() {
  	if(!$scope.abouts){
  		$scope.abouts = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/abouts'));
  	}
  };
  $scope.getNewsData = function() {
  	if(!$scope.news){
  		$scope.news = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/news'));
  	}
  };
  $scope.getProjectsData = function() {
  	if(!$scope.projects){
  		$scope.projects = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/projects'));
  	}
  };
  $scope.getCoursesData = function() {
  	if(!$scope.courses){
  		$scope.courses = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/courses'));
  	}
  };
  $scope.getImagesData = function() {
  	$scope.indexImages = angularFireCollection(new Firebase('https://ctsm.firebaseio.com/indexImages'));
  };
  var url = new Firebase('https://ctsm.firebaseio.com/');
  angularFireAuth.initialize(url, {scope: $scope, name: "user"});
  getPeopleData();
  $scope.login = function() {
    angularFireAuth.login('password', {
      email: $scope.login.email,
      password: $scope.login.password
    });
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
    if($scope.publications[index].pubType){
      console.log($scope.publications[index]);
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