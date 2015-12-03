var myApp = angular.module("myApp", ['ngRoute', 'ngMap', 'myAppController']);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/mainView', {
           templateUrl: 'partials/mainView.html'
        }).
        when('/create', {
            templateUrl: 'partials/create.html',
            controller: 'createCtrl'
        }).
        when('/view', {
            templateUrl: 'partials/view.html'
        }).
        when('/myEvents', {
            templateUrl: 'partials/myEvents.html'
        }).
        when('/circles', {
            templateUrl: 'partials/circles.html'
        }).
        otherwise({
            redirectTo: '/mainView'
        });
}]);
