var myApp = angular.module("myApp", ['ngRoute', 'ngMap', 'myAppController']);

myApp.run(function($rootScope) {
    $rootScope.register = 'http://localhost:5000/register/';
    $rootScope.getEvents = 'http://localhost:5000/get_events/';
    $rootScope.postEvent = 'http://localhost:5000/post_event/';
    $rootScope.cancelEvent = 'http://localhost:5000/cancel_event/';
    $rootScope.login = 'http://localhost:5000/login/';
    $rootScope.getRatings = 'http://localhost:5000/get_ratings/';
    $rootScope.checkUser = 'http://localhost:5000/is_existent/';
    $rootScope.addCircle = 'http://localhost:5000/add_circle/';
    $rootScope.postRatings = 'http://localhost:5000/post_ratings/';
});

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginCtrl'
        }).
        when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'registerCtrl'
        }).
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
            templateUrl: 'partials/myProfile.html',
            controller: 'profileCtrl'
        }).
        when('/showEvent', {
            templateUrl: 'partials/showEvent.html',
            controller: 'showEventCtrl'
        }).
        otherwise({
            redirectTo: '/login'
        });
}]);
