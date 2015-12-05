var myApp = angular.module("myApp", ['ngRoute', 'ngMap', 'myAppController']);

myApp.run(function($rootScope) {
    $rootScope.register = 'http://localhost:5000/register/';
    $rootScope.getEvents = 'http://localhost:5000/get_events/';
    $rootScope.postEvent = 'http://localhost:5000/post_event/';
    $rootScope.cancelEvent = 'http://localhost:5000/cancel_event/';
    $rootScope.login = 'http://localhost:5000/login/';
    $rootScope.user = 'vijay';
});

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/mainView', {
            templateUrl: 'partials/mainView.html',
            controller: 'initializeCtrl'
        }).
        when('/create', {
            templateUrl: 'partials/create.html',
            controller: 'createCtrl'
        }).
        when('/view', {
            templateUrl: 'partials/view.html',
            controller: 'viewCtrl'
        }).
        when('/myProfile', {
            templateUrl: 'partials/myProfile.html'
        }).
        when('/myRatings', {
            templateUrl: 'partials/myProfile.html',
            controller: 'ratingsCtrl'
        }).
        when('/myEvents', {
            templateUrl: 'partials/myProfile.html',
            controller: 'myEventsCtrl'
        }).
        when('/myCircles', {
            templateUrl: 'partials/myProfile.html',
            controller: 'myCirclesCtrl'
        }).
        otherwise({
            redirectTo: '/mainView'
        });
}]);
